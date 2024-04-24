import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { useNavigation } from '@react-navigation/native';
import icons from '../../assets/icons';

interface Props {
  title?: string;
  componentLeft?: React.ReactNode;
  componentRight?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onBack?: () => void;
  titleColor?:
    | 'primary'
    | 'secondary'
    | 'white'
    | 'text1'
    | 'text2'
    | 'text3'
    | 'current'
    | 'error'
    | 'specialRequest'
    | 'waiting'
    | 'border2';
}
export default function Header({
  title,
  componentLeft,
  componentRight,
  titleColor = 'text1',
  style,
  onBack,
  textStyle,
}: Props) {
  const navigation = useNavigation();
  return (
    <View style={[styled.container, style]}>
      {componentLeft ? (
        componentLeft
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (onBack) {
              onBack();
            } else {
              navigation.goBack();
            }
          }}>
          <Image
            source={icons.BackIcon}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>
      )}
      <Text
        fontFamily="NotoSans"
        bold
        fontSize={20}
        color={titleColor}
        style={textStyle}>
        {title}
      </Text>
      {componentRight ? (
        componentRight
      ) : (
        <View
          style={{
            width: 24,
          }}
        />
      )}
    </View>
  );
}
const styled = StyleSheet.create({
  container: {
    minHeight: 60,
    padding: 16,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
