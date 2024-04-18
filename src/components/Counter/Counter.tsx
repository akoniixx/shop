import { StyleSheet, TextInput, Image, View, Pressable } from 'react-native';
import React, { forwardRef, useEffect, useRef } from 'react';
import Button from '../Button/Button';
import icons from '../../assets/icons';
import ModalWarning from '../Modal/ModalWarning';
import { useLocalization } from '../../contexts/LocalizationContext';
import { numberWithCommas } from '../../utils/function';
import { colors } from '../../assets/colors/colors';
interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: (value: { quantity: string; id?: any }) => void;
  id: string;
  onIncrease?: (id: string) => Promise<void>;
  onDecrease?: (id: string) => Promise<void>;
  setCounter?: React.Dispatch<React.SetStateAction<number>>;
}
const initialQuantity = '0.00';
const Counter = forwardRef(
  (
    {
      currentQuantity,
      onChangeText,
      onDecrease,
      onIncrease,
      id,
      setCounter,
    }: Props,
    ref: any,
  ): JSX.Element => {
    const [quantity, setQuantity] = React.useState<string>('0.00');
    const { t } = useLocalization();
    const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
    useEffect(() => {
      if (ref?.current) {
        setTimeout(() => {
          ref?.current?.focus();
        }, 500);
      }
    }, [ref]);
    useEffect(() => {
      if (+currentQuantity > 0) {
        setQuantity(currentQuantity.toFixed(2).toString());
        setCounter?.(currentQuantity);
      } else {
        setCounter?.(0);
        setQuantity('0.00');
      }
    }, [setCounter]);

    const onBlurInput = () => {
      if (+quantity === currentQuantity && +quantity > 0) {
        return;
      }

      if (+quantity <= 0 && currentQuantity > 0) {
        setIsModalVisible(true);
      } else if (+quantity > 0) {
        onChangeText?.({ id, quantity });
        setCounter?.(+quantity);
      } else {
        setCounter?.(0);
        setQuantity('0.00');
      }
    };
    return (
      <View style={styles().container}>
        <Button
          disabled={+quantity <= 0}
          onPress={() => {
            if (onDecrease) {
              onDecrease(id);
              setQuantity(prev => {
                if (+prev - 5 >= 5) {
                  return (+prev - 5).toFixed(2);
                }
                return +prev - 5 < 1 ? '0.00' : prev;
              });
              setCounter?.(prev => {
                if (prev - 5 >= 5) {
                  return prev - 5;
                }
                return prev - 5 < 1 ? 0 : prev;
              });
            }
          }}
          iconFont={
            <Image
              source={icons.iconMinus}
              style={{
                width: 26,
                height: 26,
              }}
            />
          }
          secondary
          style={{
            width: 40,
            height: 40,
          }}
        />
        <Pressable
          onPress={e => {
            e.stopPropagation();
          }}>
          <TextInput
            autoCapitalize="none"
            ref={ref}
            allowFontScaling={false}
            maxLength={10}
            value={
              quantity.length < 1
                ? initialQuantity
                : numberWithCommas(quantity, true).toString()
            }
            keyboardType="numeric"
            style={{
              fontFamily: 'NotoSansThai-Bold',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              textAlignVertical: 'center',
              height: 40,
              marginTop: 2,
              color: colors.text1,
            }}
            onChangeText={text => {
              // if (quantity.length === 1 && text === '') {
              //   setQuantity(initialQuantity);
              //   setCounter?.(0);
              //   onChangeText?.({ id, quantity: initialQuantity });
              // }
              if (
                text.startsWith('0') &&
                text.length > 1 &&
                !text.includes('.')
              ) {
                text = text.slice(1);
              }
              const convertedTextToDecimal = text.replace(/[^0-9.]/g, '');
              const onlyTwoDecimal = convertedTextToDecimal?.split('.');
              let newValue = '0.00';
              if (text.length >= 5 && text.startsWith('0')) {
                const lastLetter = text[text.length - 1];
                newValue = lastLetter;
              }
              const toFixed =
                onlyTwoDecimal.length > 1
                  ? onlyTwoDecimal[0] + '.' + onlyTwoDecimal[1].slice(0, 2)
                  : convertedTextToDecimal;

              const finalValue =
                quantity === initialQuantity && text !== initialQuantity
                  ? newValue
                  : toFixed;
              setQuantity(finalValue);
              setCounter?.(+finalValue);
              onChangeText?.({ id, quantity: finalValue });
            }}
            onBlur={onBlurInput}
          />
        </Pressable>
        <Button
          onPress={() => {
            onIncrease?.(id);
            setQuantity(prev => (+prev + 5).toFixed(2));
            setCounter?.(prev => prev + 5);
          }}
          iconFont={
            <Image
              source={icons.iconAdd}
              style={{
                width: 26,
                height: 26,
              }}
            />
          }
          secondary
          style={{
            width: 40,
            height: 40,
          }}
        />
        <ModalWarning
          title={t('modalWarning.cartDeleteTitle')}
          desc={t('modalWarning.cartDeleteDesc')}
          visible={isModalVisible}
          minHeight={50}
          width={'50%'}
          onConfirm={() => {
            setIsModalVisible(false);
            onChangeText?.({ id, quantity });
            setCounter?.(+quantity);
          }}
          onRequestClose={() => {
            setIsModalVisible(false);
            setQuantity(currentQuantity.toFixed(2).toString());
            setCounter?.(+quantity);
          }}
        />
      </View>
    );
  },
);

export default Counter;
const styles = () => {
  return StyleSheet.create({
    container: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
};
