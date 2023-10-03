import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useMemo } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}
export default function Body({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { company },
  } = useAuth();
  const ListMenus = useMemo(() => {
    const staticMenus = [
      {
        title: t('menu.order'),
        image: images.iconOrder,
        name: 'Order',
        styles: {
          width: 80,
          height: 80,
        },
        textStyle: {},
        onPress: async() => {
          await AsyncStorage.setItem('pickupLocation','NAKHON_LUANG');
          await navigation.navigate('StoreDetailScreen')
        },
      },
      {
        title: t('menu.history'),
        image: images.iconHistory,
        name: 'History',
        styles: {
          width: 80,
          height: 80,
          marginTop: 2,
        },
        textStyle: {
          bottom: 1,
        },
        onPress: () => {
          navigation.navigate('history');
        },
      },
      {
        title: t('menu.confirmOrder'),
        image: images.iconConfirmOrder,
        name: 'ConfirmOrder',
        styles: {
          width: 70,
          height: 70,
        },
        textStyle: {
          top: 5,
        },
        onPress: () => {
          navigation.navigate('confirmOrder');
        },
      },
    ];
    if (company === 'ICPI') {
      return staticMenus.filter(el => el.name !== 'ConfirmOrder');
    } else {
      return staticMenus.filter(el => el.name !== 'Order');
    }
  }, [t, navigation, company]);
  return (
    <View style={styles.container}>
      <View style={styles.containerMenu}>
        {ListMenus.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={item.onPress}>
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={{
                    ...item.styles,
                  }}
                />

                <Text
                  center
                  fontFamily="NotoSans"
                  style={{
                    position: 'relative',
                    ...item.textStyle,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={styles.body}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={images.news}
            style={{
              height: 100,
              width: 110,
            }}
          />
          <Text color="text3">{t('screens.HomeScreen.news')}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
    bottom: 24,
    backgroundColor: 'white',
  },
  containerMenu: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
