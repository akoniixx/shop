import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';

export type MainStackParamList = {
  MainScreen: undefined;
};
const Stack = createStackNavigator<MainStackParamList>();
export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
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
