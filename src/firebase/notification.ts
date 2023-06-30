import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const credentials = {
//   databaseURL: '',
//   clientId:
//     '362287625596-vqjkf691nlgq0mdobdqi9auhfdpe29kv.apps.googleusercontent.com', // iOS
//   appId: '1:362287625596:ios:b549e9710844bdd685a0f9',
//   apiKey: 'AIzaSyCdf7gTRrOLBPvmJA8BGJAQtsKWi0hqdxE',
//   storageBucket: 'sellcoda-shop-v2-3e018.appspot.com',
//   messagingSenderId: '362287625596',
//   projectId: 'sellcoda-shop-v2-3e018',
// };
const credentialsProd = {
  databaseURL: '',
  clientId:
    '362287625596-28j17qorif0t2hgouiki4q0tp0ljvqbp.apps.googleusercontent.com',
  appId: '1:362287625596:ios:4434a4bdcca65bc085a0f9',
  apiKey: 'AIzaSyCdf7gTRrOLBPvmJA8BGJAQtsKWi0hqdxE',
  storageBucket: 'sellcoda-shop-v2-3e018.appspot.com',
  messagingSenderId: '362287625596',
  projectId: 'sellcoda-shop-v2-3e018',
};

export const firebaseInitialize = async () => {
  await firebase.initializeApp(credentialsProd);
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    getFCMToken();
  }
}

export const getFCMToken = async () => {
  const token = await messaging().getToken();

  await AsyncStorage.setItem('fcmtoken', token);
};

export const fcmOnListen = () => {
  messaging().onMessage(async remoteMessage => {
    // page.current = remoteMessage.notification.body;
  });
};
