import { View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Text from '../../Text/Text';
import icons from '../../../assets/icons';
import { colors } from '../../../assets/colors/colors';
import Button from '../../Button/Button';

export default function SelectPaymentStatusSheet(props: SheetProps) {
  const [currentStatus, setCurrentStatus] = React.useState<{
    label: string;
    value: string;
  }>({ value: 'ALL', label: 'ทั้งหมด' });
  const listStatus = [
    {
      label: 'ทั้งหมด',
      value: 'ALL',
    },
    {
      label: 'รอชำระเงิน',
      value: 'WAITING_PAID',
    },
    {
      label: 'ชำระเงินแล้ว',
      value: 'ALREADY_PAID',
    },
  ];
  useEffect(() => {
    if (props.payload) {
      setCurrentStatus(props.payload.currentStatus);
    }
  }, [props.payload]);
  return (
    <ActionSheet
      onClose={async () => {
        await SheetManager.hide(props.sheetId, {
          payload: currentStatus,
        });
      }}
      containerStyle={{
        height: '40%',
        justifyContent: 'space-between',
      }}
      id={props.sheetId}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 64,
          }}>
          <Text fontSize={20} bold fontFamily="NotoSans">
            เลือกวิธีการชำระเงิน
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await SheetManager.hide(props.sheetId, {
                payload: currentStatus,
              });
            }}
            style={{
              position: 'absolute',
              right: 16,
            }}>
            <Image
              source={icons.iconCloseBlack}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: colors.background1,
            minHeight: 100,
          }}>
          {listStatus.map((item, index) => {
            const selected = item.value === currentStatus.value;
            return (
              <TouchableOpacity
                onPress={() => {
                  setCurrentStatus(item);
                }}
                key={index}
                style={{
                  height: 50,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  paddingHorizontal: 16,

                  borderBottomColor: colors.border1,
                }}>
                <Text lineHeight={28}>{item.label}</Text>
                <View
                  style={{
                    borderColor: selected ? colors.primary : colors.border1,
                    backgroundColor: selected ? colors.white : colors.border1,
                    borderWidth: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border1,
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Button
            onPress={async () => {
              await SheetManager.hide(props.sheetId, {
                payload: currentStatus,
              });
            }}
            title="ตกลง"
          />
        </View>
      </View>
    </ActionSheet>
  );
}
