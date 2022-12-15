import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';
import SelectCompanyScreen from '../../screens/SelectCompanyScreen';

export type MainStackParamList = {
  MainScreen: undefined;
  SelectCompanyScreen: undefined;
};
const Stack = createStackNavigator<MainStackParamList>();
export default function MainNavigator() {
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
      </Stack.Group>
    </Stack.Navigator>
  );
}
