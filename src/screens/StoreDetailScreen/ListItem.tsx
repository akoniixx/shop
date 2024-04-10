import {
  View,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import ModalMessage from '../../components/Modal/ModalMessage';
import { useLocalization } from '../../contexts/LocalizationContext';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { useAuth } from '../../contexts/AuthContext';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import { productService } from '../../services/ProductService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductCategory, ProductType } from '../../entities/productEntities';
import { useFocusEffect } from '@react-navigation/native';
import Item from './Item';
interface Props {
  navigation: StackNavigationProp<
    MainStackParamList,
    'StoreDetailScreen',
    undefined
  >;
  debounceSearchValue?: any;
  setLoadingApi: (value: boolean) => void;
}

export default function ListItem({
  navigation,
  debounceSearchValue,
  setLoadingApi,
}: Props) {
  const { t } = useLocalization();
  const [isDelCart, setIsDelCart] = React.useState<boolean>(false);
  const [isAddCart, setIsAddCart] = React.useState<boolean>(false);
  const [dataBrand, setDataBrand] = React.useState<ProductCategory[]>([]);
  const [currentBrand, setCurrentBrand] = React.useState<string>('all');
  const [type, setType] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<{
    count: number;
    data: ProductType[];
    count_location: [];
  }>({
    count: 0,
    data: [],
    count_location: [],
  });
  const {
    state: { user },
  } = useAuth();
  const listCompany =
    user?.customerToUserShops?.[0]?.customer?.customerCompany || [];
  // const customerId = user?.customerToUserShops?.[0].customerId;
  const customerName = listCompany.find(el => el.isActive);
  const getAllProduct = useCallback(async () => {
    try {
      setLoadingApi(true);
      const company = await AsyncStorage.getItem('company');
      const pickupLocation = await AsyncStorage.getItem('pickupLocation');

      const result = await productService.getAllProducts({
        company: company || '',
        page: 1,
        productLocation: pickupLocation || '',
        take: 10,
        searchText: debounceSearchValue,

        isPromotion: type !== 'all',
        productCategoryId: currentBrand !== 'all' ? currentBrand : undefined,
      });
      setLoadingApi(false);
      setData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  }, [debounceSearchValue, type, currentBrand, setLoadingApi]);

  const getMoreProduct = useCallback(async () => {
    try {
      if (data.count > data.data.length) {
        const company = await AsyncStorage.getItem('company');
        const pickupLocation = await AsyncStorage.getItem('pickupLocation');

        const result = await productService.getAllProducts({
          company: company || '',
          // customerId,
          page: page + 1,
          productLocation: pickupLocation || '',
          take: 10,
          searchText: debounceSearchValue,
          // productBrandId: findCompany
          //   ? findCompany?.product_brand_id
          //   : customerName?.productBrand?.[0]?.product_brand_id,
          isPromotion: type !== 'all',
          productCategoryId: currentBrand !== 'all' ? currentBrand : undefined,
        });
        setData(prev => ({
          ...prev,
          data: [...prev.data, ...result.data],
        }));
        setPage(prev => prev + 1);
      } else {
        console.log('no more');
      }
    } catch (e) {
      console.log(e);
    }
  }, [debounceSearchValue, type, page, data.data, data.count, currentBrand]);
  const getProductCategory = useCallback(async () => {
    try {
      const company = await AsyncStorage.getItem('company');
      const res = await productService.getProductCategory(company || '');
      setDataBrand(res);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getProductCategory();
    getAllProduct();
  }, [debounceSearchValue, type, currentBrand]);

  const newDataBrand = useMemo(() => {
    return [
      {
        productCategoryId: 'all',
        company: '',
        productCategoryImage: null,
        productCategoryName: 'all',
      },
      ...dataBrand,
    ];
  }, [dataBrand]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headerList = [
    {
      id: 'all',
      title: t('screens.StoreDetailScreen.allItems'),
    },
    {
      id: 'promotion',
      title: t('screens.StoreDetailScreen.promotion'),
    },
  ];

  const HeaderFlatList = useCallback(() => {
    return (
      <View
        style={{
          paddingBottom: 16,
        }}>
        <ImageBackground
          source={images.BGStoreDetailScreen}
          style={{
            width: '100%',
            height: 160,
            marginTop: 8,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              paddingTop: 24,
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              fontFamily="NotoSans"
              fontSize={18}
              color="white"
              bold
              numberOfLines={1}>
              {customerName?.customerName}
            </Text>
            <View
              style={{
                backgroundColor: colors.border1,
                borderRadius: 31,
              }}>
              <Image
                source={icons.noStoreImage}
                style={{
                  width: 62,
                  height: 62,
                }}
              />
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: colors.background3,
                height: 46,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: colors.background3,
              }}>
              {headerList.map(item => {
                return (
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderRadius: 6,
                      backgroundColor:
                        type === item.id ? 'white' : 'transparent',
                    }}
                    key={item.id}
                    onPress={() => {
                      setType(item.id);
                    }}>
                    <Text fontFamily="NotoSans" semiBold>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ImageBackground>
        <View
          style={{
            padding: 16,
          }}>
          <Text fontFamily="NotoSans" bold fontSize={18}>
            {t(
              type === 'all'
                ? 'screens.StoreDetailScreen.allItems'
                : 'screens.StoreDetailScreen.promotionAll',
            )}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}>
          {dataBrand.length < 1 ? (
            <></>
          ) : (
            (newDataBrand || []).map((item, idx) => {
              const isLast = idx === newDataBrand.length - 1;
              if (!item.productCategoryImage) {
                return (
                  <TouchableOpacity
                    key={item.productCategoryId}
                    style={[
                      styles({
                        isFocus: item.productCategoryId === currentBrand,
                      }).buttonBrand,
                      {
                        marginRight: isLast ? 32 : 8,
                      },
                    ]}
                    onPress={() => {
                      setCurrentBrand(item.productCategoryId);
                    }}>
                    <Text fontFamily="NotoSans" fontSize={14} semiBold>
                      {t('screens.StoreDetailScreen.allCategory')}
                    </Text>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={item.productCategoryId}
                  style={[
                    {
                      marginRight: isLast ? 32 : 8,
                    },
                  ]}
                  onPress={() => {
                    setCurrentBrand(item.productCategoryId);
                  }}>
                  <Image
                    source={{ uri: item.productCategoryImage }}
                    style={{
                      width: 106,
                      height: 40,
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        currentBrand === item.productCategoryId
                          ? colors.text2
                          : colors.border1,
                    }}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    );
  }, [
    currentBrand,
    dataBrand,
    newDataBrand,
    type,
    headerList,
    t,
    customerName?.customerName,
  ]);
  const HeaderMemorize = useMemo(() => {
    return <HeaderFlatList />;
  }, [HeaderFlatList]);
  return (
    <>
      <FlatList
        data={data?.data || []}
        numColumns={2}
        initialNumToRender={10}
        onEndReachedThreshold={0.7}
        onEndReached={() => {
          getMoreProduct();
        }}
        ListFooterComponent={() => {
          return (
            <View
              style={{
                height: 50,
              }}
            />
          );
        }}
        keyExtractor={(item, idx) => idx.toString()}
        columnWrapperStyle={{
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 300,
              }}>
              <Image
                source={images.emptyProduct}
                style={{
                  width: 90,
                  height: 90,
                }}
              />
              <Text
                color="text3"
                fontFamily="NotoSans"
                style={{
                  marginTop: 16,
                }}>
                {t('screens.StoreDetailScreen.empty')}
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={HeaderMemorize}
        renderItem={({ item, index }) => {
          return (
            <Item
              key={index}
              {...item}
              navigation={navigation}
              setIsAddCart={setIsAddCart}
              setIsDelCart={setIsDelCart}
            />
          );
        }}
      />
      <ModalMessage
        visible={isAddCart}
        message={t('modalMessage.addCart')}
        onRequestClose={() => setIsAddCart(false)}
      />
      <ModalMessage
        visible={isDelCart}
        message={t('modalMessage.deleteCart')}
        onRequestClose={() => setIsDelCart(false)}
      />
    </>
  );
}
const styles = ({ isFocus }: { isFocus: boolean }) =>
  StyleSheet.create({
    buttonBrand: {
      paddingVertical: 8,
      width: 88,
      height: 40,
      marginRight: 8,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: isFocus ? colors.background1 : 'transparent',
      borderColor: isFocus ? colors.text2 : colors.border1,
    },
  });
