import { Image, ScrollView, View } from 'react-native';
import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';
import { HistoryDataType } from '../../entities/historyTypes';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

import { orderServices } from '../../services/OrderServices';
import BodyDetail from './BodyDetail';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryDetailScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'HistoryDetailScreen'>) {
  const params = route.params;
  const [orderDetail, setOrderDetail] = React.useState<HistoryDataType | null>(
    null,
  );

  const textHeader = useMemo(() => {
    if (orderDetail) {
      return orderDetail?.status === 'SHOPAPP_CANCEL_ORDER' ||
        orderDetail?.status === 'COMPANY_CANCEL_ORDER'
        ? 'รายละเอียดยกเลิกคำสั่งซื้อ'
        : 'รายละเอียดคำสั่งซื้อ';
    }
    return 'รายละเอียดคำสั่งซื้อ';
  }, [orderDetail]);
  const [loading, setLoading] = React.useState<boolean>(false);
  useFocusEffect(
    React.useCallback(() => {
      const getOrderDetailById = async () => {
        try {
          setLoading(true);
          const res = await orderServices.getOrderById(params.orderId);
          setOrderDetail(res);
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      };
      getOrderDetailById();
    }, [params.orderId]),
  );

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title={textHeader} />
      <Content
        noPadding
        style={{
          backgroundColor: colors.background1,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            padding: 16,
          }}>
          {(orderDetail?.status === 'SHOPAPP_CANCEL_ORDER' ||
            orderDetail?.status === 'COMPANY_CANCEL_ORDER') && (
            <>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  paddingBottom: 16,
                }}>
                <Image
                  source={images.CancelImage}
                  style={{
                    width: 120,
                    height: 120,
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 2.84,
                  elevation: 5,
                  marginBottom: 18,
                  zIndex: 0,
                  paddingVertical: 16,
                }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    borderBottomColor: colors.border1,
                    borderBottomWidth: 1,
                    paddingBottom: 16,
                  }}>
                  <Text fontFamily="NotoSans" semiBold>
                    รายละเอียดการยกเลิก
                  </Text>
                  <Text color="text2" lineHeight={34}>
                    หมายเลขคำสั่งซื้อ : {orderDetail?.orderNo}
                  </Text>
                  <Text color="text2" lineHeight={34}>
                    วันที่ยกเลิก :{' '}
                    {dayjs(orderDetail?.updateAt)
                      .locale('th')
                      .format('DD MMM BBBB HH:mm น.')}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                  }}>
                  <Text fontFamily="NotoSans" semiBold>
                    เหตุผลที่ยกเลิก (ลูกค้า)
                  </Text>
                  <Text color="text2">{orderDetail?.cancelRemark}</Text>
                </View>
              </View>
            </>
          )}

          <BodyDetail orderDetail={orderDetail} navigation={navigation} />
          <View
            style={{
              height: 50,
            }}
          />
        </ScrollView>
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}
