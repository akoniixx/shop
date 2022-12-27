import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';

interface Props {
  listCheckbox: {
    title: string;
    value: string;
    key: string;
  }[];
  disabled?: boolean;
  valueCheckbox?: string[];
  onPress?: (value: string) => void;
}
export default function Checkbox({
  listCheckbox = [],
  valueCheckbox,
  onPress,
  disabled = false,
}: Props): JSX.Element {
  return (
    <>
      {listCheckbox.map((item, idx) => {
        const isLast = idx === listCheckbox.length - 1;
        return (
          <View key={idx} style={styles({ isLast }).containerCheckbox}>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => onPress && onPress(item.value)}
              style={
                styles({
                  isChecked: valueCheckbox?.includes(item.value),
                }).checkBox
              }>
              {valueCheckbox?.includes(item.value) && (
                <Image
                  source={icons.iconCheck}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              )}
            </TouchableOpacity>
            <Text>{item.title}</Text>
          </View>
        );
      })}
    </>
  );
}
const styles = ({
  isChecked = false,
  isLast = false,
}: {
  isChecked?: boolean;
  isLast?: boolean;
}) => {
  return StyleSheet.create({
    checkBox: {
      borderColor: isChecked ? colors.primary : colors.border1,
      backgroundColor: isChecked ? colors.primary : colors.border1,
      borderWidth: 5,
      width: 20,
      height: 20,
      borderRadius: 4,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerCheckbox: {
      flexDirection: 'row',
      alignItems: 'center',

      marginBottom: isLast ? 0 : 12,
    },
  });
};
