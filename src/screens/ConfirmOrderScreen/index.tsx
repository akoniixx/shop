import { View } from 'react-native';
import React, { useEffect } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import { HistoryDataType } from '../../entities/historyTypes';
import { historyServices } from '../../services/HistoryServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ContentBody from './ContentBody';
import { useFocusEffect } from '@react-navigation/native';
interface ConfirmDataType {
  data: HistoryDataType[];
  count: number;
  dashboard: {
    waitConfirmStatusCount: 0;
    confirmStatusCount: 0;
    inDeliveryCount: 0;
    deliverySuccessCount: 0;
  };
}
interface Props {
  navigation?: any;
}
export default function ConfirmOrderScreen({ navigation }: Props) {
  const limit = 10;
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [confirmData, setConfirmData] = React.useState<ConfirmDataType>({
    data: [],
    count: 0,
    dashboard: {
      waitConfirmStatusCount: 0,
      confirmStatusCount: 0,
      inDeliveryCount: 0,
      deliverySuccessCount: 0,
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const getDataConfirm = async () => {
        try {
          setLoading(true);
          const company = await AsyncStorage.getItem('company');
          const customerCompanyId = await AsyncStorage.getItem(
            'customerCompanyId',
          );
          const payload: any = {
            status: ['WAIT_CONFIRM_ORDER'],
            take: limit,
            company: company,
            page: 1,
            customerCompanyId,
          };
          const res = await historyServices.getHistory(payload);
          setConfirmData(res);
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      };
      getDataConfirm();
    }, []),
  );

  const fetchMore = async () => {
    if (confirmData.count < confirmData.data.length) {
      try {
        setLoading(true);
        const company = await AsyncStorage.getItem('company');
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        const payload: any = {
          status: ['WAIT_CONFIRM_ORDER'],

          take: limit,
          company: company,
          page: page + 1,
          customerCompanyId,
        };
        const res = await historyServices.getHistory(payload);
        setConfirmData({
          ...confirmData,
          data: [...confirmData.data, ...res.data],
        });
        setPage(page + 1);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('no more data');
    }
  };
  return (
    <Container edges={['top', 'right', 'left']}>
      <Header title="ยืนยันคำสั่งซื้อ" componentLeft={<View />} />
      <Content
        style={{
          flex: 1,
          paddingBottom: 0,
          backgroundColor: colors.background1,
        }}>
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text color="text2" semiBold lineHeight={30} fontFamily="NotoSans">
            รายการที่ต้องยืนยัน
          </Text>
          <Text color="text2" lineHeight={30}>
            {`${confirmData.data.length}`} รายการ
          </Text>
        </View>
        <ContentBody
          data={confirmData.data}
          navigation={navigation}
          fetchDataMore={fetchMore}
        />
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}
