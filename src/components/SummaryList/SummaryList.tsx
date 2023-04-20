import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { numberWithCommas } from '../../utils/function';
interface DataObj {
  priceBeforeDiscount: {
    label: string;
    value: number | string;
  };
  discountList: {
    label: string;
    value: number | string;

    listData: {
      label: string;
      valueLabel: string;
      value: string;
    }[];
  };
  discountSpecialRequest: {
    label: string;
    value: number | string;

    listData: {
      label: string;
      valueLabel: string;
      value: string;
    }[];
  };
  discountCo: {
    label: string;
    value: number | string;
  };
  discountCash: {
    label: string;
    value: number | string;
  };
  totalDiscount: {
    label: string;
    value: number | string;
  };
}

interface Props {
  dataObj: DataObj;
}
export default function SummaryList({ dataObj }: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState({
    discountList: true,
    specialListDiscount: true,
  });
  const renderDiscountList = () => {
    return dataObj.discountList.listData?.map((el, idx) => {
      return (
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.background2,
              minHeight: 52,
              paddingHorizontal: 16,
              marginHorizontal: 8,
              borderRadius: 8,
            },
          ]}
          key={idx}>
          <Text fontSize={14} color="text3">
            {el.label + ' ' + el.valueLabel}
          </Text>
          <Text fontSize={14} color="text3">
            {`-฿${numberWithCommas(el.value)}`}
          </Text>
        </View>
      );
    });
  };

  const renderSpecialRequest = () => {
    return dataObj.discountSpecialRequest.listData?.map((el, idx) => {
      return (
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.background1,
              minHeight: 52,
              paddingHorizontal: 16,
              marginHorizontal: 8,
              borderRadius: 8,
            },
          ]}
          key={idx}>
          <Text fontSize={14} color="text3">
            {el.label + ' ' + el.valueLabel}
          </Text>
          <Text fontSize={14} color="text3">
            {`-฿${numberWithCommas(el.value)}`}
          </Text>
        </View>
      );
    });
  };
  return (
    <View>
      <View style={[styles.row]}>
        <Text color="text2" semiBold>
          ราคาก่อนลด
        </Text>
        <Text color="text2">{`฿${numberWithCommas(
          +dataObj.priceBeforeDiscount.value,
          true,
        )}`}</Text>
      </View>

      <View
        style={{
          paddingTop: 8,
          paddingHorizontal: 16,
        }}>
        <Text
          color="text2"
          semiBold
          style={{
            marginBottom: 8,
          }}>
          รายละเอียดส่วนลด
        </Text>
        <View style={styles.bg}>
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
              <Text color="text2">ส่วนลดจากรายการ</Text>
              <Image
                source={icons.iconCollapse}
                style={
                  stylesIcon({ isCollapsed: isCollapsed.discountList }).icon
                }
              />
            </TouchableOpacity>

            <Text
              color="current"
              semiBold
              fontFamily="NotoSans">{`-฿${numberWithCommas(
              +dataObj.discountList.value,
              true,
            )}`}</Text>
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
              <Text color="text2">ขอส่วนลดพิเศษเพิ่ม</Text>
              <Image
                source={icons.iconCollapse}
                style={
                  stylesIcon({
                    isCollapsed: isCollapsed.specialListDiscount,
                  }).icon
                }
              />
            </TouchableOpacity>
            <Text
              color="specialRequest"
              semiBold
              fontFamily="NotoSans">{`-฿${numberWithCommas(
              +dataObj.discountSpecialRequest.value,
              true,
            )}`}</Text>
          </View>
          {!isCollapsed.specialListDiscount && <>{renderSpecialRequest()}</>}

          <View style={styles.row}>
            <Text color="text2">ส่วนลดดูแลราคา</Text>
            <Text
              color="error"
              semiBold
              fontFamily="NotoSans">{`-฿${numberWithCommas(
              +dataObj.discountCo.value,
              true,
            )}`}</Text>
          </View>
          <View style={styles.row}>
            <Text color="text2">ส่วนลดเงินสด</Text>
            <Text
              color="waiting"
              fontFamily="NotoSans"
              semiBold>{`-฿${numberWithCommas(
              +dataObj.discountCash.value,
              true,
            )}`}</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.row,
          {
            marginBottom: 4,
          },
        ]}>
        <Text color="text2" semiBold>
          รวมส่วนลดสุทธิ
        </Text>
        <Text color="text2" semiBold fontFamily="NotoSans" fontSize={20}>
          {`-฿${numberWithCommas(+dataObj.totalDiscount.value, true)}`}
        </Text>
      </View>
    </View>
  );
}
const stylesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
      transform: [{ rotate: isCollapsed ? '0deg' : '180deg' }],
    },
  });
};
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
    marginBottom: 0,
    alignItems: 'center',
    minHeight: 44,

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
  bg: {
    backgroundColor: colors.background1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border1,
    padding: 4,
  },
});
