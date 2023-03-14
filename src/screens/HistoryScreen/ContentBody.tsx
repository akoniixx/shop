import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { HistoryDataType } from '../../entities/historyTypes';
import HistoryItemArea from './HistoryItemArea';
import { HistoryTypeStore } from '.';

interface Props {
  data: HistoryDataType[];
  navigation?: any;
  fetchDataMore: () => Promise<void>;
  dataCustomer?: HistoryTypeStore[];
}
export default function ContentBody({
  data = [],
  navigation,
  fetchDataMore,
}: Props) {
  const EmptyItem = () => {
    return (
      <View
        style={{
          minHeight: Dimensions.get('window').height / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={images.emptyGift}
          style={{
            width: 140,
            height: 140,
          }}
        />
        <Text fontFamily="NotoSans" color="text3">
          ไม่พบรายการสินค้า
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      contentContainerStyle={{
        padding: 16,
      }}
      onEndReached={fetchDataMore}
      onEndReachedThreshold={0.2}
      keyExtractor={(item, index) =>
        `${item.orderId.toString() + item.orderNo + index}`
      }
      ListEmptyComponent={EmptyItem}
      renderItem={({ item }) => {
        return <HistoryItemArea {...item} navigation={navigation} />;
      }}
    />
  );
}
