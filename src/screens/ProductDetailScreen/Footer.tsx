import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import Counter from '../../components/Counter/Counter';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import icons from '../../assets/icons';
import { ProductSummary } from '../../entities/productEntities';

interface Props {
  id: string;
  navigation: any;
  setIsAddCart: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelCart: React.Dispatch<React.SetStateAction<boolean>>;
  productItem: ProductSummary;
}
export default function Footer({
  id,
  setIsAddCart,
  setIsDelCart,
  navigation,
  productItem,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  // console.log('cartList', JSON.stringify(cartList, null, 2));
  const currentProduct = cartList?.find(
    item => item?.productId.toString() === id,
  );
  const onChangeText = async ({
    quantity,
    id,
  }: {
    quantity: string;
    id?: any;
  }) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      if (+quantity < 1) {
        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        setIsDelCart(true);
        return;
      } else {
        newCartList[findIndex].quantity = Number(quantity);
        setCartList(newCartList);
      }
    } else {
      const newCartList = [
        ...cartList,
        {
          ...productItem,

          quantity: Number(quantity),
          shipmentOrder: cartList.length + 1,
        },
      ];
      setIsAddCart(true);
      setCartList(newCartList);
    }
  };
  const onIncrease = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].quantity += 5;

      setCartList(newCartList);
    } else {
      const newCartList = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          quantity: 5,
          shipmentOrder: cartList?.length + 1,
        },
      ];
      setCartList(newCartList);
    }
    setIsAddCart(true);
  };
  const onDecrease = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );

    if (findIndex !== -1) {
      const newCartList = [...cartList];
      const amount = newCartList[findIndex].quantity;
      if (amount > 5) {
        newCartList[findIndex].quantity -= 5;
        setCartList(newCartList);
      } else {
        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        setIsDelCart(true);
      }
    }
  };
  const onOrder = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].quantity += 5;
      newCartList[findIndex].shipmentOrder = newCartList.length + 1;
      setCartList(newCartList);
    } else {
      const newCartList = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          quantity: 5,
          shipmentOrder: cartList?.length + 1,
        },
      ];
      setCartList(newCartList);
    }
    setIsAddCart(true);
    navigation.navigate('CartScreen');
  };
  return (
    <View style={styles().container}>
      <View
        style={{
          flex: 0.8,
        }}>
        <Counter
          currentQuantity={
            currentProduct?.quantity ? currentProduct.quantity : 0
          }
          id={id}
          onChangeText={onChangeText}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </View>
      <View
        style={{
          flex: 0.2,
        }}
      />
      <View
        style={{
          flex: 0.8,
        }}>
        <Button
          title={t('screens.ProductDetailScreen.orderButton')}
          onPress={onOrder}
          iconBack={
            <Image
              source={icons.cartFill}
              style={{
                width: 24,
                height: 24,
                marginLeft: 8,
              }}
            />
          }
        />
      </View>
    </View>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      padding: 16,
      height: 82,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 1.62,
      elevation: 14,
    },
  });
};
