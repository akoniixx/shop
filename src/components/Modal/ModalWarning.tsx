import React from 'react';
import {
  View,
  Modal as ModalRN,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';

type Props = {
  onRequestClose?: () => void;
  onConfirm?: () => void;
  visible: boolean;
  titleCenter?: boolean;
  width?: string | number;
  title: string;
  desc?: string;
  textCancel?: string;
  textConfirm?: string;
  onlyCancel?: boolean;
  minHeight?: number;
  ColorDesc?:
    | 'white'
    | 'text3'
    | 'primary'
    | 'secondary'
    | 'text1'
    | 'text2'
    | 'current'
    | 'error'
    | 'specialRequest'
    | 'waiting'
    | 'warning'
    | 'subheading3'
    | 'border2'
    | undefined;
};

export default function ModalWarning({
  visible,
  onRequestClose,
  onConfirm,
  width,
  title,
  titleCenter,
  desc,
  textCancel = 'ยกเลิก',
  textConfirm = 'ยืนยัน',
  onlyCancel = false,
  minHeight = 100,
  ColorDesc,
}: Props): JSX.Element {
  return (
    <ModalRN
      animationType="fade"
      onRequestClose={onRequestClose}
      visible={visible}
      transparent>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}>
        <View style={[styles.modalView, { width }]}>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              minHeight,
            }}>
            <Text semiBold lineHeight={30} center={!titleCenter}>
              {title}
            </Text>
            {desc && (
              <Text
                fontSize={14}
                center
                fontFamily="Sarabun"
                color={ColorDesc ? ColorDesc : 'text3'}
                style={{
                  width: '100%',
                }}>
                {desc}
              </Text>
            )}
          </View>
          <View
            style={{
              height: 40,
              flexDirection: 'row',
              width: '100%',
              borderTopWidth: 1,
              borderTopColor: colors.border1,
            }}>
            <TouchableOpacity
              onPress={onRequestClose}
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text semiBold fontSize={14} fontFamily="NotoSans" center>
                {textCancel}
              </Text>
            </TouchableOpacity>
            {!onlyCancel && (
              <TouchableOpacity
                onPress={onConfirm}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderLeftWidth: 1,
                  borderLeftColor: colors.border1,
                }}>
                <Text
                  semiBold
                  center
                  fontSize={14}
                  fontFamily="NotoSans"
                  color="primary">
                  {textConfirm}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ModalRN>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  close: {
    width: 24,
    height: 24,
  },
});
