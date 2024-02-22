import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import BadgeStatus from '../../components/BadgeStatus/BadgeStatus';
import Text from '../../components/Text/Text';
import DashedLine from 'react-native-dashed-line';
import { colors } from '../../assets/colors/colors';
import { numberWithCommas } from '../../utils/function';
import { HistoryDataType } from '../../entities/historyTypes';
import icons from '../../assets/icons';
import images from '../../assets/images';
import ImageCache from '../../components/ImageCache/ImageCache';
import dayjs from 'dayjs';
import FooterButton from './FooterButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryList from '../../components/SummaryList/SummaryList';
import SummaryTotal from '../../components/SummaryList/SummaryTotal';
import BadgeStatusShop from '../../components/BadgeStatus/BadgeStatusShop';
import FooterReorder from './FooterReorder';
import { promotionTypeMap } from '../../utils/mappingObj';
import { navigationRef } from '../../navigations/RootNavigator';

const locationMapping = {
  SHOP: 'จัดส่งที่ร้าน',
  FACTORY: 'รับที่โรงงาน',
  OTHER: 'ส่ง/รับ ที่อื่นๆ',
};
interface Props {
  orderDetail: HistoryDataType | null;
  navigation: StackNavigationProp<
    MainStackParamList,
    'HistoryDetailScreen',
    undefined
  >;
}
export default function BodyDetail({ orderDetail, navigation }: Props) {
  const noFreebies =
    orderDetail?.orderProducts.filter(el => !el.isFreebie) || [];

  const [currentCompany, setCurrentCompany] = React.useState<string>('');
  useEffect(() => {
    const getCurrentCompany = async () => {
      const company = await AsyncStorage.getItem('company');
      setCurrentCompany(company || '');
    };
    getCurrentCompany();
  }, []);
  const isICPL = useMemo(() => {
    return currentCompany === 'ICPL';
  }, [currentCompany]);
  const BlockLine = () => {
    return (
      <>
        <View style={styles.blockLine}>
          <View style={[styles.circle, styles.circleLeft]}></View>
          <DashedLine
            dashColor={colors.border2}
            dashGap={6}
            dashLength={8}
            style={{
              width: Dimensions.get('window').width - 62,
            }}
          />
          <View style={[styles.circle, styles.circleRight]}></View>
        </View>
      </>
    );
  };
  const { dataObj, freebieList, spFreebieList } = useMemo(() => {
    const listDataDiscount: {
      label: string;
      valueLabel: string;
      value: string;
    }[] = [];
    const listDataDiscountSpecialRequest: {
      label: string;
      valueLabel: string;
      value: string;
    }[] = [];
    orderDetail?.orderProducts.map((item: any) => {
      const dataPush = {
        label: item.productName,
        valueLabel: `(฿${numberWithCommas(item.marketPrice)} x ${item.quantity
          } ${item.saleUOMTH ? item.saleUOMTH : item.saleUOM || 'Unit'})`,
      };
      if (item.specialRequestDiscount > 0) {
        listDataDiscountSpecialRequest.push({
          ...dataPush,
          value: item.specialRequestDiscount,
        });
      }
      if (item.orderProductPromotions.length > 0) {
        item.orderProductPromotions.map((el: any) => {
          if (el.promotionType === 'DISCOUNT_NOT_MIX' || el.promotionType === 'DISCOUNT_MIX') {
            listDataDiscount.push({
              ...dataPush,
              value: el.conditionDetail.conditionDiscount,
            });
          }
        });
      }
    });
    const dataObj = {
      priceBeforeDiscount: {
        label: 'ราคาก่อนลด',
        value: orderDetail?.price || 0,
      },
      discountList: {
        label: 'ส่วนลดจากรายการ',
        value: orderDetail?.discount || 0,
        listData: listDataDiscount,
      },
      discountSpecialRequest: {
        label: 'ส่วนลดพิเศษ (Special Req.)',
        value: orderDetail?.specialRequestDiscount || 0,
        listData: listDataDiscountSpecialRequest,
      },
      discountCo: {
        label: 'ส่วนลดดูราคา (CO. ดูแลราคา / วงเงินเคลม)',
        value: orderDetail?.coDiscount || 0,
      },
      discountCash: {
        label: 'ส่วนลดเงินสด',
        value: orderDetail?.cashDiscount || 0,
      },
      totalDiscount: {
        label: 'ส่วนลดรวม',
        value: orderDetail?.totalDiscount || 0,
      },
      totalPriceNoVat: {
        label: 'มูลค่ารวมหลังหักส่วนลด',
        value: orderDetail?.price - orderDetail?.totalDiscount
      },
      vat: {
        label: `ภาษีมูลค่าเพิ่ม ${orderDetail?.vatPercentage} %`,
        value: orderDetail?.vat
      }
    };
    const fbList: any[] = [];
    const spfbList: any = [];
    orderDetail?.orderProducts
      .filter((el: any) => el.isFreebie)
      .map((fr: any) => {
        if (fr.isSpecialRequestFreebie === false) {
          if (fr.productFreebiesId) {
            const newObj = {
              productName: fr.productName,
              id: fr.productFreebiesId,
              quantity: fr.quantity,
              baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn,
              status: fr.productFreebiesStatus,
              productImage: fr.productFreebiesImage,
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
            };

            fbList.push(newObj);
          }
        }
        else {
          const newObj = {
            productName: fr.productName,
            id: fr.productFreebiesId,
            quantity: fr.quantity,
            baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn || fr.saleUOMTH,
            status: fr.productFreebiesStatus,
            productImage: fr.productFreebiesImage || fr.productImage,
          };
          spfbList.push(newObj)
        }

      });
    return {
      dataObj,
      freebieList: fbList,
      spFreebieList: spfbList
    };
  }, [orderDetail]);

  const { isWaitingApprove, isCancelOrder, isShowStatus } = useMemo(() => {
    const isWaitingApprove =
      orderDetail?.status === 'WAIT_CONFIRM_ORDER' ||
      orderDetail?.status === 'CONFIRM_ORDER';
    const isCancelOrder =
      orderDetail?.status === 'COMPANY_CANCEL_ORDER' ||
      orderDetail?.status === 'SHOPAPP_CANCEL_ORDER';
    const isPaid = orderDetail?.paidStatus === 'WAITING_PAID';
    const paymentMethod =
      orderDetail?.paymentMethod === 'CASH' ? 'เงินสด' : 'เครดิต';
    const isShowStatus =
      !!orderDetail &&
      orderDetail?.paymentMethod !== 'CREDIT' &&
      orderDetail.status;

    return {
      isWaitingApprove,
      isPaid,
      isCancelOrder,
      paymentMethod,
      isShowStatus: isShowStatus,
    };
  }, [orderDetail]);
  const getUniquePromotions = (orderProducts) => {
    const seenPromotions = new Set();

    // Use flatMap to flatten the promotions, and then filter based on unique values.
    return orderProducts.flatMap(el =>
      el.orderProductPromotions.filter(itm => {
        const key = `${itm.promotionType}-${itm.promotionName}`;
        if (!seenPromotions.has(key)) {
          seenPromotions.add(key);
          return true;
        }
        return false;
      })
    );
  };
  return (
    <>
      <View style={styles.contentSlip}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems:
                orderDetail?.status === 'DELIVERY_SUCCESS'
                  ? 'center'
                  : 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
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
                {orderDetail?.orderNo}
              </Text>
            </View>
            <View style={{}}>
              {isShowStatus && orderDetail?.status && (
                <View
                  style={{
                    marginBottom: 8,
                  }}>
                  <BadgeStatusShop status={orderDetail?.status} />
                </View>
              )}
              <BadgeStatus
                paymentMethod={orderDetail?.paymentMethod || ''}
                isCancelOrder={isCancelOrder}
                status={orderDetail?.status || ''}
                paidStatus={orderDetail?.paidStatus}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 24,
                marginRight: 8,
              }}
            />
            {/* <Text fontSize={14} color="text3" fontFamily="NotoSans">
              ส่งคำสั่งซื้อ
            </Text> */}
          </View>
          <DashedLine
            dashColor={colors.border1}
            dashGap={6}
            dashLength={8}
            style={{
              marginVertical: 16,
            }}
          />
          <View
            style={{
              marginTop: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              ออเดอร์ของ
            </Text>
            <Text fontSize={18} semiBold fontFamily="NotoSans">
              {orderDetail?.customerName}
            </Text>
          </View>
          <View
            style={{
              marginTop: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              เวลาที่เปิดออเดอร์
            </Text>
            <Text fontSize={18} semiBold fontFamily="NotoSans">
              {dayjs(orderDetail?.createAt).format('DD MMM BBBB , HH:mm น.')}
            </Text>
          </View>
        </View>
        <BlockLine />
        <View
          style={[
            styles.card,
            {
              paddingVertical: 16,
              paddingHorizontal: 0,
            },
          ]}>
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              การจัดส่ง
            </Text>
            <Text fontSize={18} semiBold fontFamily="NotoSans">
              {
                locationMapping[
                orderDetail?.deliveryDest as keyof typeof locationMapping
                ]
              }
            </Text>
            <Text
              style={{
                marginBottom: 8,
              }}>
              {orderDetail?.deliveryAddress || '-'}
            </Text>
          </View>
          <DashedLine
            dashColor={colors.border1}
            dashGap={6}
            dashLength={8}
            style={{
              marginVertical: 16,
              marginHorizontal: 16,
            }}
          />
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              ข้อมูลทะเบียนรถ
            </Text>
            <Text
              style={{
                marginBottom: 8,
              }}>
              {orderDetail?.numberPlate || '-'}
            </Text>
          </View>
          <DashedLine
            dashColor={colors.border1}
            dashGap={6}
            dashLength={8}
            style={{
              marginVertical: 16,
              marginHorizontal: 16,
            }}
          />
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              หมายเหตุ (ลูกค้า)
            </Text>

            <Text
              style={{
                marginBottom: 8,
              }}>
             
                {orderDetail?.deliveryRemark||'-'}
               
            </Text>
          </View>
          <DashedLine
            dashColor={colors.border1}
            dashGap={6}
            dashLength={8}
            style={{
              marginVertical: 16,
              marginHorizontal: 16,
            }}
          />
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              รายละเอียดสินค้า
            </Text>

            {noFreebies?.map((el, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: 32,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 0.6,
                    }}>
                    {el.productImage ? (
                      <ImageCache
                        uri={el.productImage}
                        style={{
                          width: 72,
                          height: 72,
                        }}
                      />
                    ) : (
                      <Image
                        source={images.emptyProduct}
                        style={{
                          width: 72,
                          height: 72,
                        }}
                      />
                    )}
                    <View
                      style={{
                        marginLeft: 16,
                      }}>
                      <Text semiBold>{el.productName}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text color="text3" fontSize={14}>
                          {`${el.packSize || '-'}`}
                          {isICPL && ' | '}
                          {isICPL &&
                            `฿${numberWithCommas(el.marketPrice, true)} `}
                        </Text>
                      </View>
                      <View style={{ marginTop: 8 }}>
                        {isICPL && el.price !== el.totalPrice ?
                          <Text
                            fontSize={12}
                            fontFamily="NotoSans"
                            color="text3"
                            style={{
                              textDecorationStyle: 'solid',
                              textDecorationLine: 'line-through',
                            }}>
                            {`฿${numberWithCommas(el.price, true)}`}
                          </Text>
                          : null}
                        {isICPL && (
                          <Text
                            color="primary"
                            fontSize={18}
                            bold
                          >
                            {`฿${numberWithCommas(el.totalPrice)}`}
                          </Text>
                        )}
                      </View>

                    </View>
                  </View>
                  <View style={{ minWidth: 100 }}>
                    <Text>
                      {numberWithCommas(el.quantity)}x
                      {`  ${el.saleUOMTH || el.saleUOM || 'Unit'}`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <DashedLine
            dashColor={colors.border1}
            dashGap={6}
            dashLength={8}
            style={{
              marginVertical: 16,
              marginHorizontal: 16,
            }}
          />

{orderDetail?.orderProducts[0].orderProductPromotions.length > 0 ? (
          <View style={{
            marginTop: 8,
            paddingHorizontal: 16,
          }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={icons.promoDetail} style={{ width: 24, height: 24, marginRight: 8 }} />
              <Text fontSize={16} lineHeight={24} bold fontFamily='NotoSans' color='text3'>รายละเอียดโปรโมชัน</Text>
            </View>

            <View style={{ borderWidth: 0.5, padding: 20, backgroundColor: '#F8FAFF', borderColor: '#EAEAEA', marginVertical: 10 }}>
              {
                getUniquePromotions(orderDetail?.orderProducts || []).map(promo => (
                  <Text fontFamily="Sarabun">
                    {`• ${promotionTypeMap(promo.promotionType)} - ${promo.promotionName}`}
                  </Text>
                ))
              }
            </View>
          </View>
        ) : null}

          {currentCompany!=='ICPI'?  <View style={{ padding: 16, backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={icons.doc} style={{ width: 24, height: 24, marginRight: 8 }} />
            <Text fontSize={16} lineHeight={24} bold fontFamily='NotoSans' color='text3'>เอกสาร </Text>
          </View>
          <TouchableOpacity style={{ borderWidth: 1, borderColor: colors.border1, padding: 15, borderRadius: 8, marginTop: 10 }}
            onPress={() => navigation.navigate('EditFileScreen', {
              orderId: orderDetail?.orderId ? orderDetail.orderId : ''
            })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text fontFamily="NotoSans">เอกสารที่เกี่ยวข้อง {orderDetail?.orderFiles?.length != 0 ? '(' + orderDetail?.orderFiles.length + ' ภาพ)' : ''}</Text>
              </View>
              <Image style={{ width: 24, height: 24 }} source={icons.iconNext} />
            </View>
          </TouchableOpacity>
        </View>: <></>}

       
{currentCompany==='ICPI'&&
 <View  style={{
  marginTop: 8,
  paddingHorizontal: 16,
}}>
<View>
<View style={{ flexDirection: 'row' }}>
  <Image source={icons.car} style={{ width: 24, height: 24, marginRight: 8 }} />
  <Text fontSize={16} lineHeight={24} bold fontFamily='NotoSans' color='text3'>ลำดับการขนสินค้า</Text>
</View>
<TouchableOpacity onPress={() => navigationRef.navigate('EditOrderLoadsScreen',orderDetail)} style={{ paddingVertical: 15, paddingHorizontal: 10, borderWidth: 0.5, borderRadius: 8, marginTop: 10, borderColor: '#E1E7F6' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
              
                <View>
                  <Text fontFamily='NotoSans' lineHeight={21} fontSize={14}>รายการการขนสินค้าขึ้นรถ</Text>
                {/*   {!currentList.every(Item => Item.quantity === 0) && dataForLoad.length > 0 &&
                    <Text fontSize={14} lineHeight={18} color='secondary'>กรุณาตรวจสอบลำดับสินค้าอีกครั้ง</Text>
                  } */}
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
               {/*  {currentList.every(Item => Item.quantity === 0) && dataForLoad.length > 0 &&
                  <Image source={icons.uploadSucsess} style={{ width: 20, height: 20, marginRight: 10 }} />
                }
                {!currentList.every(Item => Item.quantity === 0) && dataForLoad.length > 0 &&
                  <Image source={icons.warning} style={{ width: 25, height: 25, marginRight: 10 }} />
                } */}
                <Image source={icons.iconNext} style={{ width: 20, height: 20 }} />
              </View>
            </View>
          </TouchableOpacity>
</View>
</View>
}
       

          <DashedLine
            dashColor={colors.border1}
            dashGap={6}
            dashLength={8}
            style={{
              marginVertical: 16,
              marginHorizontal: 16,
            }}
          />
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              fontSize={14}
              color="text3"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              วิธีชำระเงิน
            </Text>
            <Text
              fontSize={18}
              semiBold
              fontFamily="NotoSans"
              style={{
                marginBottom: 8,
              }}>
              {orderDetail?.paymentMethod === 'CASH' ? 'เงินสด' : 'เครดิต'}
            </Text>
          </View>
          
          {isICPL && (
            <DashedLine
              dashColor={colors.border1}
              dashGap={6}
              dashLength={8}
              style={{ marginVertical: 8 }}
            />
          )}
          {isICPL && <SummaryList dataObj={dataObj} />}
        </View>
        {isICPL && <SummaryTotal orderDetail={orderDetail} />}

        <DashedLine
          dashColor={colors.border1}
          dashGap={6}
          dashLength={8}
          style={{
            marginVertical: 4,
            marginHorizontal: 16,
          }}
        />
       
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 32,
          }}>
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
              {freebieList.map((el: any, idx: number) => {
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                    {el.productImage ? (
                      <ImageCache
                        style={{
                          width: 56,
                          height: 56,
                        }}
                        uri={el.productImage}
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
                      <Text fontSize={14} color="text3" lineHeight={24}>
                        {el.productName}
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
        {spFreebieList.length > 0 ? (
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 32,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 60,
              }}>
              <View>
                <Text fontFamily="NotoSans" bold fontSize={18}>
                  ของแถมที่ได้รับ
                </Text>
                <Text fontFamily="NotoSans" bold fontSize={18}>
                  (Special Request)
                </Text>
              </View>

              <Text fontSize={14} bold color="text3" lineHeight={24}>
                {`ทั้งหมด ${spFreebieList.length} รายการ`}
              </Text>
            </View>
            {spFreebieList.map((el: any, idx: number) => {
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    alignItems: 'center',
                  }}>
                  {el.productImage ? (
                    <ImageCache
                      style={{
                        width: 56,
                        height: 56,
                      }}
                      uri={el.productImage}
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
                      style={{
                        width: Dimensions.get('window').width / 2,
                      }}>
                      {el.productName}
                    </Text>
                    <Text fontSize={14}>
                      {el.quantity} {el.baseUnit}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}


        {orderDetail?.status === 'DELIVERY_SUCCESS' || orderDetail?.status === 'SHOPAPP_CANCEL_ORDER' || orderDetail?.status === 'COMPANY_CANCEL_ORDER' ? (
          <FooterReorder orderId={orderDetail.orderId} navigation={navigation} orderLength={noFreebies.length} />
        ) : null}
      </View>
      <Image
        style={{
          width: '100%',
          height: 14,
          zIndex: 20,
          marginHorizontal: -8,
        }}
        resizeMode="contain"
        source={images.bottomInvoice}
      />
      {isWaitingApprove && (
        <FooterButton orderDetail={orderDetail} navigation={navigation} />
      )}


    </>
  );
}
const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 200,
    padding: 16,
  },
  circleLeft: {
    transform: [{ rotate: '45deg' }],
    marginLeft: -12,
  },
  circleRight: {
    transform: [{ rotate: '-135deg' }],
    marginRight: -12,
  },
  circle: {
    width: 24,
    height: 24,
    borderWidth: 2,
    backgroundColor: colors.background1,
    borderTopColor: colors.border1,
    borderRightColor: colors.border1,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRadius: 12,
    shadowColor: '#000',
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    // shadowOpacity: 0.2,
    zIndex: 999,
  },
  blockLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 42,

    paddingHorizontal: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopColor: colors.border1,
    borderTopWidth: 1,

    marginHorizontal: 16,
  },
  contentSlip: {
    ...Platform.select({
      ios: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 2,
        marginTop: 2,
        marginBottom: -5,
        zIndex: 0,
      },
      android: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 10,
          height: 4,
        },
        marginTop: 5,
        marginHorizontal: 2,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        marginBottom: -5,

        zIndex: 0,
      },
    }),
  },
});

const stylesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
      transform: [{ rotate: isCollapsed ? '0deg' : '180deg' }],
    },
  });
};
