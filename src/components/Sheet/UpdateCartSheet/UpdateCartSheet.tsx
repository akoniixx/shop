import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Text from '../../Text/Text';
import { useCart } from '../../../contexts/CartContext';
import { ProductType } from '../../../entities/productEntities';
import { colors } from '../../../assets/colors/colors';
import icons from '../../../assets/icons';
import Counter from '../../Counter/Counter';
import Button from '../../Button/Button';
import images from '../../../assets/images';
import ImageCache from '../../ImageCache/ImageCache';
import { getNewPath } from '../../../utils/function';

interface PayloadType {
  productData: ProductType;
}
export const NUMBER_INCREMENT = 1.0;
export default function UpdateCartSheet(props: SheetProps) {
  const { productData } = props.payload as PayloadType;
  const productImage = productData.productImage;
  const productName = productData.productName;
  const inputRef = useRef(null);
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const [isDelCart, setIsDelCart] = React.useState<boolean>(false);
  const [currentQuantity, setCurrentQuantity] = React.useState<number>(0);

  const isAlreadyInCart = useMemo(() => {
    return cartList.find(
      el => el.productId.toString() === productData.productId.toString(),
    );
  }, [cartList, productData.productId]);

  const isPromo = useMemo(() => {
    return !!productData.promotion && productData.promotion.length > 0;
  }, [productData.promotion]);
  const titleHeader = isAlreadyInCart ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า';
  const onAddCartByIndex = async (id: string) => {
    setCurrentQuantity(currentQuantity + NUMBER_INCREMENT);
  };
  const onSubtractCartByIndex = async (id: string) => {
    setCurrentQuantity(currentQuantity - NUMBER_INCREMENT);
  };
  const onChangeText = async ({
    id,
    quantity,
  }: {
    quantity: string;
    id?: any;
  }) => {
    setCurrentQuantity(+quantity);
  };
  const onUpdateCart = async () => {
    if (currentQuantity === 0) {
      setIsDelCart(true);
      return;
    }

    const find = cartList.find(
      el => el.productId.toString() === productData.productId.toString(),
    );
    const newData = {
      ...productData,
      productImage,
      productName,
      unitPrice: productData.unitPrice,
      productId: productData.productId,
      quantity: currentQuantity,
      shipmentOrder: cartList.length + 1,
    };
    const newCartList = find
      ? cartList.map(el =>
          el.productId.toString() === productData.productId.toString()
            ? { ...el, quantity: currentQuantity }
            : el,
        )
      : [...cartList, newData];
    setCartList(newCartList);
    try {
      await postCartItem(newCartList);
      SheetManager.hide(props.sheetId);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (isAlreadyInCart) {
      setCurrentQuantity(isAlreadyInCart.quantity);
    }
  }, [isAlreadyInCart]);
  return (
    <ActionSheet
      id={props.sheetId}
      useBottomSafeAreaPadding={false}
      safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
      containerStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <View style={styles.header}>
        <Text fontFamily="NotoSans" bold fontSize={18}>
          {titleHeader}
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => SheetManager.hide(props.sheetId)}>
          <Image source={icons.iconCloseBlack} style={styles.closeImg} />
        </TouchableOpacity>
      </View>
      <View style={styles.containerProduct}>
        {isPromo && (
          <Image
            source={icons.promoIcon}
            style={{
              width: 50,
              height: 23,
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 10,
            }}
            resizeMode="contain"
          />
        )}
        {productImage ? (
          <View
            style={{
              height: 100,
              padding: 16,
              width: 100,
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
        <View style={styles.rightContent}>
          <Text
            fontFamily="Sarabun"
            bold
            left
            style={{
              width: '80%',
              position: 'relative',
              bottom: 4,
            }}>
            {productName}
          </Text>
        </View>
      </View>

      <View style={styles.containerCounter}>
        <Text fontFamily="Sarabun">จำนวน</Text>
        <View style={styles.counter}>
          <Counter
            currentQuantity={currentQuantity}
            id={productData.productId.toString()}
            ref={inputRef}
            onIncrease={() =>
              onAddCartByIndex(productData.productId.toString())
            }
            onDecrease={() =>
              onSubtractCartByIndex(productData.productId.toString())
            }
            onChangeText={onChangeText}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          danger={+currentQuantity <= 0 && !!isAlreadyInCart}
          title={
            +currentQuantity <= 0 && isAlreadyInCart
              ? 'ลบรายการ'
              : 'ยืนยันการแก้ไข'
          }
          onPress={onUpdateCart}
        />
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border1,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  closeImg: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,

    backgroundColor: colors.grey1,
  },
  containerProduct: {
    width: '100%',
    marginBottom: 32,
    flexDirection: 'row',
    height: 100,
    paddingHorizontal: 16,
  },
  rightContent: {
    flex: 1,
    justifyContent: 'center',
  },
  containerCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.border1,
    padding: 16,
    backgroundColor: colors.grey1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.4,
  },
});
