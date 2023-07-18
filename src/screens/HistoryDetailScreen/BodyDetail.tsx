import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
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
  const { dataObj, freebieList } = useMemo(() => {
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
        valueLabel: `(฿${numberWithCommas(item.marketPrice)} x ${
          item.quantity
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
          if (el.promotionType === 'DISCOUNT_NOT_MIX') {
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
    };
    const fbList: any[] = [];
    orderDetail?.orderProducts
      .filter((el: any) => el.isFreebie)
      .map((fr: any) => {
        if (fr.productFreebiesId) {
          const newObj = {
            productName: fr.productName,
            id: fr.productFreebiesId,
            quantity: fr.quantity,
            baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn || 'Unit',
            status: fr.productFreebiesStatus,
            productImage: fr.productFreebiesImage,
          };
          fbList.push(newObj);
        } else {
          const newObj = {
            productName: fr.productName,
            id: fr.productId,
            quantity: fr.quantity,
            baseUnit: fr.saleUOMTH || fr.saleUOM || 'Unit',
            status: fr.productStatus,
            productImage: fr.productImage,
          };

          fbList.push(newObj);
        }
      });
    return {
      dataObj,
      freebieList: fbList,
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
              {(currentCompany === 'ICPI'
                ? orderDetail?.deliveryRemark
                : orderDetail?.saleCoRemark) || '-'}
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
                      {isICPL && (
                        <Text
                          color="primary"
                          fontSize={18}
                          bold
                          style={{
                            marginTop: 8,
                          }}>
                          {`฿${numberWithCommas(el.totalPrice)}`}
                        </Text>
                      )}
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