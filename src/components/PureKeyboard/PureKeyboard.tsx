import React from 'react';
import { View, TouchableOpacity, ViewStyle, Image } from 'react-native';
import Text from '../Text/Text';
import icons from '../../assets/icons';

interface Props {
  onChange: (key: string) => void;
  currentValue: string;
  isEdit?: boolean;
}
const COLOR_KEYBOARD = '#FCFCFE';
const SHADOW_STYLE: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.42,
  shadowRadius: 0.02,
  elevation: 3,
};
const PureKeyboard = ({ onChange, currentValue, isEdit }: Props) => {
  const numberRicKeyboard = [
    {
      key: '1',
      value: '1',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: '1',
    },
    {
      key: '2',
      value: '2',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'ABC',
    },
    {
      key: '3',
      value: '3',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'DEF',
    },
    {
      key: '4',
      value: '4',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'GHI',
    },
    {
      key: '5',
      value: '5',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'JKL',
    },
    {
      key: '6',
      value: '6',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'MNO',
    },
    {
      key: '7',
      value: '7',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'PQRS',
    },
    {
      key: '8',
      value: '8',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'TUV',
    },
    {
      key: '9',
      value: '9',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: 'WXYZ',
    },
    {
      key: '.',
      value: '.',
      backgroundColor: 'transparent',
      subLabel: '',
    },

    {
      key: '0',
      value: '0',
      backgroundColor: COLOR_KEYBOARD,
      subLabel: '',
    },

    {
      key: 'Del',
      value: 'Del',
      backgroundColor: 'transparent',
      subLabel: '',
    },
  ];
  const onKeyPress = (key: string) => {
    if (key === 'Del') {
      return currentValue.slice(0, -1);
    } else if (key === '.') {
      return currentValue.includes('.') ? currentValue : currentValue + key;
    } else {
      const isEqual = currentValue === '0' || currentValue === '' || isEdit;

      if (isEqual) {
        return key;
      } else {
        return currentValue + key;
      }
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#d1d5db',
        paddingBottom: 60,
        paddingTop: 10,
        paddingHorizontal: 4,
      }}>
      {numberRicKeyboard.map((item, idx) => (
        <View
          key={idx}
          style={{
            width: '33.333333%',
            paddingHorizontal: 2,
            paddingVertical: 2,
          }}>
          <TouchableOpacity
            onPress={() => {
              const cur = onKeyPress(item.key);
              onChange(cur);
            }}
            style={{
              backgroundColor: item.backgroundColor,
              borderRadius: 8,
              paddingHorizontal: 0,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              ...SHADOW_STYLE,
            }}>
            {item.key === 'Del' ? (
              <>
                <Image
                  source={icons.deleteKeyboard}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  resizeMode="contain"
                />
              </>
            ) : (
              <>
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                  fontFamily="Sarabun"
                  medium
                  fontSize={26}>
                  {item.value}
                </Text>
                {/* {item.subLabel && (
                  <Text
                    fontSize={12}
                    fontFamily="Sarabun"
                    lineHeight={20}
                    medium>
                    {item.subLabel !== '1' ? item.subLabel : ' '}
                  </Text>
                )} */}
              </>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default PureKeyboard;
