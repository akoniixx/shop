import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { navigationRef } from '../../navigations/RootNavigator';
import { DataForOrderLoad } from '../../entities/orderLoadTypes';
import { useOrderLoads } from '../../contexts/OrdersLoadContext';
import DashedLine from 'react-native-dashed-line';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ListItemInCart() {
  const { t } = useLocalization();
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem, getCartList },
    cartOrderLoad,
  } = useCart();
  const {
    currentList,
    dataForLoad,
    setCurrentList,
    headData,
    setHeadData,
    dollyData,
    setDollyData,
    setDataForLoad,
    dataReadyLoad,
    setDataReadyLoad,
  } = useOrderLoads();
  const isPromotion = false;
  const [visibleDel, setVisibleDel] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [delId, setDelId] = React.useState<string | number>('');
  const [decreaseId, setDecreaseId] = React.useState<string | number>('');
  const [isDelCart, setIsDelCart] = React.useState(false);
  const [modalWarningDelete, setModalWarningDelete] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [totalQuantities, setTotalQuantities] = useState<
    [{ unit: string; quantity: number }]
  >([
    {
      unit: '',
      quantity: 0,
    },
  ]);

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

  useEffect(() => {
    const mergedProducts = dataForLoad.reduce(
      (acc: { [key: string]: DataForOrderLoad }, item) => {
        const key =
          item.productId || `freebie_${item.productFreebiesId}` || 'undefined';
        if (acc[key]) {
          acc[key].quantity += item.quantity;
          if (item.isFreebie) {
            acc[key].freebieQuantity =
              (acc[key].freebieQuantity || 0) + item.quantity;
          }
        } else {
          acc[key] = { ...item };
          acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
        }
        return acc;
      },
      {},
    );

    const mergedProductsArray = Object.values(mergedProducts);

    const updatedData = cartOrderLoad.map(item1 => {
      const item2 = mergedProductsArray.find(item => {
        if (item.productFreebiesId) {
          return item.productFreebiesId === item1.productFreebiesId;
        } else {
          return item.productId === item1.productId;
        }
      });
      if (item2) {
        return {
          ...item1,
          quantity: item1.quantity - item2.quantity,
          isSelected: false,
          maxQuantity: item1.quantity,
          freebieQuantity: item2.freebieQuantity - item1.freebieQuantity,
          amount: item1.quantity - item1.freebieQuantity,
          amountFreebie: item1.freebieQuantity,
        };
      }
      return {
        ...item1,
        quantity: item1.quantity,
        isSelected: false,
        maxQuantity: item1.quantity,
        freebieQuantity: item1.freebieQuantity,
        amount: item1.quantity - item1.freebieQuantity,
        amountFreebie: item1.freebieQuantity,
      };
    });
    setCurrentList(updatedData);
  }, [cartOrderLoad, dataForLoad]);

  useEffect(() => {
    const quantitiesRecord: Record<string, number> = cartList.reduce(
      (acc, product) => {
        const key = product.saleUOMTH || product.baseUnitOfMeaTh;
        if (key) {
          acc[key] = (acc[key] || 0) + product.quantity;
        }
        return acc;
      },
      {},
    );

    const totalQuantities = Object.entries(quantitiesRecord).map(
      ([unit, quantity]) => ({ unit, quantity }),
    );
    setTotalQuantities(totalQuantities);
  }, [cartList]);

  const onIncrease = async (id: string) => {
    setLoading(true);
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].quantity += 1;
      setCartList(newCartList);
      const newDataReadyLoad = [...dataReadyLoad];
      await postCartItem(newCartList, newDataReadyLoad);
      setLoading(false);
    }
  };

  const onDecrease = async (id: string) => {
    if (dataForLoad.length > 0) {
      setDecreaseId(id);
      setModalWarningDelete(true);
    } else {
      setLoading(true);

      const findIndex = cartList?.findIndex(
        item => item?.productId.toString() === id.toString(),
      );
      if (findIndex !== -1) {
        const newCartList = [...cartList];
        const amount = newCartList[findIndex].quantity;
        if (amount > 1) {
          newCartList[findIndex].quantity -= 1;
          setCartList(newCartList);
          /*   setDataReadyLoad([])
          setHeadData([])
          setDollyData([])
          setDataForLoad([]) */
          const newDataReadyLoad = [...dataReadyLoad];
          await postCartItem(newCartList, newDataReadyLoad);
        } else {
          newCartList.splice(findIndex, 1);
          /*  setDataReadyLoad([])
          setHeadData([])
          setDollyData([])
          setDataForLoad([]) */
          const newDataReadyLoad = [...dataReadyLoad];
          await postCartItem(newCartList, newDataReadyLoad);
          setCartList(newCartList);
        }
        setLoading(false);
      }
    }
  };

  const onConfirmDecrease = async () => {
    setModalWarningDelete(false);
    setLoading(true);

    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === decreaseId.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      const amount = newCartList[findIndex].quantity;
      if (amount > 1) {
        newCartList[findIndex].quantity -= 1;
        setCartList(newCartList);
        /*  setDataReadyLoad([])
        setHeadData([])
        setDollyData([])
        setDataForLoad([]) */
        const newDataReadyLoad = [...dataReadyLoad];
        await postCartItem(newCartList, newDataReadyLoad);
      } else {
        newCartList.splice(findIndex, 1);
        setHeadData([]);
        setDollyData([]);
        setDataForLoad([]);
        setDataReadyLoad([]);

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
      const newDataReadyLoad = [...dataReadyLoad];
      const newCartList = [...cartList];
      newCartList[findIndex].quantity = Number(quantity);
      setCartList(newCartList);
      await postCartItem(newCartList, newDataReadyLoad);
      setLoading(false);
    }
  };

  const reArrangeShipment = (dataList: any[]) => {
    return dataList.map((item, index) => {
      return {
        ...item,
        shipmentOrder: index + 1,
      };
    });
  };

  const onDelete = async (id: string) => {
    setDelId(id);
    if (dataForLoad.length > 0) {
      setModalDelete(true);
    } else {
      setVisibleDel(true);
    }
  };

  const onConfirmDelete = async () => {
    const newCartList = cartList?.filter(
      item => item?.productId.toString() !== delId.toString(),
    );
    setHeadData([]);
    setDollyData([]);
    setDataForLoad([]);
    setDataReadyLoad([]);

    setLoading(true);
    await postCartItem(newCartList).finally(() => {
      setLoading(false);
    });

    setVisibleDel(false);
    setModalDelete(false);
    setCartList(newCartList);

    setIsDelCart(true);
  };

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
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text fontFamily="NotoSans" fontSize={18} bold>
            {t('screens.CartScreen.listProduct', {
              count: cartList.length,
            })}
            {/* <Text fontSize={14} color="text3">
              {`   ${t('screens.CartScreen.tooltip')}`}
            </Text> */}
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
                        <View>
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
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginTop: 20 }}>
                              <CounterSmall
                                currentQuantity={+item.quantity}
                                onChangeText={onChangeText}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                                id={item.productId}
                                productData={{
                                  ...item,
                                  productId: item.productId,
                                }}
                              />
                            </View>
                          </View>
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
                          {/*  <Dropdown
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
                          /> */}
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.buttonDel}
                        onPress={() => {
                          onDelete(item.productId);
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

              <View style={{ marginTop: 10 }}>
                <DashedLine
                  dashGap={0}
                  dashThickness={0.5}
                  dashColor={colors.border2}
                  style={{ marginBottom: 20 }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text fontFamily="NotoSans" color="text3" fontSize={16} bold>
                    จำนวนรวม :{' '}
                  </Text>
                  <View>
                    {totalQuantities.map((i, k) => (
                      <Text fontFamily="NotoSans" fontSize={18} bold key={k}>
                        {i.quantity % 1 === 0
                          ? i.quantity
                          : i.quantity.toFixed(2)}{' '}
                        {i.unit}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
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
          onConfirm={onConfirmDelete}
          minHeight={60}
          onRequestClose={() => setVisibleDel(false)}
        />

        {/* <PromotionSection /> */}
        <LoadingSpinner visible={loading} />

        <View
          style={{
            marginTop: 8,
            backgroundColor: 'white',
            padding: 16,
          }}>
          <Text fontSize={18} bold fontFamily="NotoSans">
            ลำดับการจัดเรียงสินค้า
          </Text>
          <TouchableOpacity
            onPress={() => navigationRef.navigate('OrderLoadsScreen')}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
              borderWidth: 0.5,
              borderRadius: 8,
              marginTop: 10,
              borderColor: '#E1E7F6',
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={icons.car}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <View>
                  <Text fontFamily="NotoSans" lineHeight={21} fontSize={14}>
                    รายการจัดเรียงสินค้าขึ้นรถ
                  </Text>
                  {!currentList.every(Item => Item.quantity === 0) &&
                    dataForLoad.length > 0 && (
                      <Text fontSize={14} lineHeight={18} color="secondary">
                        กรุณาตรวจสอบลำดับสินค้าอีกครั้ง
                      </Text>
                    )}
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {currentList.every(Item => Item.quantity === 0) &&
                  dataForLoad.length > 0 && (
                    <Image
                      source={icons.uploadSucsess}
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    />
                  )}
                {!currentList.every(Item => Item.quantity === 0) &&
                  dataForLoad.length > 0 && (
                    <Image
                      source={icons.warning}
                      style={{ width: 25, height: 25, marginRight: 10 }}
                    />
                  )}
                <Image
                  source={icons.iconNext}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <GiftFromPromotion loadingPromo={loading} />
        <ModalMessage
          visible={isDelCart}
          message={t('modalMessage.deleteCart')}
          onRequestClose={() => setIsDelCart(false)}
        />
        <ModalWarning
          visible={modalWarningDelete}
          width={'70%'}
          title="ยืนยันการลดจำนวนสินค้าในตะกร้า"
          desc={`การลดสินค้าในตะกร้า ส่งผลต่อลำดับ\nการขนสินค้าขึ้นรถที่กำหนดไว้\nหากกดยืนยันการลดสินค้า`}
          ColorDesc="error"
          onConfirm={onConfirmDecrease}
          onRequestClose={() => setModalWarningDelete(false)}
        />

        <ModalWarning
          visible={modalDelete}
          width={'70%'}
          title="ยืนยันการลบสินค้า"
          titleCenter
          desc={`การลดจำนวนสินค้าในตะกร้า ส่งผลต่อ\nลำดับการจัดเรียงสินค้าขึ้นรถที่กำหนดไว้\nระบบจะรีเซ็ตค่าลำดับจัดเรียงทั้งหมดออก\nหากกดยืนยันการลดจำนวนสินค้า`}
          ColorDesc="error"
          onConfirm={onConfirmDelete}
          onRequestClose={() => setModalDelete(false)}
        />
      </KeyboardAwareScrollView>
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
});
