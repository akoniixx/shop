import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Content from '../../../components/Content/Content';
import { colors } from '../../../assets/colors/colors';
import Text from '../../../components/Text/Text';
import { useLocalization } from '../../../contexts/LocalizationContext';
import Button from '../../../components/Button/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from '../../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';

export const staticList = [
  {
    id: 1,
    title: 'โรงงาน นครหลวง (จ.พระนครศรีอยุธยา)',
    value: 'NAKHON_LUANG',
  },
  {
    id: 2,
    title: 'โรงงาน ศรีราชา (จ. ชลบุรี)',
    value: 'SRIRACHA',
  },
];
export default function SelectPickUpLocationScreen({
  navigation,
}: StackScreenProps<
  MainStackParamList,
  'SelectPickUpLocationScreen'
>): JSX.Element {
  const { t } = useLocalization();

  return (
    <Container>
      <Header title={t('screens.SelectPickupScreen.title')} />
      <Content
        style={{
          paddingHorizontal: 0,
          flex: 1,
          width: '100%',
          backgroundColor: colors.background1,
        }}>
        <View
          style={{
            paddingHorizontal: 16,
            width: '100%',
          }}></View>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.background1,
          }}>
          <Text color="text1" bold fontFamily="NotoSans">
            {t('screens.SelectPickupScreen.subTitle')}
          </Text>
        </View>
        <FlatList
          data={staticList}
          renderItem={({ item }) => (
            <>
              <View style={styles.container}>
                <Text color="text2">{item.title}</Text>
                <View>
                  <Button
                    onPress={async () => {
                      await AsyncStorage.setItem('pickupLocation', item.value);
                      navigation.navigate('StoreDetailScreen');
                    }}
                    title="เลือก"
                    style={{
                      height: 34,
                      width: 64,
                      paddingVertical: 0,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: colors.border1,
                  borderBottomWidth: 1,
                  marginHorizontal: 16,
                }}
              />
            </>
          )}
        />
      </Content>
      {/* <LoadingSpinner visible={isLoading} /> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
