import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { CustomerCompanyEntities } from '../../entities/profileEntities';
import Modal from 'react-native-modal/dist/modal';
import { userServices } from '../../services/UserServices';
import { responsiveHeigth, responsiveWidth } from '../../utils/responsive';
import { CustomerCompay } from '../../entities/productEntities';


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
  const [isVisible, setIsVisible] = React.useState(false);
  const [company, setCompany] = useState<CustomerCompay[]>([])
  /* const [productBrand, setProductBrand] = React.useState<Array<ProductBrand>>([
    {
      "productBrandId": "",
      "company": "",
      "productBrandName": "",
      "productBrandLogo": ""
    },
    {
      "productBrandId": "",
      "company": "",
      "productBrandName": "",
      "productBrandLogo": ""
    }
  ]) */

  interface ProductBrand {
    productBrandId: string;
    company: string;
    productBrandName: string;
    productBrandLogo: string;
  }

  interface GroupedByCompany {
    [companyName: string]: CustomerCompay[];
  }

  useEffect(() => {
   /*  getProductBrand() */
    getCompany()

  }, []);

  const getCompany = async () => {

    try {
      const companyStore = await AsyncStorage.getItem('companyAuth');
      if (companyStore != null) {
        setCompany(JSON.parse(companyStore))
      }
    } catch (error) {
      console.error('error get company from local', error)
    }


  }
/* 
  React.useEffect(() => {
    const get = async () => {
      const fcm = await AsyncStorage.getItem('fcmtoken');

    };
    get();
    if (!user) {
      getUser();
    }
  }, [getUser, user]);

 */
  const onLogout = async () => {
    await logout();
    navigate('initPage');
  };


  /*c onst getProductBrand = async () => {
    try {
      const res = await userServices.getProductBrand('ICPL')
      setProductBrand(res)
    } catch (error) {
      console.log(error)
    }
  } */

  const sortCompany = ["ICPL", "ICPI", "ICPF"]; 

  const listCompany =
    company || [];

  const groupedCustomers: any = {};

  listCompany.forEach((customer) => {
    const company = customer.company;
    if (!groupedCustomers[company]) {
      groupedCustomers[company] = [];
    }
    groupedCustomers[company].push(customer);
  });

  const sortedCompanyKeys = Object.keys(groupedCustomers).sort((a, b) => {
    let indexA = sortCompany.indexOf(a);
    let indexB = sortCompany.indexOf(b);
  
    if (indexA === -1) indexA = sortCompany.length;
    if (indexB === -1) indexB = sortCompany.length;
  
    return indexA - indexB;
  });

  const icplCustomers = groupedCustomers["ICPL"] || [];
  

  icplCustomers.sort((a, b) => a.productBrand[0].product_brand_id - b.productBrand[0].product_brand_id);

  const customerName = listCompany.find(el => el.isActive);

  
