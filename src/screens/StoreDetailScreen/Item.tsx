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
import { getNewPath, numberWithCommas } from '../../utils/function';
import { useCart } from '../../contexts/CartContext';
import Counter from '../../components/Counter/Counter';
import icons from '../../assets/icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';

interface Props {
  productImage?: string;
  productName?: string;
  unitPrice: string;
  packSize: string;
  productId: string;
  baseUOM: string;
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
  ...props
}: Props) {
  const { t } = useLocalization();
  const { cartList } = useCart();
  const isAlreadyInCart = cartList.find(el => el.productId === productId);
  const isPromo = true;
  const onFirstAddCart = async (id: string) => {
    console.log('onFirstAddCart', id);
    setIsAddCart(true);
  };
  const onAddCartByIndex = async (id: string) => {
    console.log('onAddCartByIndex', id);
    setIsAddCart(true);
  };
  const onSubtractCartByIndex = async (id: string) => {
    console.log('onSubtractCartByIndex', id);
  };
  const onChangeText = async (id: string, value: string) => {
    console.log('onChangeText', id, value);
    setIsAddCart(true);
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
            }}
          />
        )}
        <View>
          {productImage ? (
            <View
              style={{
                height: 100,
                marginBottom: 8,
              }}>
              <Image
                source={{ uri: getNewPath(productImage) }}
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
              marginBottom: 8,
            }}>
            <Text
              fontFamily="Sarabun"
              semiBold
              numberOfLines={1}
              style={{
                height: 26,
              }}>
              {productName}
            </Text>

            {!!props.packSize ? (
              <Text
                color="text3"
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
            )}
            <Text fontSize={18} bold>
              {t('screens.StoreDetailScreen.price', {
                price: numberWithCommas(+unitPrice),
              })}
              <Text color="text3"> /{props.baseUOM}</Text>
            </Text>
          </View>
          {!!isAlreadyInCart ? (
            <Counter
              id={isAlreadyInCart.productId}
              onDecrease={onSubtractCartByIndex}
              onIncrease={onAddCartByIndex}
              currentQuantity={+isAlreadyInCart.amount}
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
