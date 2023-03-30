import React from 'react';
import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigations/RootNavigator';
import { LocalizationProvider } from './src/contexts/LocalizationContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigations/AppNavigator';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CartProvider } from './src/contexts/CartContext';
import './src/components/Sheet/sheets.tsx';
import { SheetProvider } from 'react-native-actions-sheet';
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
dayjs.extend(buddhaEra);
dayjs.locale('th');

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    // const getTestFirebaseToken = async () => {
    //   const firebaseToken = await AsyncStorage.getItem('fcmtoken');
    //   console.log('firebaseToken', firebaseToken);
    // };
    // getTestFirebaseToken();
    requestUserPermission();
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
      },
    },
  });
  return (
    <NavigationContainer ref={navigationRef}>
      <SheetProvider>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider>
            <AuthProvider>
              <CartProvider>
                <AppNavigator />
              </CartProvider>
            </AuthProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </SheetProvider>
    </NavigationContainer>
  );
};

export default App;
