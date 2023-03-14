import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Button from '../../components/Button/Button';
import { HistoryDataType } from '../../entities/historyTypes';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ModalWarning from '../../components/Modal/ModalWarning';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  orderDetail: HistoryDataType | null;
  navigation: StackNavigationProp<
    MainStackParamList,
    'HistoryDetailScreen',
    undefined
  >;
}
export default function FooterButton({ orderDetail, navigation }: Props) {
  const [modalConfirm, setModalConfirm] = React.useState<boolean>(false);
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
    navigation.navigate('CancelOrderScreen', {
      orderId: orderDetail?.orderId,
      soNo: orderDetail?.soNo || null,
      navNo: orderDetail?.navNo || null,
      paidStatus: orderDetail?.paidStatus,
      orderNo: orderDetail?.orderNo,
      orderProducts: orderDetail?.orderProducts,
    });
  };
  return (
    <View style={styles.container}>
      <Button
        background3
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
        onConfirm={() => {
          onPressConfirmOrder();
        }}
        onRequestClose={() => {
          setModalConfirm(false);
        }}
      />
    </View>
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
