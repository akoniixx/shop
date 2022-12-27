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

dayjs.extend(buddhaEra);

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
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
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider>
          <CartProvider>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </CartProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
