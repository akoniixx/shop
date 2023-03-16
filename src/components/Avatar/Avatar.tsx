import {
  View,
  Text,
  ImageSourcePropType,
  Image,
  ImageStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';

interface Props {
  source: ImageSourcePropType;
  style?: ImageStyle;
  styleView?: ViewStyle;
  width?: number;
  height?: number;
  isShowEdit?: boolean;
  onPressEdit?: () => void;
}
export default function Avatar({
  source,
  style,
  styleView,
  isShowEdit = true,
  onPressEdit,
  ...props
}: Props) {
  const { width = 108, height = 108 } = props;
  const borderRadius = width / 2;
  return (
    <View
      style={{
        borderRadius,
        width,
        height,
        backgroundColor: colors.background1,
        justifyContent: 'center',
        alignItems: 'center',
        ...styleView,
      }}>
      <Image
        source={source}
        style={{
          width: width,
          height: height,
          ...style,
        }}
      />
      <TouchableOpacity
        onPress={onPressEdit}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 4,
        }}>
        <Image
          source={icons.iconEditPhoto}
          style={{
            width: 28,
            height: 28,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
