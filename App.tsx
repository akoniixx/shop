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
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import { Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
import storeVersion from 'react-native-store-version';
import RNExitApp from 'react-native-kill-app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PERMISSIONS,
  checkNotifications,
  request,
} from 'react-native-permissions';
import { NetworkProvider } from './src/contexts/NetworkContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toast-config';
import { OrderLoadsProvider } from './src/contexts/OrdersLoadContext';
import crashlytics from '@react-native-firebase/crashlytics';

dayjs.extend(buddhaEra);
dayjs.locale('th');

const App = () => {
  const checkVersion = async () => {
    const isIOS = Platform.OS === 'ios';
    const currentVersion = VersionCheck.getCurrentVersion();
    const storeUrl = await VersionCheck.getStoreUrl({
      appID: '6450009350',
    });

    const getPackage = await VersionCheck.getPackageName();

    const playStoreUrl = await VersionCheck.getPlayStoreUrl({
      packageName: getPackage,
    });

    const { remote } = await storeVersion({
      version: currentVersion,
      androidStoreURL: playStoreUrl,
      iosStoreURL: storeUrl,
      country: 'TH',
    });

    const needUpdate = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion: remote,
    });

    if (needUpdate.isNeeded) {
      Alert.alert('มีการอัพเดทใหม่', undefined, [
        {
          text: 'อัพเดท',
          onPress: async () => {
            if (isIOS) {
              await Linking.openURL(storeUrl);
            } else {
              await Linking.openURL(playStoreUrl);
            }
            RNExitApp.exitApp();
          },
        },
      ]);
    }
  };

  React.useEffect(() => {
    const checkPermission = () => {
      checkNotifications().then(async ({ status }) => {
        if (status === 'denied' || status === 'blocked') {
          if (Platform.OS === 'android' && Platform.Version >= 33) {
            request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          }
          requestUserPermission();
        }
      });
    };

    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    checkPermission();
    requestUserPermission();
    checkVersion();
  }, []);

  React.useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        const typeNotification = remoteMessage?.data?.type;
        const company = remoteMessage?.data?.company || '';

        switch (typeNotification) {
          case 'ORDER':
            {
              const onNavigateHistoryDetail = async () => {
                await AsyncStorage.setItem('company', company);
                await AsyncStorage.setItem('isFromNotification', 'true');
                navigationRef.current?.navigate('HistoryDetailScreen', {
                  orderId: remoteMessage?.data?.orderId,
                  isFromNotification: true,
                });
              };
              onNavigateHistoryDetail();
            }
            break;
          case 'PROMOTION':
            {
              navigationRef.current?.navigate('NewsPromotionDetailScreen', {
                fromNoti: true,
                promotionId: remoteMessage?.data?.promotionId,
              });
            }
            break;
        }
      });
    messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const company = remoteMessage?.data?.company || '';

        const typeNotification = remoteMessage?.data?.type;
        switch (typeNotification) {
          case 'ORDER':
            {
              const onNavigateHistoryDetail = async () => {
                await AsyncStorage.setItem('company', company);
                await AsyncStorage.setItem('isFromNotification', 'true');

                navigationRef.current?.navigate('HistoryDetailScreen', {
                  orderId: remoteMessage?.data?.orderId,
                  isFromNotification: true,
                });
              };
              onNavigateHistoryDetail();
            }
            break;
          case 'PROMOTION':
            {
              navigationRef.current?.navigate('NewsPromotionDetailScreen', {
                fromNoti: true,
                promotionId: remoteMessage?.data?.promotionId,
              });
            }
            break;
        }
      },
    );
    messaging().onMessage(async remoteMessage => {
      const typeNotification = remoteMessage?.data?.type;
      switch (typeNotification) {
        case 'ORDER':
          {
            Toast.show({
              type: 'orderToast',
              text1: remoteMessage?.notification?.title,
              text2: remoteMessage?.notification?.body,
              onPress: () => {
                navigationRef.current?.navigate('HistoryDetailScreen', {
                  orderId: remoteMessage?.data?.orderId,
                  isFromNotification: true,
                });
                Toast.hide();
              },
            });
          }
          break;
        case 'PROMOTION':
          {
            Toast.show({
              type: 'promotionToast',
              text1: remoteMessage?.notification?.title,
              text2: remoteMessage?.notification?.body,
              onPress: () => {
                navigationRef.current?.navigate('NewsPromotionDetailScreen', {
                  fromNoti: true,
                  promotionId: remoteMessage?.data?.promotionId,
                });
                Toast.hide();
              },
            });
          }
          break;
      }
    });
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
      <NetworkProvider>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider>
            <AuthProvider>
              <OrderLoadsProvider>
                <CartProvider>
                  <SheetProvider>
                    <AppNavigator />
                  </SheetProvider>
                </CartProvider>
              </OrderLoadsProvider>
            </AuthProvider>
          </LocalizationProvider>
          <>
            <Toast config={toastConfig} />
          </>
        </QueryClientProvider>
      </NetworkProvider>
    </NavigationContainer>
  );
};

export default App;