/* 
  function mappingICPLBrand(productBrandId: number) {
    const index = productBrandId.toString()
    const foundBrand = productBrand.find(item => item.productBrandId === index);
    return foundBrand ? foundBrand.productBrandName : 'dcd';
  }

  function mappingICPLLogo(productBrandId: number) {
    const index = productBrandId.toString()
    const foundBrand = productBrand.find(item => item.productBrandId === index);
    return foundBrand ? foundBrand.productBrandLogo : 'dcd';
  }

 */



  const onPress = async (item: CustomerCompay) => {
    await AsyncStorage.setItem(
      'termPayment',
      item.termPayment,
    );
    await AsyncStorage.setItem('zone', item.zone);
    await AsyncStorage.setItem('company', item.company);
    await AsyncStorage.setItem(
      'customerCompanyId',
      item.customerCompanyId,
    );
    dispatch({
      type: 'SET_COMPANY',
      company: item.company,
    });
    navigation.navigate('MainScreen', {
      company: item.company,
    });
  }


  return (
    <Container>

      <Content
        style={{
          backgroundColor: colors.primary,
          padding: 0,
        }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles().container}>
            <Text fontFamily="NotoSans" fontSize={24} color="white">
              {t('screens.SelectCompanyScreen.welcomeTitle')}
            </Text>
            <Text color="white">{customerName?.customerName}</Text>
            <Image
              source={images.SelectCompany}
              style={{
                width: 282,
                height: responsiveHeigth(188),
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
              {
  sortedCompanyKeys.map((companyKey) => {

    if (companyKey === 'ICPL') {
      return (
        <>
          {icplCustomers.length > 1 ?
            <>
              <View style={[styles().item, styles().itemShadow]}>
                <TouchableOpacity
                  style={styles().item}
                  onPress={() => setIsVisible(true)}
                >
                  <View style={styles().row}>
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        paddingVertical: 8,
                        marginRight: 10,
                      }}>
                      <Image
                        source={mappingLogo('ICPL')}
                        style={{
                          height: '100%',
                          width: '100%',
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text>{mappingName('ICPL')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
            :
            <>
              {icplCustomers.map((item:CustomerCompay, idx:number) => {
                return (
                  <View key={idx} style={[styles().item, styles().itemShadow]}>

                    <TouchableOpacity
                      style={styles().item}
                      onPress={() => onPress(item)}>
                      <View style={styles().row}>
                        <View
                          style={{
                            height: 60,
                            width: 60,
                            paddingVertical: 8,
                            marginRight: 10,
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
            </>
          }
        </>
      )
    } else {
      return (
        <>
          {groupedCustomers[companyKey].map((item:CustomerCompay, idx:number) => {
            return (
              <View key={idx} style={[styles().item, styles().itemShadow]}>

                <TouchableOpacity
                  style={styles().item}
                  onPress={() => onPress(item)}>
                  <View style={styles().row}>
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        paddingVertical: 8,
                        marginRight: 10,
                      }}>
                      <Image
                        source={  item?.companyDetail?.companyLogo? {uri:item?.companyDetail?.companyLogo} :icons.emptyImg }
                        style={{
                          height: '100%',
                          width: '100%',
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text>{item?.companyDetail?.companyNameTh}</Text>
                  </View>
                </TouchableOpacity>

              </View>
            );
          })}
        </>
      )
    }

  })
}

             

{/* 
              {icpiCustomers.map((item, idx) => {
                return (
                  <View key={idx} style={[styles().item, styles().itemShadow]}>

                    <TouchableOpacity
                      style={styles().item}
                      onPress={() => onPress(item)}>
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
              {icpfCustomers.map((item, idx) => {
                return (
                  <View key={idx} style={[styles().item, styles().itemShadow]}>

                    <TouchableOpacity
                      style={styles().item}
                      onPress={() => onPress(item)}>
                      <View style={styles().row}>
                        <View
                          style={{
                            height: 80,
                            width: responsiveWidth(80),
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
              })} */}
            </View>
            <View
              style={{
                padding: 10,

                justifyContent: 'center',
                alignItems: 'center',

                marginTop: 5
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
        </ScrollView>





        <Modal isVisible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
        >
          <View style={{
            backgroundColor: 'white',
            borderRadius: 15, padding: 24,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text
                semiBold
                fontFamily='NotoSans'
                fontSize={18}
              >เลือกกลุ่มสินค้า</Text>

            </View>

            {icplCustomers.length > 1 ?
              <>
                {icplCustomers.map((item:CustomerCompay, idx:number) => {
                  return (
                    <View key={idx} style={[styles().item,]}>

                      <TouchableOpacity
                        style={styles().item}
                        onPress={() => {
                          onPress(item)
                          setIsVisible(false)
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
                              source={item.productBrand[0].product_brand_logo?{ uri:item.productBrand[0].product_brand_logo }:icons.emptyImg}
                              style={{
                                height: '100%',
                                width: '100%',
                              }}
                              resizeMode="contain"
                            />
                          </View>
                          <Text> {item.productBrand[0].product_brand_name}</Text>
                        </View>
                      </TouchableOpacity>

                    </View>
                  )
                })}
              </>
              : <></>}

          </View>


        </Modal>

      </Content>
    </Container>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      marginTop: '5%',
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
