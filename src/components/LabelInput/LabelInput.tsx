import { StyleSheet, View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';

interface Props {
  children: React.ReactNode;
  required?: boolean;
}
const LabelInput = ({ children, required = false }: Props) => {
  return (
    <View style={styles.row}>
      <Text color="text2" fontFamily="NotoSans" semiBold fontSize={16}>
        {children}{' '}
        {required && (
          <Text color="error" semiBold fontFamily="NotoSans">
            *
          </Text>
        )}
      </Text>
    </View>
  );
};

export default LabelInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
});
