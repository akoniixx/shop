import { View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import {
  statusHistoryCashText,
  statusHistoryCashColor,
  statusHistoryCashBGColor,
} from '../../utils/mappingObj';
import { useAuth } from '../../contexts/AuthContext';
interface Props {
  status: string;
}

export default function BadgeStatusShop({ status }: Props) {
  const color: any =
    statusHistoryCashColor[status as keyof typeof statusHistoryCashColor];
  const {
    state: { company },
  } = useAuth();

  const title = statusHistoryCashText(company || '')[
    status as keyof typeof statusHistoryCashText
  ];

  if (status === 'DELIVERY_SUCCESS') {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor:
          statusHistoryCashBGColor[
            status as keyof typeof statusHistoryCashBGColor
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
        {title}
      </Text>
    </View>
  );
}
