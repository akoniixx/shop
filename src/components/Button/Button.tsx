import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';

interface ButtonStyledProps {
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  success?: boolean;
  radius?: number;
  noBorder?: boolean;
  disabled?: boolean;

  background3?: boolean;
}
interface Props extends TouchableOpacityProps, ButtonStyledProps {
  title?: string;
  fontSize?: 16 | 18 | 20 | 24;
  textStyle?: TextStyle;
  iconFont?: React.ReactNode;
  iconBack?: React.ReactNode;
}
export default function Button({ title, ...props }: Props): JSX.Element {
  return (
    <TouchableOpacity
      {...props}
      style={[styled({ ...props }).button, props.style]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {props.iconFont && props.iconFont}
        {title && (
          <Text
            fontFamily="NotoSans"
            bold
            fontSize={props.fontSize}
            color={props.secondary ? 'primary' : 'white'}>
            {title}
          </Text>
        )}
        {props.iconBack && props.iconBack}
      </View>
    </TouchableOpacity>
  );
}
const styled = ({
  secondary,
  success,
  danger,
  background3,
  radius = 8,
  disabled = false,
}: ButtonStyledProps) => {
  const backgroundColor = secondary
    ? colors.background2
    : success
    ? colors.success
    : danger
    ? colors.error
    : disabled
    ? colors.border1
    : background3
    ? '#B0B5BF'
    : colors.primary;
  return StyleSheet.create({
    button: {
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      width: '100%',
      borderRadius: radius,
    },
  });
};
