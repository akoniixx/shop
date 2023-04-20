import { StyleSheet, View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';
import { numberWithCommas } from '../../utils/function';
interface Props {
  orderDetail: any;
}
export default function SummaryTotal({ orderDetail }: Props) {
  return (
    <View style={styles.summary}>
      <Text color="text2" semiBold fontFamily="NotoSans">
        จำนวนรวม
      </Text>
      <Text
        fontFamily="NotoSans"
        color="primary"
        bold
        fontSize={20}>{`฿${numberWithCommas(
        orderDetail?.totalPrice ? +orderDetail?.totalPrice : 0,
        true,
      )}`}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopColor: colors.border1,
    borderTopWidth: 1,

    marginHorizontal: 16,
  },
});
