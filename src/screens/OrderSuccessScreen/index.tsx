import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Header from '../../components/Header/Header';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Content from '../../components/Content/Content';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import DashedLine from 'react-native-dashed-line';
import Button from '../../components/Button/Button';
import { orderServices } from '../../services/OrderServices';
import { OrderDetailType } from '../../entities/orderTypes';
import ImageCache from '../../components/ImageCache/ImageCache';
import { getNewPath } from '../../utils/function';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Container from '../../components/Container/Container';

const mappingStatusHeader = {
  CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อ',
};
const mappingStatus = {
  CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อจากร้านค้า',
};
export default function OrderSuccessScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'OrderSuccessScreen'>): JSX.Element {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(false);
  const [freebieList, setFreebieList] = React.useState<
    {
      productName: string;
      id: string;
      quantity: number;
      baseUnit: string;
      status: string;
      productImage: string;
      shipmentOrder: number;
    }[]
  >([]);
  const [orderData, setOrderData] = React.useState<
    OrderDetailType | undefined
  >();
  const [totalQuantities, setTotalQuantities] = useState<
    [{ unit: string; quantity: number }]
  >([
    {
      unit: '',
      quantity: 0,
    },
  ]);

  useEffect(() => {
    const getOrderByOrderId = async () => {
      try {
        setLoading(true);
        const response = await orderServices.getOrderById(orderId);
        if (response) {
          const fbList: {
            productName: string;
            id: string;
            quantity: number;
            baseUnit: string;
            status: string;
            productImage: string;
            shipmentOrder: number;
          }[] = [];
          response.orderProducts
            .filter((el: any) => el.isFreebie)
            .map((fr: any) => {
              if (fr.productFreebiesId) {
                const newObj = {
                  productName: fr.productName,
                  id: fr.productFreebiesId,
                  quantity: fr.quantity,
                  baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn,
                  status: fr.productFreebiesStatus,
                  productImage: fr.productFreebiesImage,
                  shipmentOrder: fr.shipmentOrder,
                };
                fbList.push(newObj);
              } else {
                const newObj = {
                  productName: fr.productName,
                  id: fr.productId,
                  quantity: fr.quantity,
                  baseUnit: fr.saleUOMTH || fr.saleUOM || '',
                  status: fr.productStatus,
                  productImage: fr.productImage,
                  shipmentOrder: fr.shipmentOrder,
                };

                fbList.push(newObj);
              }
            });
          setLoading(false);
          setFreebieList(fbList);
          setOrderData(response);

          const quantitiesRecord: Record<string, number> =
            response.orderProducts.reduce((acc, product) => {
              const key = product.saleUOMTH || product.baseUnitOfMeaTh;
              if (key) {
                acc[key] = (acc[key] || 0) + product.quantity;
              }
              return acc;
            }, {});

          const totalQuantities = Object.entries(quantitiesRecord).map(
            ([unit, quantity]) => ({ unit, quantity }),
          );
          setTotalQuantities(totalQuantities);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      getOrderByOrderId();
    }
  }, [orderId]);

  const listProduct = orderData?.orderProducts.map(el => {
    return {
      productName: el.productName,
      unit: el.saleUOMTH || el.saleUOM || '',
      totalPrice: el.totalPrice,
      quantity: el.quantity,
      isFreebie: el.isFreebie,
      shipmentOrder: el.shipmentOrder,
    };
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, []);
  return (
    <Container
      edges={['top', 'left', 'right']}
      style={{
        flex: 1,
      }}>
      <Header
        style={{
          backgroundColor: colors.primary,
        }}
        titleColor="white"
        componentLeft={
          <TouchableOpacity
            onPress={() => navigation.navigate('StoreDetailScreen')}>
            <Image
              source={icons.iconCloseWhite}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        }
        title={'มีคำสั่งซื้อในระบบ'}
      />
      <Content
        style={{
          backgroundColor: colors.primary,
          paddingTop: 0,
          flex: 1,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View style={styles().card}>
            {orderData && !loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 16,
                  }}>
                  <Text
                    color="primary"
                    bold
                    fontFamily="NotoSans"
                    fontSize={20}>
                    {orderData.customerName}
                  </Text>
                  <Image
                    source={images.orderSuccess}
                    style={{
                      width: 80,
                      height: 80,
                      marginTop: 16,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={{
                    marginBottom: 16,
                  }}>
                  <Text center fontFamily="NotoSans" color="text3" semiBold>
                    สั่งซื้อสินค้าสำเร็จ
                  </Text>
                </View>
                <DashedLine dashColor={colors.border1} dashGap={6} />

                <View
                  style={{
                    paddingVertical: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.invoice}
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 8,
                      }}
                    />
                    <Text bold fontFamily="NotoSans">
                      {orderData.orderNo}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 10,
                      backgroundColor: colors.background1,
                      borderColor: colors.border1,
                      borderWidth: 1,
                      marginVertical: 10,
                      borderRadius: 8,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text lineHeight={30}>รายการทั้งหมด</Text>
                      <Text lineHeight={30}>{listProduct?.length} รายการ</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <Text lineHeight={30}>จำนวนสินค้าทั้งหมด</Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        {totalQuantities?.map((el, idx) => (
                          <Text lineHeight={30} key={idx}>
                            {(el?.quantity).toFixed(2)} {el?.unit}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>

                  {orderData?.allPromotions?.length > 0 && (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                        }}>
                        <Image
                          source={icons.promoDetail}
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 8,
                          }}
                        />
                        <Text bold fontFamily="NotoSans">
                          โปรโมชัน
                        </Text>
                      </View>
                      <View
                        style={{
                          padding: 10,
                          backgroundColor: colors.background1,
                          borderColor: colors.border1,
                          borderWidth: 1,
                          marginVertical: 10,
                          borderRadius: 8,
                        }}>
                        <View style={{ marginLeft: 20 }}>
                          {orderData.allPromotions?.map((el, idx) => (
                            <Text lineHeight={30} key={idx}>
                              • {el.promotionName}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 16,
                    }}>
                    <Text fontFamily="NotoSans" semiBold color="text2">
                      สินค้า
                    </Text>
                  </View>
                  {(listProduct || [])
                    .sort((a, b) => a.shipmentOrder - b.shipmentOrder)
                    .map((el, idx) => {
                      if (el.isFreebie) {
                        return null;
                      }
                      return (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 16,
                          }}>
                          <Text color="text2" fontSize={14}>
                            {el.productName}
                          </Text>
                          <Text color="text2" fontSize={14}>
                            {`  ${el.quantity}x`} {`(${el.unit})`}
                          </Text>
                          {/* <Text fontFamily="NotoSans" color="text2" fontSize={14}>
                          {`฿${numberWithCommas(el?.totalPrice, true)}`}
                        </Text> */}
                        </View>
                      );
                    })}
                </View>
                {/* <DashedLine dashColor={colors.border1} dashGap={6} />

                <DashedLine dashColor={colors.border1} dashGap={6} /> */}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 60,
                      alignItems: 'center',
                    }}>
                    <Text fontFamily="NotoSans" bold fontSize={18}>
                      ของแถมที่ได้รับ
                    </Text>
                    <Text fontSize={14} bold color="text3" lineHeight={24}>
                      {`ทั้งหมด ${freebieList.length} รายการ`}
                    </Text>
                  </View>
                  {freebieList.length > 0 ? (
                    <>
                      {freebieList
                        .sort((a, b) => a.shipmentOrder - b.shipmentOrder)
                        .map((el, idx) => {
                          return (
                            <View
                              key={idx}
                              style={{
                                flexDirection: 'row',
                                marginBottom: 16,
                                alignItems: 'center',
                              }}>
                              {el.productImage ? (
                                <ImageCache
                                  uri={getNewPath(el.productImage)}
                                  style={{
                                    width: 56,
                                    height: 56,
                                  }}
                                />
                              ) : (
                                <Image
                                  source={images.emptyProduct}
                                  style={{
                                    width: 56,
                                    height: 56,
                                  }}
                                />
                              )}
                              <View
                                style={{
                                  marginLeft: 8,
                                }}>
                                <Text
                                  fontSize={14}
                                  color="text3"
                                  lineHeight={24}
                                  numberOfLines={1}>
                                  {el?.productName?.length > 45
                                    ? el?.productName.substring(0, 45 - 5) +
                                      '...'
                                    : el.productName}
                                </Text>
                                <Text fontSize={14}>
                                  {el.quantity} {el.baseUnit}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                    </>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={images.emptyGift}
                        style={{
                          width: 140,
                          height: 140,
                        }}
                      />
                      <Text color="text3" center fontFamily="NotoSans">
                        ไม่มีของแถมที่ได้รับ
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16,
                  }}>
                  <TouchableOpacity
                    style={{ height: 40 }}
                    onPress={() => {
                      navigation.navigate('HistoryDetailScreen', {
                        orderId: orderData.orderId,
                        isFromNotification: false,
                      });
                    }}>
                    <Text color="primary" fontSize={14} lineHeight={24}>
                      ดูรายละเอียดคำสั่งซื้อนี้
                    </Text>
                  </TouchableOpacity>
                  <Button
                    title="ดูคำสั่งซื้อทั้งหมด"
                    onPress={() => {
                      navigation.navigate('MainScreen', {
                        screen: 'history',
                      });
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                }}
              />
            )}
          </View>
          <Image
            style={{
              width: '100%',
              height: 32,
            }}
            source={images.bottomSlip}
          />
        </ScrollView>
      </Content>
    </Container>
  );
}
const styles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flex: 1,
    },
  });
};
