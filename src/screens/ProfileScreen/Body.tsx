import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../assets/icons';
import { numberWithCommas } from '../../utils/function';
import { colors } from '../../assets/colors/colors';
import { useMappingCompany } from '../../hook';
import { userServices } from '../../services/UserServices';
import { CustomerCompay } from '../../entities/productEntities';

const mappingObjStatus = {
  SD: 'Sub Dealer',
  DL: 'Dealer',
};
interface Props {
  navigation?: any;
}
interface CustomerData {
  balance: string;
  credit_memo_shop_id?: string;
  customer_name?: string;
  zone?: string;
  province?: string;
  firstname?: string;
  lastname?: string;
}

export default function Body({ navigation }: Props) {
  const {
    state: { user },
  } = useAuth();
  const [customerData, setCustomerData] = React.useState<CustomerData>({
    balance: '0',
  });

  const { mappingLogo, mappingName } = useMappingCompany();
  const [currentCompany, setCurrentCompany] = React.useState<string>('');
  const [companyAuth, setCompanyAuth] = useState<CustomerCompay[]>([])

  useEffect(() => {
    const getCurrentCompany = async () => {
      const company = await AsyncStorage.getItem('company');
      const companyStore = await AsyncStorage.getItem('companyAuth');
      if (companyStore != null) {
      
        setCompanyAuth(JSON.parse(companyStore))
       
      }
      setCurrentCompany(company || '');
    };
    const getCoDiscount = async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const result = await userServices.getCoDiscount(customerCompanyId || '');
      if (result) {
        setCustomerData(result);
      }
    };
    getCoDiscount();
    getCurrentCompany();
  }, []);

  function getProductBrandLogoByCompany(companyName:string, customerCompanies:CustomerCompay[]) {
    if(companyName==="ICPL"||companyName==="ICPI"||companyName==="ICPF"){
      return mappingLogo(companyName)
    }else{
      for (const customerCompany of customerCompanies) {
        if (customerCompany.company === companyName) {
          if (customerCompany.productBrand.length > 0 && customerCompany.productBrand[0].product_brand_logo) {
            return {uri:customerCompany.productBrand[0].product_brand_logo}
          }
          return icons.emptyImg
        }
      }
      return null;
    }
    
  }

  const customer = user?.customerToUserShops[0]?.customer.customerCompany.find(
    el => el.company === currentCompany,
  );
  const onClickTC = () => {
    navigation.navigate('TCReadOnlyScreen');
  };
  const onClickSettingNotification = () => {
    navigation.navigate('SettingNotificationScreen');
  };

  return (
    <View>
      <View style={styles.container}>
        <Text bold fontFamily="NotoSans" fontSize={20} lineHeight={32}>
          {customer?.customerName}
        </Text>
        <Text color="text2">เบอร์โทรศัพท์ (หลัก) : {user?.telephone}</Text>
        <Text color="text2">
          เบอร์โทรศัพท์ (รอง) :{' '}
          {user?.secondtelephone ? user.secondtelephone : '-'}
        </Text>
        {/* <Text color="text2">
          ID : {user?.customerToUserShops[0].customerId}
        </Text> */}
        <View style={styles.content}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width / 2 - 16,
              }}>
              <Image
                source={icons.discount}
                style={{
                  width: 28,
                  height: 28,
                  marginRight: 4,
                }}
              />
              <Text
                color="current"
                semiBold
                style={{
                  marginTop: 8,
                }}>{`฿${numberWithCommas(
                customerData?.balance ? customerData.balance : 0,
              )}`}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',

                width: Dimensions.get('window').width / 2 - 16,
              }}>
              <Text
                color="text3"
                style={{
                  marginTop: 16,
                }}>
                ส่วนลดดูแลราคาคงเหลือ
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 40,
              borderLeftWidth: 1,
              borderLeftColor: colors.border1,
              width: 1,
            }}
          />
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: Dimensions.get('window').width / 2 - 16,
              }}>
              <Image
                resizeMode="contain"
                source={getProductBrandLogoByCompany(currentCompany,companyAuth)}
                style={{
                  width: currentCompany === 'ICPL' ? 48 : 40,
                  height: currentCompany === 'ICPL' ? 48 : 40,

                  position: 'absolute',
                  left: currentCompany === 'ICPL' ? '16%' : '20%',
                  top:
                    currentCompany === 'ICPI' || currentCompany === 'ICPF'
                      ? -4
                      : -6,
                }}
              />
              <Text
                bold
                style={{
                  marginLeft: 32,
                  marginTop: 8,
                }}>
                {
                  mappingObjStatus[
                    customer?.customerType as keyof typeof mappingObjStatus
                  ]
                }
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width / 2 - 16,
              }}>
              <Text
                color="text3"
                style={{
                  marginTop: 16,
                }}>
                {mappingName(currentCompany)?mappingName(currentCompany):currentCompany}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.card}
          onPress={onClickSettingNotification}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.iconNotification}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Text
              fontFamily="NotoSans"
              style={{
                marginLeft: 8,
              }}>
              การแจ้งเตือน
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {user?.notiStatus ? (
              <Text
                color="current"
                fontSize={14}
                style={{
                  marginRight: 8,
                }}>
                เปิด
              </Text>
            ) : (
              <Text
                color="text3"
                fontSize={14}
                style={{
                  marginRight: 8,
                }}>
                ปิด
              </Text>
            )}
            <Image
              source={icons.iconNext}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={onClickTC}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.iconTC}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Text
              fontFamily="NotoSans"
              style={{
                marginLeft: 8,
              }}>
              เงื่อนไข และข้อตกลงการใช้บริการ
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.iconNext}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: 40,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border1,
  },
});
