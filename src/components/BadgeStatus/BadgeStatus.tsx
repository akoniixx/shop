import { View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import {
  statusHistory,
  statusHistoryBGColor,
  statusHistoryBGColorPaid,
  statusHistoryColor,
  statusHistoryColorPaid,
  statusHistoryPaid,
} from '../../utils/mappingObj';
interface Props {
  status: string;
  isCancelOrder?: boolean;
  paidStatus?: string;
}

export default function BadgeStatus({
  status,
  paidStatus = 'WAITING_PAID',
  isCancelOrder = false,
}: Props) {
  const color: any =
    paidStatus === 'WAITING_PAID'
      ? statusHistoryColor[status as keyof typeof statusHistoryColor]
      : statusHistoryColorPaid[status as keyof typeof statusHistoryColor];
  const title =
    paidStatus === 'WAITING_PAID'
      ? statusHistory[status as keyof typeof statusHistory]
      : statusHistoryPaid[paidStatus as keyof typeof statusHistory];

  return (
    <View
      style={{
        backgroundColor:
          paidStatus === 'WAITING_PAID'
            ? statusHistoryBGColor[status as keyof typeof statusHistoryBGColor]
            : statusHistoryBGColorPaid[
                status as keyof typeof statusHistoryBGColorPaid
              ],
        borderRadius: 12,
        height: 30,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}>
      <Text color={color} fontSize={14} semiBold fontFamily="NotoSans">
        {isCancelOrder ? 'คำสั่งซื้อถูกยกเลิก' : title}
      </Text>
    </View>
  );
}
