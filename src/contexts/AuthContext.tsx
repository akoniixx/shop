import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthServices } from '../services/AuthService';
import { ProfileEntities } from '../entities/profileEntities';
import { userServices } from '../services/UserServices';
import messaging from '@react-native-firebase/messaging';

interface Props {
  children: JSX.Element;
}

interface State {
  isLoading: boolean;
  company?: null | string;

  user?: null | ProfileEntities;
  isExternal: boolean;
}

interface Action {
  type: string;
  user?: ProfileEntities | null;
  company?: string | null;
  isExternal?: boolean;
}

interface Context {
  authContext: {
    getUser: () => Promise<any>;
    login: (user: any) => Promise<any>;
    logout: () => Promise<void>;
  };
  state: State;
  dispatch: (value: Action) => void;
}

const initialState = {
  user: null,
  company: null,
  isLoading: true,
  dispatch: () => {
    console.log('dispatch');
  },
  isExternal: true,
};

const AuthContext = React.createContext<Context>({
  authContext: {
    getUser: Promise.resolve,
    login: Promise.resolve,
    logout: Promise.resolve,
  },
  state: initialState,
  dispatch(value) {
    console.log(value);
  },
});

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'GET_ME':
        return {
          ...prevState,
          user: action.user,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          user: null,
        };

      case 'LOGIN':
        return {
          ...prevState,
          user: action.user,
        };
      case 'SET_COMPANY':
        return {
          ...prevState,
          company: action.company,
        };
      case 'SET_PROFILE_IMG':
        if (!prevState.user) {
          return prevState;
        }
        return {
          ...prevState,
          user: {
            ...prevState.user,
            profileImage: action.user?.profileImage || '',
          },
        };
      case 'SWITCH_NOTIFICATION': {
        if (!prevState.user) {
          return prevState;
        }
        return {
          ...prevState,
          user: {
            ...prevState.user,
            notiStatus: action.user?.notiStatus || false,
          },
        };
      }
      case 'SET_EXTERNAL': {
        return {
          ...prevState,
          isExternal: action.isExternal || false,
        };
      }
      default:
        return prevState;
    }
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );

  const authContext = React.useMemo(
    () => ({
      getUser: async () => {
        try {
          const userShopId = (await AsyncStorage.getItem('userShopId')) || '';
          const user = await userServices.getUserShop(userShopId);

          if (user) {
            dispatch({ type: 'GET_ME', user: user });
          }
        } catch (e: any) {
          console.log(e);
        }
      },
      login: async (payload: any) => {
        try {
          const { data } = await AuthServices.verifyOtp(payload);

          const token = await messaging().getToken();
          await AsyncStorage.setItem('fcmtoken', token);
          const dataUser = Array.isArray(data.data) ? data.data[0] : data.data;

          await AsyncStorage.setItem('token', data.accessToken);
          await AsyncStorage.setItem('userShopId', dataUser.userShopId);
          await AsyncStorage.setItem(
            'companyAuth',
            JSON.stringify(
              data.data.customerToUserShops[0].customer.customerCompany,
            ),
          );
          const fcmtoken = await AsyncStorage.getItem('fcmtoken');
          if (fcmtoken) {
            await userServices.updateFcmToken({
              deviceToken: fcmtoken,
              userShopId: dataUser.userShopId,
              customerId: dataUser.customerToUserShops[0].customerId,
              token: data.accessToken,
            });
          }

          dispatch({ type: 'LOGIN', user: dataUser });
          return data;
        } catch (e: any) {
          console.log(e);
        }
      },
      logout: async () => {
        const fmctoken = (await AsyncStorage.getItem('fcmtoken')) || '';

        await userServices.removeDeviceToken(fmctoken).then(async res => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userShopId');
          await AsyncStorage.removeItem('fcmtoken');
          await AsyncStorage.removeItem('companyAuth');
          dispatch({ type: 'LOGOUT' });
        });
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (state.user) {
      const isExternal =
        state.user?.customerToUserShops[0].customer.customerCompany.every(
          el => {
            return !el.company.includes('ICP');
          },
        );

      dispatch({ type: 'SET_EXTERNAL', isExternal });
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ authContext, state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Context => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth can be use in AuthContext only');
  }
  return context;
};
