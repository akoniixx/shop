import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import { colors } from '../../assets/colors/colors';
import images from '../../assets/images';
import { getNewPath } from '../../utils/function';
import ImageCache from '../../components/ImageCache/ImageCache';
import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';
import DashedLine from 'react-native-dashed-line';

export default function GiftFromPromotion({
  loadingPromo,
}: {
  loadingPromo: boolean;
}): JSX.Element {
  const { t } = useLocalization();
  const { freebieListItem } = useCart();
  if (freebieListItem.length < 1) {
    return <></>;
  }
  const [totalQuantities, setTotalQuantities] = useState<[{ unit: string, quantity: number }]>([{
    unit: '',
    quantity: 0
  }])
  useEffect(() => {
    const quantitiesRecord: Record<string, number> = freebieListItem.reduce((acc, product) => {
      const key = product.baseUnit 
      if (key) {
        acc[key] = (acc[key] || 0) + product.quantity;
      }
      return acc;
    }, {});

    const totalQuantities = Object.entries(quantitiesRecord).map(([unit, quantity]) => ({ unit, quantity }));
    setTotalQuantities(totalQuantities)
  }, [freebieListItem])
  return (
    <View style={styles().container}>
      <View style={styles().header}>
        <Text fontSize={18} bold fontFamily="NotoSans">
          {t('screens.CartScreen.giftFromPromotion.title')}
        </Text>
        {loadingPromo ? (
          <View>
            <SkeletonLoading
              style={{
                width: 80,
              }}
            />
          </View>
        ) : (
          <Text color="text3" lineHeight={36}>
            {t('screens.CartScreen.giftFromPromotion.allListCount', {
              count: freebieListItem.length,
            })}
          </Text>
        )}
      </View>
      {loadingPromo ? (
        <View style={styles().skeleton}>
          <View style={styles().skeletonList}>
            <SkeletonLoading style={{ width: 56, height: 56 }} />
            <View
              style={{
                marginLeft: 8,
              }}>
              <SkeletonLoading style={{ width: 32, height: 16 }} />
              <SkeletonLoading
                style={{ width: 40, height: 16, marginTop: 4 }}
              />
            </View>
          </View>
          <View style={styles().skeletonList}>
            <SkeletonLoading style={{ width: 56, height: 56 }} />
            <View
              style={{
                marginLeft: 8,
              }}>
              <SkeletonLoading style={{ width: 32, height: 16 }} />
              <SkeletonLoading
                style={{ width: 40, height: 16, marginTop: 4 }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles().content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {freebieListItem.map((item: any, index: number) => {
              return (
                <View key={index} style={styles().list}>
                  <View
                    style={{
                      height: 56,
                      borderRadius: 8,
                      backgroundColor: colors.white,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    {item.productImage ? (
                      <ImageCache
                        uri={getNewPath(item.productImage)}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                        }}
                        source={images.emptyProduct}
                      />
                    )}
                  </View>
                  <View>
                    <Text fontSize={14} color="text3" lineHeight={24}>
                      {item.productName}
                    </Text>
                    <Text semiBold fontSize={12} lineHeight={22}>
                      {item.quantity} {item.baseUnit}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
       <View style={{ marginTop: 10 }}>
                <DashedLine
                  dashGap={0}
                  dashThickness={0.5}
                  dashColor={colors.border2}
                  style={{ marginBottom: 20 }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text fontFamily='NotoSans' color='text3' fontSize={16} bold>จำนวนรวม :    </Text>
                  <View>
                  <Text fontFamily='NotoSans' fontSize={18} bold>
                    {totalQuantities.map((i,idx) => (`${i.quantity%1===0? i.quantity : i.quantity.toFixed(2)} ${i.unit}${idx!==totalQuantities.length-1?',':''} `))}
                    </Text>
                  </View>
                </View>

              </View>
    </View>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      marginTop: 8,
      backgroundColor: 'white',
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    content: {
      flex: 1,
    },
    list: {
      width: 'auto',
      flexDirection: 'row',
      height: 72,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',

      backgroundColor: colors.background1,
      marginRight: 8,
    },
    skeleton: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 8,
    },
    skeletonList: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      width: Dimensions.get('window').width / 2 - 32,
      backgroundColor: colors.background1,
    },
  });
};
