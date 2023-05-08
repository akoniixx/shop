import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { getNewPath } from '../../utils/function';
import { useCart } from '../../contexts/CartContext';
import Counter from '../../components/Counter/Counter';
import icons from '../../assets/icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { ProductType } from '../../entities/productEntities';
import ImageCache from '../../components/ImageCache/ImageCache';

interface Props extends ProductType {
  navigation: StackNavigationProp<
    MainStackParamList,
    'StoreDetailScreen',
    undefined
  >;
  setIsDelCart: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddCart: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Item({
  productImage,
  productName,
  unitPrice,
  productId,
  setIsAddCart,
  setIsDelCart,
  navigation,
  promotion,

  ...props
}: Props) {
  const { t } = useLocalization();
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const isAlreadyInCart = cartList.find(
    el => el.productId.toString() === productId.toString(),
  );
  const isPromo = promotion && promotion.length > 0;

  const onFirstAddCart = async (id: string) => {
    const newCartList = [
      ...cartList,
      {
        ...props,
        productImage,
        productName,
        unitPrice,
        productId: id,
        quantity: 5.0,
        shipmentOrder: cartList.length + 1,
      },
    ];
    setCartList(newCartList);
    await postCartItem(newCartList);
    setIsAddCart(true);
  };
  const onAddCartByIndex = async (id: string) => {
    const findIndex = cartList.findIndex(
      el => el.productId.toString() === id.toString(),
    );

    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].quantity += 5.0;

      setCartList(newCartList);
      await postCartItem(newCartList);
    }
  };
  const onSubtractCartByIndex = async (id: string) => {
    const findIndex = cartList.findIndex(
      el => el.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].quantity -= 5.0;
      if (newCartList[findIndex].quantity <= 0) {
        newCartList.splice(findIndex, 1);
        setIsDelCart(true);
      }
      setCartList(newCartList);
      await postCartItem(newCartList);
    }
  };
  const onChangeText = async ({
    id,
    quantity,
  }: {
    quantity: string;
    id?: any;
  }) => {
    const findIndex = cartList.findIndex(
      el => el.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].quantity = +quantity;
      if (newCartList[findIndex].quantity <= 0) {
        newCartList.splice(findIndex, 1);
        setIsDelCart(true);
      }
      setCartList(newCartList);
      await postCartItem(newCartList);
    }
  };
  return (
    <TouchableOpacity
      style={styles().shadow}
      onPress={() => navigation.navigate('ProductDetailScreen', { productId })}>
      <View style={styles().container}>
        {isPromo && (
          <Image
            source={icons.promoIcon}
            style={{
              width: 45,
              height: 18,
              position: 'absolute',
              right: 16,
              top: 8,
              zIndex: 10,
            }}
          />
        )}
        <View>
          {productImage ? (
            <View
              style={{
                height: 100,
                marginBottom: 8,
                position: 'relative',
              }}>
              <ImageCache
                uri={getNewPath(productImage)}
                style={{
                  height: 100,
                }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View
              style={{
                height: 100,

                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <Image
                source={images.emptyProduct}
                style={{
                  height: 90,
                  width: 90,
                }}
              />
            </View>
          )}
          <View
            style={{
              width: '100%',

              marginBottom: 8,
            }}>
            <Text
              fontFamily="Sarabun"
              bold
              numberOfLines={2}
              left
              style={{
                height: 26,
              }}>
              {productName}
            </Text>

            {/* {!!props.packSize ? (
              <Text
                color="text3"
                numberOfLines={1}
                style={{
                  height: 28,
                }}>
                {props.packSize}
              </Text>
            ) : (
              <View
                style={{
                  height: 28,
                }}
              />
            )} */}
            {/* <Text fontSize={18} bold>
              {t('screens.StoreDetailScreen.price', {
                price: numberWithCommas(+unitPrice),
              })}
              <Text color="text3"> /{props.baseUOM}</Text>
            </Text> */}
          </View>
          {!!isAlreadyInCart ? (
            <Counter
              id={productId}
              onDecrease={onSubtractCartByIndex}
              onIncrease={onAddCartByIndex}
              currentQuantity={+isAlreadyInCart.quantity}
              onChangeText={onChangeText}
            />
          ) : (
            <Button
              title={t('screens.StoreDetailScreen.buttonAddCart')}
              secondary
              onPress={() => onFirstAddCart(productId)}
              iconFont={
                <Image
                  source={icons.iconAdd}
                  style={{
                    width: 26,
                    height: 26,
                    marginRight: 4,
                  }}
                />
              }
              style={{
                height: 40,
                paddingVertical: 10,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: colors.border1,
      borderRadius: 12,
      padding: Platform.OS === 'ios' ? 16 : 10,
      width: '100%',
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
      width: '48%',

      marginBottom: 8,
    },
  });
};
