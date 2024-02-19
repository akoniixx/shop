import { View, StyleSheet } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Radio from '../../components/Radio/Radio';
// import Checkbox from '../../components/Checkbox/Checkbox';
// import icons from '../../assets/icons';
import { useCart } from '../../contexts/CartContext';
import { TypeDataStepTwo } from '.';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { numberWithCommas } from '../../utils/function';
interface Props {
  setDataStepTwo: React.Dispatch<React.SetStateAction<TypeDataStepTwo>>;
  dataStepTwo: TypeDataStepTwo;
}
export default function Summary({
  setDataStepTwo,
  dataStepTwo,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const [termPayment, setTermPayment] = React.useState<string>('');

  const isCOD = termPayment === 'COD';

  const listPayment = [
    {
      title: 'เงินสด',
      value: 'CASH',
      key: 'cash',
    },
    {
      title: 'เครดิต',
      value: 'CREDIT',
      key: 'credit',
    },
  ].slice(0, isCOD ? 1 : 2);
  useFocusEffect(
    React.useCallback(() => {
      const getTerm = async () => {
        const termPayment = await AsyncStorage.getItem('termPayment');
        if (termPayment) {
          setTermPayment(termPayment);
          setDataStepTwo({
            ...dataStepTwo,
            paymentMethod: termPayment.toUpperCase().startsWith('N')
              ? 'CREDIT'
              : 'CASH',
          });
        }
      };
      getTerm();
    }, []),
  );
  const { cartList } = useCart();
  // const totalPrice = cartList.reduce(
  //   (a, b) => a + b.quantity * +b.marketPrice,
  //   0,
  // );
  // const renderDiscountList = () => {
  //   const mockData = [
  //     {
  //       productName: 'โบร์แลน',
  //       discountPrice: 15000,
  //       unit: 5,
  //       unitType: 'ลัง',
  //     },
  //   ];
  //   return mockData?.map((el, idx) => {
  //     return (
  //       <View
  //         style={[
  //           styles.row,
  //           { backgroundColor: colors.background1, minHeight: 40 },
  //         ]}
  //         key={idx}>
  //         <Text fontSize={14} color="text3">
  //           {el.productName}
  //           {` ฿${numberWithCommas(el.discountPrice)} x ${el.unit} ${
  //             el.unitType
  //           }`}
  //         </Text>
  //         <Text fontSize={14} color="text3">
  //           {`-฿${numberWithCommas(el.discountPrice * el.unit)}`}
  //         </Text>
  //       </View>
  //     );
  //   });
  // };

  // const renderSpecialRequest = () => {
  //   const mockData = [
  //     {
  //       productName: 'ไฮซีส',
  //       discountPrice: 100,
  //       unit: 10,
  //       unitType: 'ลัง',
  //     },
  //   ];
  //   return mockData?.map((el, idx) => {
  //     return (
  //       <View
  //         style={[
  //           styles.row,
  //           { backgroundColor: colors.background1, minHeight: 40 },
  //         ]}
  //         key={idx}>
  //         <Text fontSize={14} color="text3">
  //           {el.productName}
  //           {` ฿${numberWithCommas(el.discountPrice)} x ${el.unit} ${
  //             el.unitType
  //           }`}
  //         </Text>
  //         <Text fontSize={14} color="text3">
  //           {`-฿${numberWithCommas(el.discountPrice * el.unit)}`}
  //         </Text>
  //       </View>
  //     );
  //   });
  // };
  return (
    <View style={styles.container}>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 0,
          margin: -2,
          // marginBottom: 0,
          // borderStyle: 'dashed',
          // borderColor: '#D1D2DE',
          paddingBottom: 8,
          paddingHorizontal: 16,
        }}>
        <View>
          <View
            style={{
              padding: 16,

              borderBottomColor: colors.border1,
              borderBottomWidth: 1,
            }}>
            <Text fontFamily="NotoSans" bold fontSize={18}>
              {t('screens.CartScreen.summary.titlePayment')}
            </Text>
          </View>
          <View
            style={{
              padding: 16,
            }}>
              <Text fontFamily='Sarabun'>{dataStepTwo?.paymentMethod === 'CREDIT'?'เครดิต':'เงินสด'}{dataStepTwo?.paymentMethod}</Text>
            {/* <Radio
              value={dataStepTwo.paymentMethod}
              onChange={value => {
                setDataStepTwo(prev => ({
                  ...prev,
                  paymentMethod: value,
                }));
              }}
              radioLists={listPayment}
            /> */}
          </View>
          {/* <View
            style={{
              padding: 16,
              paddingBottom: 0,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text fontFamily="NotoSans" bold fontSize={18}>
                {t('screens.CartScreen.summary.titlePromotion')}
              </Text>
              <Text color="text3" fontSize={14}>
                {t('screens.CartScreen.summary.remainingMoney', {
                  remainingMoney: numberWithCommas(2000 * 200),
                })}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <Checkbox
                onPress={v => {
                  const haveValue = valueCheckbox.includes(v);
                  if (haveValue) {
                    setValueCheckbox(valueCheckbox.filter(item => item !== v));
                  } else {
                    setValueCheckbox([...valueCheckbox, v]);
                  }
                }}
                valueCheckbox={valueCheckbox}
                listCheckbox={[
                  {
                    title: 'ใช้ส่วนลด',
                    value: 'discount',
                    key: 'discount',
                  },
                ]}
              />
            </View>
          </View> */}
        </View>
      </View>
      {/* <View style={styles.containerBottom}>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.priceBeforeDiscount')}
          </Text>
          <Text color="text2" semiBold>{`฿${numberWithCommas(
            totalPrice,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setIsCollapsed({
                ...isCollapsed,
                discountList: !isCollapsed.discountList,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text color="text2">
              {t('screens.CartScreen.summary.discountFromList')}
            </Text>
            <Image
              source={icons.iconCollapse}
              style={stylesIcon({ isCollapsed: isCollapsed.discountList }).icon}
            />
          </TouchableOpacity>

          <Text
            color="current"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(0, true)}`}</Text>
        </View>
        {!isCollapsed.discountList && <>{renderDiscountList()}</>}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setIsCollapsed({
                ...isCollapsed,
                specialListDiscount: !isCollapsed.specialListDiscount,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text color="text2">
              {t('screens.CartScreen.summary.discountSpecial')}
            </Text>
            <Image
              source={icons.iconCollapse}
              style={
                stylesIcon({ isCollapsed: isCollapsed.specialListDiscount })
                  .icon
              }
            />
          </TouchableOpacity>
          <Text
            color="specialRequest"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(0, true)}`}</Text>
        </View>
        {!isCollapsed.specialListDiscount && <>{renderSpecialRequest()}</>}

        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCarePrice')}
          </Text>
          <Text
            color="error"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(0, true)}`}</Text>
        </View>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCash')}
          </Text>
          <Text
            color="waiting"
            fontFamily="NotoSans"
            semiBold>{`-฿${numberWithCommas(0, true)}`}</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              marginBottom: 4,
            },
          ]}>
          <Text color="text2">
            {t('screens.CartScreen.summary.totalDiscount')}
          </Text>
          <Text color="text2" semiBold fontFamily="NotoSans">
            {`-฿${numberWithCommas(0, true)}`}
          </Text>
        </View>
      </View>
      <View style={styles.summary}>
        <Text color="text2" semiBold fontFamily="NotoSans">
          {t('screens.CartScreen.summary.totalPrice')}
        </Text>
        <Text
          fontFamily="NotoSans"
          color="primary"
          bold
          fontSize={20}>{`฿${numberWithCommas(totalPrice, true)}`}</Text>
      </View> */}
    </View>
  );
}
// const stylesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
//   return StyleSheet.create({
//     icon: {
//       width: 20,
//       height: 20,
//       transform: [{ rotate: isCollapsed ? '0deg' : '180deg' }],
//     },
//   });
// };
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: 10,
  },
  containerBottom: {
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopColor: colors.border1,
    borderTopWidth: 1,
  },
});
