import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { useLocalization } from '../../contexts/LocalizationContext';
import ModalWarning from '../../components/Modal/ModalWarning';
import { numberWithCommas } from '../../utils/function';
import Text from '../../components/Text/Text';
import { ProductType } from '../../entities/productEntities';
import { SheetManager } from 'react-native-actions-sheet';
import { SHEET_ID } from '../../components/Sheet/sheets';
interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: (value: { quantity: string; id?: any }) => void;

  id: string;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  disable?: boolean;
  productData?: ProductType;
}
const CounterSmall = ({
  currentQuantity = 0,
  onChangeText,
  onDecrease,
  onIncrease,
  id,
  disable,
  productData,
}: Props): JSX.Element => {
  const [quantity, setQuantity] = React.useState<string>('0.00');
  const { t } = useLocalization();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  // const onBlurInput = () => {
  //   onChangeText?.({ id, quantity });

  //   if (+quantity < 1 && currentQuantity > 0) {
  //     setIsModalVisible(true);
  //   } else {
  //     onChangeText?.({ id, quantity });
  //   }
  // };

  useEffect(() => {
    if (+currentQuantity > 0) {
      setQuantity(currentQuantity.toFixed(2).toString());
    } else {
      setQuantity('0.00');
    }
  }, [currentQuantity]);

  const onOpenActionSheet = async () => {
    await SheetManager.show(SHEET_ID.UPDATE_CART_SHEET, {
      payload: {
        productData: productData,
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: disable ? '#E1E7F6' : 'white' },
      ]}>
      <TouchableOpacity
        disabled={disable}
        style={[
          styles.button,
          { backgroundColor: disable ? '#E1E7F6' : colors.primary },
        ]}
        onPress={() => {
          if (onDecrease) {
            onDecrease(id);
          }
        }}>
        <Image
          source={icons.iconMinusWhite}
          style={{
            width: 10,
            height: 10,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        disabled={disable}
        onPress={e => {
          e.stopPropagation();
          onOpenActionSheet();
        }}>
        <Text bold fontSize={12}>
          {numberWithCommas(quantity)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={disable}
        style={[
          styles.button,
          { backgroundColor: disable ? '#E1E7F6' : colors.primary },
        ]}
        onPress={() => {
          if (onIncrease) {
            onIncrease(id);
          }
        }}>
        <Image
          source={icons.iconAddWhite}
          style={{
            width: 16,
            height: 16,
          }}
        />
      </TouchableOpacity>
      <ModalWarning
        title={t('modalWarning.cartDeleteTitle')}
        desc={t('modalWarning.cartDeleteDesc')}
        visible={isModalVisible}
        onConfirm={() => {
          setIsModalVisible(false);
          onChangeText?.({ id, quantity });
        }}
        onRequestClose={() => {
          setIsModalVisible(false);
          setQuantity(currentQuantity.toFixed(2).toString());
          onChangeText?.({
            id,
            quantity: currentQuantity.toFixed(2).toString(),
          });
        }}
      />
    </View>
  );
};

export default CounterSmall;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 15,
    paddingHorizontal: 4,
    height: 30,
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
