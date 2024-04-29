import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';

import Step from '../../components/Step/Step';
import Button from '../../components/Button/Button';
import StepOne from './StepOne';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import ModalWarning from '../../components/Modal/ModalWarning';
import { useCart } from '../../contexts/CartContext';
import StepTwo from './StepTwo';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { useFocusEffect } from '@react-navigation/native';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userServices } from '../../services/UserServices';
import { useOrderLoads } from '../../contexts/OrdersLoadContext';

export interface TypeDataStepTwo {
  paymentMethod: string;
  specialRequestRemark?: string | null;
  saleCoRemark?: string | null;
  deliveryAddress?: string;
  deliveryDest?: string;
  numberPlate?: string;
}
export interface FactoryType {
  factoryId: string;
  factoryName: string;
  company: string;
  locationCode: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postcode: string;
  telephone: string | null;
}
export default function CartScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'CartScreen'>): JSX.Element {
  const { t } = useLocalization();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState('');
  const [visibleConfirm, setVisibleConfirm] = React.useState(false);
  const {
    cartList,
    setCartList,
    setFreebieListItem,
    cartApi: { getCartList, postCartItem },
  } = useCart();

  const { currentList } = useOrderLoads();
  const {
    dataReadyLoad,
    setDataReadyLoad,
    setHeadData,
    setCurrentList,
    setDollyData,
    setDataForLoad,
    dataForLoad,
  } = useOrderLoads();
  const {
    state: { user },
  } = useAuth();
  const [currentLocation, setCurrentLocation] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [modalReset, setModalReset] = useState<boolean>(false);
  const [dataStepTwo, setDataStepTwo] = React.useState<TypeDataStepTwo>({
    paymentMethod: '',
    specialRequestRemark: null,
    saleCoRemark: null,
    deliveryAddress: '',
    numberPlate: '',
  });

  const refInput = React.useRef<any>(null);

  const reset = async () => {
    try {
      setLoading(true);
      setCartList([]);
      setModalReset(false);
      setCurrentStep(0);
      setDataReadyLoad([]);
      setHeadData([]);
      setDollyData([]);
      setDataForLoad([]);
      await postCartItem([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateOrder = async () => {
    try {
      setLoading(true);
      const data = await getCartList();
      const ICPI = user?.customerToUserShops[0].customer.customerCompany.find(
        el => el.company === 'ICPI',
      );

      const company = await AsyncStorage.getItem('company');
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const zone: any = await AsyncStorage.getItem('zone');

      const orderProducts = (data?.orderProducts || []).map(item => {
        return {
          ...item,
          promotion: [],
          orderProductPromotions: [],
        };
      });
      const payload: any = {
        customerZone: zone || '',
        company: company || '',
        customerCompanyId: customerCompanyId || '',
        userShopId: user?.userShopId || '',
        orderProducts: orderProducts,
        paymentMethod: dataStepTwo.paymentMethod,
        customerNo: ICPI?.customerNo || '',
        customerName: ICPI?.customerName || '',
        updateBy: `${user?.firstname} ${user?.lastname}`,
        status: 'CONFIRM_ORDER',
        deliveryDest: 'FACTORY',
        deliveryAddress: dataStepTwo.deliveryAddress,
        orderLoads: dataReadyLoad,
      };

      if (dataStepTwo.specialRequestRemark) {
        payload.specialRequestRemark = dataStepTwo.specialRequestRemark;
      }
      if (dataStepTwo.saleCoRemark) {
        payload.deliveryRemark = dataStepTwo.saleCoRemark;
      }
      if (dataStepTwo.numberPlate) {
        payload.numberPlate = dataStepTwo.numberPlate;
      }
      setVisibleConfirm(false);
      /* console.log(JSON.stringify(payload)) */
      const result = await orderServices.createOrder(payload);
      setLoading(false);

      if (result) {
        setFreebieListItem([]);
        setCartList([]);
        setDataReadyLoad([]);
        setHeadData([]);
        setCurrentList([]);
        setDollyData([]);
        setDataForLoad([]);

        navigation.navigate('OrderSuccessScreen', {
          orderId: result.orderId,
        });
      }
    } catch (e: any) {
      setError(true);
      setErrorCode(e.response?.data?.statusCode);
      console.log(JSON.stringify(e.response.data, null, 2));
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };
  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 1: {
        return (
          <StepTwo
            refInput={refInput}
            setDataStepTwo={setDataStepTwo}
            dataStepTwo={dataStepTwo}
            currentLocation={currentLocation}
            setIsShowError={setShowError}
            isShowError={showError}
          />
        );
      }
      default: {
        return <StepOne />;
      }
    }
  }, [currentStep, dataStepTwo, currentLocation, showError, setShowError]);
  useFocusEffect(
    React.useCallback(() => {
      const getAddress = async () => {
        const location = await AsyncStorage.getItem('pickupLocation');

        const result = await userServices.getFactory({
          company: 'ICPI',
          factoryCode: location || '',
        });

        if (result && result.length > 0) {
          setCurrentLocation(result[0]);
          setDataStepTwo(prev => {
            return {
              ...prev,
              deliveryAddress: `${result[0].factoryName} ${result[0].address} ${result[0].subDistrict} ${result[0].district} ${result[0].province} ${result[0].postcode}`,
            };
          });
        }
      };

      getCartList();
      getAddress();

      setDataStepTwo(prev => ({ ...prev, paymentMethod: 'CREDIT' }));
    }, [getCartList]),
  );

  return (
    <Container>
      <Header
        title={t('screens.CartScreen.title')}
        componentRight={
          <TouchableOpacity
            disabled={cartList.length <= 0}
            onPress={() => setModalReset(true)}>
            <Text
              fontSize={16}
              fontFamily="NotoSans"
              color={cartList.length <= 0 ? 'text3' : 'primary'}>
              ล้าง
            </Text>
          </TouchableOpacity>
        }
      />
      <Content
        style={{
          backgroundColor: colors.background1,
          padding: 0,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: 12,
            justifyContent: 'center',
            marginVertical: 8,
          }}>
          <Step
            onPress={step => {
              setCurrentStep(step === 2 ? currentStep : step);
            }}
            currentStep={currentStep}
            labelList={['รายการคำสั่งซื้อ', 'สรุปคำสั่งซื้อ', 'สั่งซื้อสำเร็จ']}
          />
        </View>
        <ScrollView>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: Dimensions.get('window').height / 2,
              }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            renderStep
          )}
        </ScrollView>
      </Content>
      <FooterShadow>
        {currentStep === 0 && (
          <Button
            disabled={
              !currentList.every(Item => Item.quantity === 0) &&
              dataForLoad.length !== 0
            }
            onPress={() => {
              if (cartList.length < 1) {
                return setVisible(true);
              }
              setCurrentStep(prev => prev + 1);
            }}
            title={t('screens.CartScreen.stepOneButton')}
          />
        )}
        {currentStep === 1 && (
          <TouchableOpacity
          disabled={loading}
            onPress={() => {
              if (dataStepTwo.numberPlate?.trim().length == 0) {
                setShowError(true);
              } else {
                setVisibleConfirm(true);
              }
            }}
            style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}>
            <View
              style={{
                position: 'absolute',
                left: 16,
              }}>
              <Image
                source={icons.cartFill}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <View
                style={{
                  width: 16,
                  height: 16,
                  position: 'absolute',
                  right: -6,
                  borderColor: colors.primary,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  zIndex: 1,
                  padding: 2,
                  backgroundColor: colors.white,
                }}>
                <Text color={'primary'} fontSize={12} lineHeight={12}>
                  {cartList.length}
                </Text>
              </View>
            </View>
            <Text color="white" bold fontSize={18} fontFamily="NotoSans">
              {t('screens.CartScreen.stepTwoButton')}
            </Text>
          </TouchableOpacity>
        )}
      </FooterShadow>
      <ModalWarning
        visible={visible}
        width={'80%'}
        minHeight={80}
        onlyCancel
        onRequestClose={() => setVisible(false)}
        textCancel={'ตกลง'}
        title="ไม่สามารถสั่งสินค้าได้"
        desc="คุณต้องเพิ่มสินค้าที่ต้องการสั่งซื้อในตระกร้านี้"
      />
      <ModalWarning
        visible={error}
        width={'80%'}
        minHeight={80}
        onlyCancel
        onRequestClose={() => setError(false)}
        textCancel={'ตกลง'}
        title="เกิดข้อผิดพลาด"
        desc={'statusCode: ' + errorCode}
      />
      <ModalWarning
        visible={modalReset}
        width={'70%'}
        title="ยืนยันล้างตะกร้าสินค้า"
        desc={`ต้องการล้างรายการสินค้าในตะกร้าทั้งหมด\nใช่หรือไม่?`}
        onConfirm={() => reset()}
        minHeight={60}
        onRequestClose={() => setModalReset(false)}
        titleCenter
      />
      <ModalWarning
        visible={visibleConfirm}
        width={'60%'}
        title="ยืนยันคำสั่งซื้อ"
        minHeight={80}
        desc="ต้องการยืนยันคำสั่งซื้อใช่หรือไม่?"
        onConfirm={async () => {
          await onCreateOrder();
          setVisibleConfirm(false);
        }}
        onRequestClose={() => setVisibleConfirm(false)}
      />
    </Container>
  );
}
