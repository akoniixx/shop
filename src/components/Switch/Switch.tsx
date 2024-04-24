import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Animated, Pressable } from 'react-native';
import { colors } from '../../assets/colors/colors';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeThumbColor?: string;
  activeTrackColor?: string;
  inActiveThumbColor?: string;
  inActiveTrackColor?: string;
  thumbSize?: number;
  trackSize?: number;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  activeThumbColor = '#fff',
  activeTrackColor = colors.current,
  inActiveThumbColor = '#fff',
  inActiveTrackColor = '#dcdcdc',
  thumbSize = 30,
  trackSize = 34,
}) => {
  const [thumbTranslate] = useState(new Animated.Value(value ? thumbSize : 0));
  const [trackBackgroundColor, setTrackBackgroundColor] = useState(
    value ? activeTrackColor : inActiveTrackColor,
  );
  const [thumbBackgroundColor, setThumbBackgroundColor] = useState(
    value ? activeThumbColor : inActiveThumbColor,
  );

  const handleOnSwitchPress = useCallback(() => {
    const toValue = value ? 0 : thumbSize;
    const newThumbBackgroundColor = value
      ? inActiveThumbColor
      : activeThumbColor;
    const newTrackBackgroundColor = value
      ? inActiveTrackColor
      : activeTrackColor;

    Animated.spring(thumbTranslate, {
      toValue,
      useNativeDriver: false,
    }).start();
    setThumbBackgroundColor(newThumbBackgroundColor);
    setTrackBackgroundColor(newTrackBackgroundColor);
    onValueChange(!value);
  }, [
    value,
    onValueChange,
    thumbTranslate,
    thumbSize,
    activeThumbColor,
    inActiveThumbColor,
    activeTrackColor,
    inActiveTrackColor,
  ]);
  useEffect(() => {
    if (value) {
      const handleInitialSwitch = () => {
        const toValue = value ? thumbSize : 0;
        const newThumbBackgroundColor = value
          ? activeThumbColor
          : inActiveThumbColor;
        const newTrackBackgroundColor = value
          ? activeTrackColor
          : inActiveTrackColor;
        Animated.spring(thumbTranslate, {
          toValue,
          useNativeDriver: false,
        }).start();
        setThumbBackgroundColor(newThumbBackgroundColor);
        setTrackBackgroundColor(newTrackBackgroundColor);
      };
      handleInitialSwitch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <Pressable
      onPress={handleOnSwitchPress}
      style={{
        width: 2 * trackSize,
        zIndex: 1,
        position: 'relative',
      }}>
      <View
        pointerEvents="none"
        style={[
          styles.track,
          { backgroundColor: trackBackgroundColor, height: trackSize },
        ]}>
        <Animated.View
          pointerEvents={'none'}
          style={[
            styles.thumb,
            {
              backgroundColor: thumbBackgroundColor,
              height: thumbSize,
              width: thumbSize,
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 8,
    width: '100%',
  },
  thumb: {
    borderRadius: 20,
    borderColor: colors.border1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default Switch;
