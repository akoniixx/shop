import {
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';
import { SheetManager } from 'react-native-actions-sheet';
import icons from '../../assets/icons';

interface Props {
  style?: ViewStyle;
  value?: { label: string; value: any } | null;
  listRadio?: any[];
  placeholder?: string;
  sheetId?: string;
  onSelected?: (value: any) => void;
}
const InputSheet = React.forwardRef(
  (
    { style, value, placeholder, onSelected, sheetId, listRadio }: Props,
    ref,
  ) => {
    const onSelectedSheet = async () => {
      if (!sheetId) {
        return;
      }
      const result = await SheetManager.show(sheetId, {
        payload: {
          currentVal: value,
          listRadio,
          titleHeader: placeholder,
        },
      });
      if (result && onSelected) {
        onSelected(result);
      }
    };
    return (
      <TouchableOpacity
        style={[styles().container, style]}
        onPress={onSelectedSheet}>
        {value ? (
          <Text>{value.label}</Text>
        ) : (
          <Text color="text3">{placeholder}</Text>
        )}
        <Image source={icons.iconArrowDown} style={styles().image} />
      </TouchableOpacity>
    );
  },
);

export default InputSheet;
const styles = () => {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.border1,
      borderRadius: 6,
      paddingLeft: 16,
      paddingRight: 24,
      paddingVertical: 12,
      height: 48,

      fontSize: 16,
      color: colors.text1,
      fontFamily: 'Sarabun-Regular',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    image: {
      width: 26,
      height: 26,
    },
  });
};
