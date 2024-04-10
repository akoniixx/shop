import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Button from '../../components/Button/Button';
import { HistoryDataType } from '../../entities/historyTypes';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ModalWarning from '../../components/Modal/ModalWarning';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';
import ModalOnlyConfirm from '../../components/Modal/ModalOnlyConfirm';

interface Props {
  orderDetail: HistoryDataType | null;
  navigation: StackNavigationProp<
    MainStackParamList,
    'HistoryDetailScreen',
    undefined
  >;
  refetch?: () => void;
  scrollToTop: () => void;
}
const SHOULD_UPDATE_STATUS = [
  'REJECT_ORDER',
  'SHOPAPP_CANCEL_ORDER',
  'OPEN_ORDER',
  'IN_DELIVERY',
  'DELIVERY_SUCCESS',
  'COMPANY_CANCEL_ORDER',
];
export default function FooterButton({
  orderDetail,
  navigation,
  refetch,
  scrollToTop,
}: Props) {
  const [modalConfirm, setModalConfirm] = React.useState<boolean>(false);
  const [showIsUpdate, setShowIsUpdate] = React.useState<boolean>(false);
  const {
    state: { user },
  } = useAuth();

  const onPressConfirmOrder = async () => {
    if (!orderDetail) {
      return;
    }
    const payload: {
      orderId: string;
      status: string;
      paidStatus: string;
      cancelRemark: string;
      soNo: string | null;
      navNo: string | null;
      updateBy: string;
    } = {
      orderId: orderDetail?.orderId,
      status: 'CONFIRM_ORDER',
      paidStatus: orderDetail?.paidStatus,
      cancelRemark: orderDetail.cancelRemark,
      soNo: orderDetail?.soNo || null,
      navNo: orderDetail?.navNo || null,
      updateBy: `${user?.firstname} ${user?.lastname}`,
    };

    const res = await orderServices.postStatusOrder(payload);
    if (res) {
      setModalConfirm(false);
      navigation.navigate('ConfirmOrderSuccessScreen', {
        ...res,
      });
    }
  };
  const onPressCancelOrder = async () => {
    if (!orderDetail) {
      return;
    }
    const result = await orderServices.getOrderById(orderDetail?.orderId);

    if (result) {
      const currentStatus = result.status;
      if (SHOULD_UPDATE_STATUS.includes(currentStatus)) {
        setShowIsUpdate(true);
        return;
      }
      navigation.navigate('CancelOrderScreen', {
        orderId: orderDetail?.orderId,
        soNo: orderDetail?.soNo || null,
        navNo: orderDetail?.navNo || null,
        paidStatus: orderDetail?.paidStatus,
        orderNo: orderDetail?.orderNo,
        orderProducts: orderDetail?.orderProducts,
      });
    }
  };
  return (
    <>
      {orderDetail?.status === 'CONFIRM_ORDER' ? (
        <View style={styles.container}>
          <Button
            danger
            title="ยกเลิกคำสั่งซื้อ"
            onPress={() => {
              onPressCancelOrder();
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Button
            danger
            onPress={() => {
              onPressCancelOrder();
            }}
            title="ยกเลิกคำสั่งซื้อ"
            style={{
              flex: 0.48,
            }}
          />
          <Button
            title="ยืนยันคำสั่งซื้อ"
            onPress={() => {
              setModalConfirm(true);
            }}
            style={{
              flex: 0.48,
            }}
          />
          <ModalWarning
            title="ยืนยันคำสั่งซื้อใช่หรือไม่"
            visible={modalConfirm}
            width={'70%'}
            minHeight={50}
            onConfirm={async () => {
              await onPressConfirmOrder();
            }}
            onRequestClose={() => {
              setModalConfirm(false);
            }}
          />
        </View>
      )}
      <ModalOnlyConfirm
        visible={showIsUpdate}
        width={Dimensions.get('window').width - 124}
        textConfirm="ดูรายละเอียด"
        title={`คำสั่งซื้อ ${orderDetail?.orderNo} \n คำสั่งซื้อนี้ ได้มีการเปลี่ยนแปลงข้อมูล กรุณาตรวจสอบอีกครั้ง`}
        onConfirm={async () => {
          setShowIsUpdate(false);
          await setTimeout(() => {
            refetch && refetch();
          }, 800);
          scrollToTop();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
