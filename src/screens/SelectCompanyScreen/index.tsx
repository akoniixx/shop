import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import images from '../../assets/images';
import { colors } from '../../assets/colors/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import Text from '../../components/Text/Text';
import { useMappingCompany } from '../../hook';
import icons from '../../assets/icons';
import { navigate } from '../../navigations/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectCompanyScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'SelectCompanyScreen'>): JSX.Element {
  const {
    state: { user },
    authContext: { logout, getUser },
    dispatch,
  } = useAuth();
  const { t } = useLocalization();
  const { mappingLogo, mappingName } = useMappingCompany();

  React.useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [getUser, user]);
  const onLogout = async () => {
    await logout();
    navigate('initPage');
  };
  const listCompany =
    user?.customerToUserShops?.[0]?.customer?.customerCompany || [];
  const customerName = listCompany.find(el => el.isActive);

  return (
    <Container>
      <Content
        style={{
          backgroundColor: colors.primary,
          padding: 0,
        }}>
        <View style={styles().container}>
          <Text fontFamily="NotoSans" fontSize={24} color="white">
            {t('screens.SelectCompanyScreen.welcomeTitle')}
          </Text>
          <Text color="white">{customerName?.customerName}</Text>
          <Image
            source={images.SelectCompany}
            style={{
              width: 282,
              height: 188,
            }}
          />
        </View>
        <View style={styles().card}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              center
              fontFamily="NotoSans"
              fontSize={18}
              bold
              style={{
                marginBottom: 16,
              }}>
              {t('screens.SelectCompanyScreen.pleaseSelectCompany')}
            </Text>
            {listCompany.map((item, idx) => {
              return (
                <View key={idx} style={[styles().item, styles().itemShadow]}>
                  <TouchableOpacity
                    style={styles().item}
                    onPress={async () => {
                      await AsyncStorage.setItem('company', item.company);
                      await AsyncStorage.setItem(
                        'customerCompanyId',
                        item.customerCompanyId,
                      );
                      dispatch({ type: 'SET_COMPANY', company: item.company });
                      navigation.navigate('MainScreen', {
                        company: item.company,
                      });
                    }}>
                    <View style={styles().row}>
                      <View
                        style={{
                          height: 80,
                          width: 80,
                          paddingVertical: 8,
                          marginRight: 16,
                        }}>
                        <Image
                          source={mappingLogo(item.company)}
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text>{mappingName(item.company)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View
            style={{
              padding: 10,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={onLogout}
              style={{
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 10,
                }}
                source={icons.logout}
              />
              <Text
                semiBold
                fontFamily="NotoSans"
                fontSize={18}
                color="primary">
                {t('screens.SelectCompanyScreen.logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Content>
    </Container>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      marginTop: '16%',
      alignItems: 'center',
    },
    card: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 8,
      flex: 1,
      backgroundColor: colors.background1,
    },
    row: {
      flexDirection: 'row',
      paddingLeft: 16,
      alignItems: 'center',
    },
    list: {
      flex: 1,
      marginTop: 16,
    },
    item: {
      borderRadius: 12,
      paddingVertical: 8,
      backgroundColor: colors.white,
      justifyContent: 'center',
    },
    itemShadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      height: 80,
      marginHorizontal: 16,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 12,
      marginVertical: 8,
    },
  });
};
