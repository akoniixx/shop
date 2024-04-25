import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';

interface Props {
  value?: boolean;
}
export default function RadioFake({ value }: Props): JSX.Element {
  const scaleValue = useRef(new Animated.Value(1))?.current;

  const animate = () =>
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  const resetAnimate = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (value) {
      animate();
    } else {
      resetAnimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: value ? colors.primary : colors.border1,
        width: 'auto',
        borderRadius: 50,
        padding: 2,
      }}>
      <Animated.View
        style={[
          styles({ selected: value }).radio,
          { transform: [{ scale: scaleValue }] },
        ]}
      />
    </View>
  );
}

const styles = ({ selected = false }: { selected?: boolean }) => {
  return StyleSheet.create({
    radio: {
      borderColor: selected ? colors.white : colors.border1,
      backgroundColor: selected ? colors.primary : colors.border1,
      borderWidth: 1,
      width: 18,
      height: 18,
      borderRadius: 10,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};
