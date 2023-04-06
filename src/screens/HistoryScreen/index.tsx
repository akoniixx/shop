import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import SearchInput from '../../components/SearchInput/SearchInput';
import ContentBody from './ContentBody';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import TabSelector from '../../components/TabSelector/TabSelector';
import { SheetManager } from 'react-native-actions-sheet';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { HistoryDataType } from '../../entities/historyTypes';
import { useDebounce } from '../../hook';
import dayjs from 'dayjs';
import { historyServices } from '../../services/HistoryServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface TypeHistory {
  data: HistoryDataType[];
  count: number;
  dashboard: {
    waitConfirmStatusCount: 0;
    confirmStatusCount: 0;
    inDeliveryCount: 0;
    deliverySuccessCount: 0;
  };
}
export interface HistoryTypeStore {
  customerCompanyId: number;
  customerName: string;
  customerNo: string;
  customerType: string;
  customerImage: string | null;
  zone: string;
  orderCount: number;
}
export default function HistoryScreen({ navigation }: any): JSX.Element {
  const [searchValue, setSearchValue] = React.useState<string | undefined>();
  const [currentStatus, setCurrentStatus] = React.useState<{
    label: string;
    value: string;
  }>({
    label: 'ทั้งหมด',
    value: 'ALL',
  });
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({ startDate: undefined, endDate: undefined });

  const [tabValue, setTabValue] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const limit = 10;

  const { tabData } = useMemo(() => {
    const tabData = [
      {
        label: 'ที่ต้องยืนยัน',
        value: 'WAIT_CONFIRM_ORDER',
      },
      {
        label: 'ยืนยันแล้ว',
        value: 'CONFIRM_ORDER',
      },
      {
        label: 'กำลังดำเนินการ',
        value: 'OPEN_ORDER',
      },
      {
        label: 'กำลังจัดส่ง',
        value: 'IN_DELIVERY',
      },
      {
        label: 'จัดส่งสำเร็จ',
        value: 'DELIVERY_SUCCESS',
      },
      {
        label: 'ยกเลิกคำสั่งซื้อ',
        value: 'COMPANY_CANCEL_ORDER',
      },
    ];
    return { tabData };
  }, []);
  const [historyData, setHistoryData] = React.useState<TypeHistory>({
    data: [],
    count: 0,
    dashboard: {
      waitConfirmStatusCount: 0,
      confirmStatusCount: 0,
      inDeliveryCount: 0,
      deliverySuccessCount: 0,
    },
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const debounceSearchValue = useDebounce(searchValue, 1000);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
    const company = await AsyncStorage.getItem('company');
    const payload: any = {
      status: tabValue.length > 0 ? tabValue : tabData.map(item => item.value),
      search: debounceSearchValue,
      take: limit,
      company: company,
      page: 1,
      endDate: dateRange.endDate
        ? dayjs(dateRange.endDate).format('YYYY-MM-DD')
        : undefined,
      startDate: dateRange.startDate
        ? dayjs(dateRange.startDate).format('YYYY-MM-DD')
        : undefined,
      customerCompanyId,
    };
    if (currentStatus.value !== 'ALL') {
      payload.paidStatus = currentStatus.value;
    }

    try {
      const data = await historyServices.getHistory(payload);

      setHistoryData(data);
      setLoading(false);
    } catch (e: any) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  }, [
    debounceSearchValue,
    dateRange.startDate,
    dateRange.endDate,
    tabValue,
    currentStatus.value,
    tabData,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData]),
  );
  useEffect(() => {
    fetchData();
  }, [
    tabValue,
    debounceSearchValue,
    dateRange.startDate,
    dateRange.endDate,
    fetchData,
  ]);
  const fetchDataMore = async () => {
    if (historyData.data.length < historyData.count) {
      setLoading(true);
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const company = await AsyncStorage.getItem('company');
      const payload: any = {
        status:
          tabValue.length > 0 ? tabValue : tabData.map(item => item.value),
        search: debounceSearchValue,
        take: limit,
        company: company,
        page: page + 1,
        endDate: dateRange.endDate
          ? dayjs(dateRange.endDate).format('YYYY-MM-DD')
          : undefined,
        startDate: dateRange.startDate
          ? dayjs(dateRange.startDate).format('YYYY-MM-DD')
          : undefined,
        customerCompanyId,
      };
      if (currentStatus.value !== 'ALL') {
        payload.paidStatus = currentStatus.value;
      }
      try {
        const data = await historyServices.getHistory(payload);

        setHistoryData(prev => {
          return {
            ...prev,
            data: [...prev.data, ...data.data],
            count: data.count,
          };
        });
        setPage(prev => prev + 1);
        setLoading(false);
      } catch (e) {
        console.log('error', e);
      }
    } else {
      console.log('no more data');
      return;
    }
  };

  const convertDateText = (
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) => {
    let text = '';
    if (!startDate && endDate) {
      text = dayjs(endDate).format('DD/MM/BB');
    }
    if (startDate) {
      text = dayjs(startDate).format('DD/MM/BB');
    }
    if (endDate && startDate) {
      text += ` - ${dayjs(endDate).format('DD/MM/BB')}`;
    }
    return text;
  };
  return (
    <Container edges={['left', 'right', 'top']}>
      <Header
        componentLeft={<View style={{ width: 24 }} />}
        title="ประวัติการสั่งซื้อ"
      />
      <View
        style={{
          paddingHorizontal: 16,
          width: '100%',
        }}>
        <SearchInput
          value={searchValue}
          style={{
            width: '100%',
          }}
          placeholder={'ค้นหาเลขใบสั่งซื้อ, ร้านค้า...'}
          onChange={v => {
            setSearchValue(v);
            setPage(1);
          }}
        />
      </View>

      <View style={styles().containerFilter}>
        <View>
          {dateRange.startDate || dateRange.endDate ? (
            <TouchableOpacity
              onPress={async () => {
                const currentDate: {
                  startDate: Date | undefined;
                  endDate: Date | undefined;
                } = await SheetManager.show('select-date-range', {
                  payload: {
                    dateRange,
                  },
                });
                if (!currentDate) {
                  return;
                }
                setDateRange(currentDate);
                setPage(1);
              }}
              style={[
                styles().flexRow,
                {
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                },
              ]}>
              <Text
                style={{
                  marginRight: 4,
                }}
                lineHeight={28}
                color={'white'}
                fontSize={14}>
                {convertDateText(dateRange.startDate, dateRange.endDate)}{' '}
                {'   '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDateRange({ startDate: undefined, endDate: undefined });
                  setPage(1);
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  right: 8,
                }}>
                <Image
                  source={icons.iconClosePrimary}
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                const currentDate: {
                  startDate: Date | undefined;
                  endDate: Date | undefined;
                } = await SheetManager.show('select-date-range', {
                  payload: {
                    dateRange,
                  },
                });
                if (!currentDate) {
                  return;
                }
                setDateRange(currentDate);
                setPage(1);
              }}
              style={[
                styles().flexRow,
                {
                  borderWidth: 1,
                  borderColor: colors.border1,
                  borderRadius: 20,
                  paddingHorizontal: 8,
                },
              ]}>
              <Text
                style={{
                  marginRight: 4,
                }}
                lineHeight={28}
                color={'text3'}
                fontSize={14}>{`วันที่ทั้งหมด`}</Text>
              <Image
                source={icons.iconCalendar}
                style={styles().icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        <View>
          {currentStatus.value !== 'ALL' ? (
            <TouchableOpacity
              onPress={async () => {
                const newStatus: {
                  label: string;
                  value: string;
                } = await SheetManager.show('select-status-payment', {
                  payload: {
                    currentStatus,
                  },
                });
                if (newStatus) {
                  setPage(1);
                  setCurrentStatus(newStatus);
                }
              }}
              style={[
                styles().flexRow,
                {
                  marginRight: 0,
                  borderWidth: 1,
                  borderColor: colors.border1,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 8,
                },
              ]}>
              <Text
                style={{
                  marginRight: 4,
                  paddingRight: 24,
                }}
                lineHeight={28}
                color={'white'}
                fontSize={14}>
                {currentStatus.label}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentStatus({ label: 'ทั้งหมด', value: 'ALL' });
                  setPage(1);
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  right: 8,
                }}>
                <Image
                  source={icons.iconClosePrimary}
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                const newStatus: {
                  label: string;
                  value: string;
                } = await SheetManager.show('select-status-payment', {
                  payload: {
                    currentStatus,
                  },
                });
                if (newStatus) {
                  setPage(1);
                  setCurrentStatus(newStatus);
                }
              }}
              style={[
                styles().flexRow,
                {
                  marginRight: 0,
                  borderWidth: 1,
                  borderColor: colors.border1,
                  borderRadius: 20,
                  paddingHorizontal: 8,
                },
              ]}>
              <Text
                style={{
                  marginRight: 4,
                }}
                lineHeight={28}
                color={'text3'}
                fontSize={14}>{`สถานะการชำระเงิน`}</Text>
              <Image
                source={icons.iconDropdown}
                style={styles().icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={{
          height: 58,
          borderTopWidth: 1,
          borderTopColor: colors.border1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TabSelector
          tabs={tabData}
          active={tabData.findIndex(tab => tabValue.includes(tab.value))}
          onChangeTab={tab => {
            if (tabValue.includes(tab)) {
              setTabValue([]);
            } else {
              if (tab === 'COMPANY_CANCEL_ORDER') {
                setTabValue(['COMPANY_CANCEL_ORDER', 'SHOPAPP_CANCEL_ORDER']);
              } else {
                setTabValue([tab]);
              }
            }
            setPage(1);
          }}
        />
      </View>

      <Content
        noPadding
        style={{
          backgroundColor: colors.background1,
        }}>
        <ContentBody
          data={historyData.data}
          navigation={navigation}
          fetchDataMore={fetchDataMore}
        />
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}

const styles = () => {
  return StyleSheet.create({
    containerFilter: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 4,
    },
  });
};
