import { View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import {
  statusHistory,
  statusHistoryBGColor,
  statusHistoryBGColorCredit,
  statusHistoryBGColorPaid,
  statusHistoryColor,
  statusHistoryColorCredit,
  statusHistoryColorPaid,
  statusHistoryCredit,
  statusHistoryPaid,
} from '../../utils/mappingObj';
interface Props {
  status: string;
  isCancelOrder?: boolean;
  paidStatus?: string;
  paymentMethod: string;
}

export default function BadgeStatus({
  status,
  paidStatus = 'WAITING_PAID',
  isCancelOrder = false,
  paymentMethod,
}: Props) {
  const isCredit = paymentMethod === 'CREDIT';

  const color: any =
    paidStatus === 'WAITING_PAID'
      ? statusHistoryColor[status as keyof typeof statusHistoryColor]
      : statusHistoryColorPaid[status as keyof typeof statusHistoryColor];
  const title =
    paidStatus === 'WAITING_PAID'
      ? statusHistory[status as keyof typeof statusHistory]
      : statusHistoryPaid[status as keyof typeof statusHistory];

  const colorCredit: any =
    statusHistoryColorCredit[status as keyof typeof statusHistoryColor];
  const titleCredit = statusHistoryCredit[status as keyof typeof statusHistory];
  return isCredit ? (
    <View
      style={{
        backgroundColor:
          statusHistoryBGColorCredit[
            status as keyof typeof statusHistoryBGColorCredit
          ],
        borderRadius: 12,
        height: 30,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}>
      <Text color={colorCredit} fontSize={14} semiBold fontFamily="NotoSans">
        {isCancelOrder ? 'คำสั่งซื้อถูกยกเลิก' : titleCredit}
      </Text>
    </View>
  ) : (
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
