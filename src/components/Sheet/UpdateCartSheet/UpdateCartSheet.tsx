import { StyleSheet, View } from 'react-native';
import React from 'react';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import Text from '../../Text/Text';
import { useCart } from '../../../contexts/CartContext';

interface PayloadType {}
export default function UpdateCartSheet(props: SheetProps) {
  const {
    cartApi: { postCartItem },
    cartList,
  } = useCart();
  return (
    <ActionSheet
      containerStyle={{
        height: '40%',
        justifyContent: 'space-between',
      }}
      id={props.sheetId}>
      <View>
        <Text>test</Text>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({});
