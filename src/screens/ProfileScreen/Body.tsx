import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import Text from '../../components/Text/Text';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../assets/icons';
import { numberWithCommas } from '../../utils/function';
import { colors } from '../../assets/colors/colors';
import { useMappingCompany } from '../../hook';
const mappingObjStatus = {
  SD: 'Sub Dealer',
  DL: 'Dealer',
};
interface Props {
  navigation?: any;
}
export default function Body({ navigation }: Props) {
  const {
    state: { user },
  } = useAuth();
  const { mappingLogo, mappingName } = useMappingCompany();
  const [currentCompany, setCurrentCompany] = React.useState<string>('');
  useEffect(() => {
    const getCurrentCompany = async () => {
      const company = await AsyncStorage.getItem('company');
      setCurrentCompany(company || '');
    };
    getCurrentCompany();
  }, []);

  const customer = user?.customerToUserShops[0].customer.customerCompany.find(
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
        <Text color="text2">เบอร์โทรศัพท์ : {user?.telephone}</Text>
        <Text color="text2">
          ID : {user?.customerToUserShops[0].customerId}
        </Text>
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
                  marginRight: 8,
                  left: '20%',
                  top: 4,

                  position: 'absolute',
                }}
              />
              <Text
                color="current"
                semiBold
                style={{
                  marginTop: 8,
                }}>{`฿${numberWithCommas(0)}`}</Text>
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
                  marginTop: 8,
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
                source={mappingLogo(currentCompany)}
                style={{
                  width: 32,
                  height: 32,

                  position: 'absolute',
                  left: '20%',
                  top: 4,
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
                  marginTop: 8,
                }}>
                {mappingName(currentCompany)}
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
            <Text
              color="text3"
              fontSize={14}
              style={{
                marginRight: 8,
              }}>
              เปิด
            </Text>
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
