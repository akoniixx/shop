import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';
import SelectCompanyScreen from '../../screens/SelectCompanyScreen';
import LoginSuccessScreen from '../../screens/LoginSuccessScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../RootNavigator';
import TermAndConditionScreen from '../../screens/TermAndConditionScreen';
import SelectPickUpLocationScreen from '../../screens/ICPI/SelectPickUpLocationScreen';
import StoreDetailScreen from '../../screens/StoreDetailScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';

export type MainStackParamList = {
  MainScreen: {
    company?: string;
  };
  SelectCompanyScreen: undefined;
  LoginSuccessScreen: undefined;
  TermAndConditionScreen: undefined;
  SelectPickUpLocationScreen: undefined;
  StoreDetailScreen: undefined;
  ProductDetailScreen: {
    productId: string;
  };
};
const Stack = createStackNavigator<MainStackParamList>();
export default function MainNavigator() {
  useEffect(() => {
    const getAlreadyAcceptTerm = async () => {
      const alreadyAcceptTerm = await AsyncStorage.getItem('alreadyAcceptTerm');
      if (alreadyAcceptTerm === null) {
        navigate('TermAndConditionScreen');
      } else {
        navigate('SelectCompanyScreen');
      }
    };
    getAlreadyAcceptTerm();
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SelectCompanyScreen">
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
        }}>
        <Stack.Screen
          name="SelectCompanyScreen"
          component={SelectCompanyScreen}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainTabBottomNavigator}
          options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        />

        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
        <Stack.Screen
          name="TermAndConditionScreen"
          component={TermAndConditionScreen}
        />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name="SelectPickUpLocationScreen"
          component={SelectPickUpLocationScreen}
        />
        <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
