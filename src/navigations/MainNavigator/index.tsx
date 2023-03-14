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
import CartScreen from '../../screens/CartScreen';
import HistoryDetailScreen from '../../screens/HistoryDetailScreen';
import CancelOrderScreen from '../../screens/CancelOrderScreen';
import ConfirmOrderScreen from '../../screens/ConfirmOrderScreen';
import ConfirmOrderSuccessScreen from '../../screens/ConfirmOrderSuccessScreen';
import CancelOrderSuccessScreen from '../../screens/CancelOrderSuccessScreen';

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
  CartScreen: undefined;
  HistoryDetailScreen: {
    orderId: string;
  };
  CancelOrderScreen: {
    orderId: string;
    orderProducts: {
      baseUom: string;
      commonName: string;
      marketPrice: number;
      isFreebie: boolean;

      orderId: string;
      orderProductId: string;
      packSize: string;
      packingUom: string;
      productCodeNav: string;
      productId: number;
      productName: string;
      productImage: string | null;
      qtySaleUnit: number;
      quantity: number;
      saleUom: string;
      saleUomTh: string;
      shipmentOrder: number;
      totalPrice: number;
    }[];
    paidStatus: string;
    soNo: string | null;
    navNo: string | null;
    orderNo: string;
  };
  CancelOrderSuccessScreen: {
    updateAt: string;
    orderId: string;
    cancelRemark: string;
    orderProducts: {
      baseUom: string;
      commonName: string;
      marketPrice: number;
      orderId: string;
      orderProductId: string;
      packSize: string;
      packingUom: string;
      productCodeNav: string;
      productId: number;
      productName: string;
      productImage: string | null;
      qtySaleUnit: number;
      quantity: number;
      saleUom: string;
      saleUomTh: string;
      shipmentOrder: number;
      totalPrice: number;
      isFreebie: boolean;
    }[];
    paidStatus: string;
    soNo: string | null;
    navNo: string | null;
    orderNo: string;
  };
  ConfirmOrderSuccessScreen: {
    orderId: string;
    paidStatus: string;
    soNo: string;
    navNo: string;
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
      screenOptions={{ headerShown: false, gestureEnabled: false }}
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
        <Stack.Screen name="CartScreen" component={CartScreen} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="HistoryDetailScreen"
          component={HistoryDetailScreen}
        />
        <Stack.Screen name="CancelOrderScreen" component={CancelOrderScreen} />
        <Stack.Screen
          name="CancelOrderSuccessScreen"
          component={CancelOrderSuccessScreen}
        />
        <Stack.Screen
          name="ConfirmOrderSuccessScreen"
          component={ConfirmOrderSuccessScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
