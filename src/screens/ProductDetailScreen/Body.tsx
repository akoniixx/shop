import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import PromotionItem from './PromotionItem';
import images from '../../assets/images';
import { getNewPath, numberWithCommas } from '../../utils/function';
import { PromotionType } from '../../entities/productEntities';

type Props = {
  packSize?: string;
  productImage?: string;
  productName?: string;
  marketPrice?: string;
  saleUOM?: string;
  commonName?: string;
  description?: string | null;
  promotion?: PromotionType[];
  productId?: string;
  saleUOMTH?: string | null;
};
export default function Body({
  saleUOM,
  packSize,
  productImage,
  productName,
  marketPrice = '0',
  commonName,
  description,
  productId,
  promotion,
  saleUOMTH,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const [isShowMore, setIsShowMore] = React.useState(false);
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: colors.white,
          paddingVertical: 8,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {productImage ? (
            <Image
              source={{ uri: getNewPath(productImage) }}
              style={{
                width: '100%',
                height: 220,
              }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                height: 220,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={images.emptyProduct} />
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <Text fontFamily="NotoSans" bold fontSize={20}>
            {productName}
          </Text>
          {/* {marketPrice && (
            <Text
              fontFamily="NotoSans"
              bold
              fontSize={18}
              color="primary"
              style={{
                marginTop: 8,
              }}>
              {`฿${numberWithCommas(+marketPrice)}`}
            </Text>
          )} */}
          <Text
            fontFamily="NotoSans"
            color="text3"
            fontSize={16}
            style={{
              marginTop: 8,
            }}>
            {packSize
              ? `${packSize} | ฿${numberWithCommas(+marketPrice)}/${saleUOM}`
              : `฿${numberWithCommas(+marketPrice)}/${saleUOM}`}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 16,
          backgroundColor: colors.white,
        }}>
        <View
          style={{
            borderBottomColor: colors.background2,
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              padding: 16,
            }}>
            <Text fontFamily="NotoSans" bold fontSize={18}>
              {t('screens.ProductDetailScreen.detail')}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 16,
          }}>
          <Text semiBold>{t('screens.ProductDetailScreen.important')}</Text>
          <Text semiBold numberOfLines={1} color="text3">
            {commonName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              alignItems: 'center',
            }}>
            <Text semiBold>
              {t('screens.ProductDetailScreen.featuresAndBenefits')}
            </Text>
            {description && description.length > 100 && (
              <TouchableOpacity
                onPress={() => {
                  setIsShowMore(!isShowMore);
                }}>
                <Text fontSize={14} color="text3">
                  {isShowMore
                    ? t('screens.ProductDetailScreen.seeLess')
                    : t('screens.ProductDetailScreen.seeMore')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            color="text3"
            style={{ width: '80%' }}
            numberOfLines={isShowMore ? undefined : 2}>
            {description}
          </Text>
          {isShowMore && (
            <View
              style={{
                height: 20,
                marginTop: 16,
              }}
            />
          )}
        </View>
      </View>
      {promotion && promotion.length > 0 && (
        <View
          style={{
            backgroundColor: colors.white,
            padding: 16,
            marginTop: 16,
          }}>
          {promotion.map((item, index) => {
            return (
              <PromotionItem
                key={index}
                {...item}
                index={index}
                promotionLength={promotion.length}
                productName={productName}
                currentProductId={productId}
                unitBuy={saleUOMTH}
                promotionType={item.promotionType}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
