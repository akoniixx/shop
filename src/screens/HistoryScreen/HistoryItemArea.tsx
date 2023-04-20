import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import { HistoryDataType } from '../../entities/historyTypes';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import images from '../../assets/images';
import ImageCache from '../../components/ImageCache/ImageCache';
import BadgeStatus from '../../components/BadgeStatus/BadgeStatus';
import BadgeStatusShop from '../../components/BadgeStatus/BadgeStatusShop';

interface Props extends HistoryDataType {
  navigation?: any;
}
export default function HistoryItemArea({
  orderProducts,
  paymentMethod,
  ...props
}: Props) {
  const getOnlySixLength = orderProducts
    .filter(el => !el.isFreebie)
    .slice(0, 6);
  const onPress = () => {
    const date = dayjs(props.createAt).format('DD MMM BBBB');
    props.navigation.navigate('HistoryDetailScreen', {
      orderId: props.orderId,
      headerTitle: date,
    });
  };

  const widthOneOfSix = (Dimensions.get('screen').width - 180) / 6;
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.flexRow,
          {
            justifyContent: 'space-between',
            width: '100%',
            paddingLeft: 14,
            paddingRight: 16,
          },
        ]}>
        <View style={styles.flexRow}>
          <Image
            style={{
              width: 24,
              height: 24,
              marginRight: 6,
            }}
            resizeMode="contain"
            source={icons.invoice}
          />
          <Text bold fontSize={14}>
            {props.orderNo}
          </Text>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Text color="primary" fontSize={14}>
            ดูรายละเอียด
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.flexRow,
          {
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 8,
            paddingHorizontal: 16,
          },
        ]}>
        <View style={styles.flexRow}>
          <Image
            style={{
              width: 13,
              height: 13,
              marginRight: 6,
            }}
            source={icons.package}
          />
          <Text
            color="text3"
            fontSize={12}>{`${orderProducts.length} รายการ`}</Text>
        </View>
        <Text fontSize={12} color="text3">
          {dayjs(props.createAt).format('DD MMM BBBB , HH:mm น.')}
        </Text>
      </View>
      <View style={styles.border} />
      <View
        style={[
          styles.flexRow,
          {
            paddingVertical: 16,
            width: '100%',
            justifyContent: 'flex-start',
            paddingLeft: 32,
          },
        ]}>
        {getOnlySixLength.map((item, index) => {
          const isLast: boolean = index === 5 && orderProducts.length > 6;
          return isLast ? (
            <View
              style={{
                marginRight: 16,
              }}>
              <View
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.text1,
                  opacity: 0.5,
                  zIndex: 1,
                  position: 'absolute',
                  width: widthOneOfSix,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text color="white" semiBold>{`+${
                  orderProducts.length - 6
                }`}</Text>
              </View>
              {item.productImage ? (
                <ImageCache
                  style={{ width: widthOneOfSix - 2, zIndex: -1, height: 36 }}
                  uri={item?.productImage}
                />
              ) : (
                <Image
                  source={images.emptyProduct}
                  style={{ width: widthOneOfSix, height: 40 }}
                />
              )}
            </View>
          ) : (
            <View
              key={index}
              style={{
                marginRight: 16,
              }}>
              {item.productImage ? (
                <ImageCache
                  style={{ width: widthOneOfSix, height: 40 }}
                  uri={item?.productImage}
                />
              ) : (
                <Image
                  source={images.emptyProduct}
                  style={{ width: widthOneOfSix, height: 40 }}
                />
              )}
            </View>
          );
        })}
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 8,
          marginLeft: 24,
          flexDirection: 'row',
        }}>
        {paymentMethod !== 'CREDIT' && (
          <View
            style={{
              marginRight: 8,
            }}>
            <BadgeStatusShop status={props.status} />
          </View>
        )}
        <BadgeStatus
          status={props.status}
          paidStatus={props.paidStatus}
          paymentMethod={paymentMethod}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border1,
    width: '100%',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    marginHorizontal: 16,
    marginTop: 8,
  },
});
