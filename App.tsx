import React from 'react';
import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import SplashScreen from 'react-native-splash-screen';
import { SheetProvider } from 'react-native-actions-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigations/RootNavigator';
import { LocalizationProvider } from './src/contexts/LocalizationContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigations/AppNavigator';

dayjs.extend(buddhaEra);

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <LocalizationProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </LocalizationProvider>
    </NavigationContainer>
  );
};

export default App;
