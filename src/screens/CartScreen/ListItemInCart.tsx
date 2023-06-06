import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useMemo } from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import CounterSmall from './CounterSmall';
import images from '../../assets/images';
import Dropdown from '../../components/Dropdown/Dropdown';
import GiftFromPromotion from './GiftFromPromotion';
import ModalWarning from '../../components/Modal/ModalWarning';
import ModalMessage from '../../components/Modal/ModalMessage';
import { getNewPath, numberWithCommas } from '../../utils/function';

export default function ListItemInCart() {
  const { t } = useLocalization();
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const isPromotion = false;
  const [visibleDel, setVisibleDel] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [delId, setDelId] = React.useState<string | number>('');
  const onChangeOrder = async (value: any, id: string) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);
    const findOrder = cartList?.findIndex(
      item => +item?.shipmentOrder === +value,
    );
    if (findOrder !== -1 && cartList.length > 1) {
      const newCartList = [...cartList];
      newCartList[findOrder].shipmentOrder =
        +newCartList[findIndex].shipmentOrder;
      newCartList[findIndex].shipmentOrder = +value;
      setCartList(newCartList);
      return;
    }

    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].shipmentOrder = Number(value);
      setCartList(newCartList);

      return;
    }
  };

  const onIncrease = async (id: string) => {
    setLoading(true);
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].quantity += 5;
      setCartList(newCartList);

      await postCartItem(newCartList);
      setLoading(false);
    }
  };
  const onDecrease = async (id: string) => {
    setLoading(true);

    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      const amount = newCartList[findIndex].quantity;
      if (amount > 5) {
        newCartList[findIndex].quantity -= 5;
        setCartList(newCartList);
        await postCartItem(newCartList);
      } else {
        newCartList.splice(findIndex, 1);
        await postCartItem(newCartList);
        setCartList(newCartList);
      }
      setLoading(false);
    }
  };
  const onChangeText = async ({
    id,
    quantity,
  }: {
    quantity: string;
    id?: any;
  }) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );

    if (+quantity === 0 && findIndex !== -1) {
      setVisibleDel(true);
      setDelId(id);
    }
    if (findIndex !== -1) {
      setLoading(true);
      const newCartList = [...cartList];
      newCartList[findIndex].quantity = Number(quantity);
      setCartList(newCartList);
      await postCartItem(newCartList);
      setLoading(false);
    }
  };
  const onDelete = async (id: string | number) => {
    const newCartList = cartList?.filter(
      item => item?.productId.toString() !== id.toString(),
    );
    setLoading(true);
    await postCartItem(newCartList).finally(() => {
      setLoading(false);
    });

    setVisibleDel(false);

    setCartList(newCartList);

    setIsDelCart(true);
  };
  const [isDelCart, setIsDelCart] = React.useState(false);
  const itemsDropdown = useMemo(() => {
    return cartList.map((el, idx) => {
      return {
        label: (idx + 1).toString(),
        value: (idx + 1).toString(),
      };
    });
  }, [cartList]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <Text fontFamily="NotoSans" fontSize={18} bold>
            {t('screens.CartScreen.listProduct', {
              count: cartList.length,
            })}
            <Text fontSize={14} color="text3">
              {`   ${t('screens.CartScreen.tooltip')}`}
            </Text>
          </Text>
          {cartList.length > 0 ? (
            <View>
              {cartList.map(item => {
                return (
                  <View
                    key={item.productId}
                    style={{
                      marginTop: 16,
                    }}>
                    <View style={styles.containerItem}>
                      <View style={styles.containerLeft}>
                        {item?.productImage ? (
                          <Image
                            source={{ uri: getNewPath(item?.productImage) }}
                            style={{
                              width: 62,
                              height: 62,
                              marginRight: 10,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 62,
                              height: 62,
                              marginRight: 10,
                            }}>
                            <Image
                              style={{
                                width: 56,
                                height: 56,
                              }}
                              source={images.emptyProduct}
                            />
                          </View>
                        )}
                        <View style={styles.item}>
                          <Text
                            fontFamily="NotoSans"
                            fontSize={16}
                            bold
                            style={{
                              width: Dimensions.get('window').width - 150,
                            }}
                            numberOfLines={1}>
                            {item.productName}
                          </Text>
                          {/* <Text
                            fontFamily="NotoSans"
                            fontSize={14}
                            color="text3">
                            {item.packSize
                              ? `${item.packSize} | ฿${numberWithCommas(
                                  +item.marketPrice,
                                )}/${item.baseUOM}`
                              : `฿${numberWithCommas(+item.marketPrice)}/${
                                  item.baseUOM
                                }`}
                          </Text>
                          <Text fontSize={14} color="text2">
                            {`฿${numberWithCommas(+item.marketPrice)}/${
                              item.baseUOM
                            } x ${item.quantity} `}
                          </Text> */}
                          <Dropdown
                            style={{
                              width: 70,
                              height: 24,
                              justifyContent: 'center',
                              paddingLeft: 16,
                              marginTop: 8,
                              paddingVertical: 2,
                            }}
                            titleModal="เลือกลำดับ"
                            data={itemsDropdown}
                            value={item.shipmentOrder}
                            onChangeValue={value =>
                              onChangeOrder(value, item.productId)
                            }
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.buttonDel}
                        onPress={() => {
                          setDelId(item.productId);
                          setVisibleDel(true);
                        }}>
                        <Image
                          source={icons.bin}
                          style={{
                            width: 15,
                            height: 17,
                            marginBottom: 2,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          style={{
                            width: 62,
                            marginRight: 10,
                          }}
                        />
                        <CounterSmall
                          currentQuantity={+item.quantity}
                          onChangeText={onChangeText}
                          onIncrease={onIncrease}
                          onDecrease={onDecrease}
                          id={item.productId}
                        />
                      </View>
                      <View>
                        {isPromotion && (
                          <Text
                            fontFamily="NotoSans"
                            color="text3"
                            style={{
                              textDecorationStyle: 'solid',
                              textDecorationLine: isPromotion
                                ? 'line-through'
                                : 'none',
                            }}>
                            {`฿${numberWithCommas(
                              +item.marketPrice * item.quantity,
                            )}`}
                          </Text>
                        )}
                        {/* <Text bold fontFamily="NotoSans">
                          {`฿${numberWithCommas(
                            +item.marketPrice * item.quantity,
                          )}`}
                        </Text> */}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View
              style={{
                minHeight: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.emptyProduct}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text
                style={{
                  marginTop: 4,
                }}
                color="text3"
                fontFamily="NotoSans">
                {t('screens.CartScreen.emptyCart')}
              </Text>
            </View>
          )}
        </View>
        <ModalWarning
          visible={visibleDel}
          width={'60%'}
          title="ยืนยันการลบสินค้า"
          desc="ต้องการยืนยันการลบสินค้าใช่หรือไม่ ?"
          onConfirm={() => onDelete(delId)}
          minHeight={60}
          onRequestClose={() => setVisibleDel(false)}
        />

        {/* <PromotionSection /> */}
        <GiftFromPromotion loadingPromo={loading} />
        <ModalMessage
          visible={isDelCart}
          message={t('modalMessage.deleteCart')}
          onRequestClose={() => setIsDelCart(false)}
        />
      </KeyboardAvoidingView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonDel: {
    width: 26,
    height: 26,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {},
});
