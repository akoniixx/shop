import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginSuccessScreen from '../screens/LoginSuccessScreen';
import OtpScreen from '../screens/OtpScreen';

export type AuthStackParamList = {
  LoginScreen: undefined;
  OtpScreen: {
    token: string;
    refCode: string;
    tel: string;
  };
  WelcomeScreen: undefined;
  LoginSuccessScreen: undefined;
};
const Stack = createStackNavigator<AuthStackParamList>();
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LoginScreen">
      <Stack.Group>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
