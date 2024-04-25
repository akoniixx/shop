import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface InputStyledProps {
  isError?: boolean;
}
interface Props extends TextInputProps, InputStyledProps {
  value?: any;
}
const InputText = React.forwardRef(({ style, ...props }: Props, ref) => {
  return (
    <TextInput
      ref={ref as React.MutableRefObject<TextInput>}
      placeholderTextColor={colors.text3}
      scrollEnabled={false}
      {...props}
      style={[
        styles({
          ...props,
        }).input,
        props.multiline
          ? {}
          : {
              height: 48,
            },
        style,
      ]}
    />
  );
});

export default InputText;
const styles = ({ isError = false }: InputStyledProps) => {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: isError ? colors.error : colors.border1,
      borderRadius: 6,
      paddingLeft: 16,

      fontSize: 16,
      color: colors.text1,
      fontFamily: 'Sarabun-Regular',
    },
  });
};
