import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsPromotionService } from '../../services/NewsPromotionServices';
import NewsPromotionCarousel from '../../components/Carousel/NewsPromotionCarousel';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import Toast from 'react-native-toast-message';
import NewsList from '../../components/News/NewsList';
import { NewsService } from '../../services/NewsService/NewsServices';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function Body({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { company },
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(false)
  const [NewsPromotion, setNewsPromotion] = useState<NewsPromotion[]>([])
  const [newsList, setNewsList] = useState<Pined[]>([])
  const fecthNewsPromotion = async () => {
    try {
      setLoading(true)
      const company = await AsyncStorage.getItem('company')
      const zone = await AsyncStorage.getItem('zone')
      const res = await NewsPromotionService.getNewsPromotion(company || '', zone || '')
      const sortedData: NewsPromotion[] = await res.data.sort((a: NewsPromotion, b: NewsPromotion) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      setNewsPromotion(sortedData.slice(0, 5))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const fecthNewsList = async () => {
    try {
      setLoading(true)
      const company = await AsyncStorage.getItem('company')
      const res:Pined[] = await NewsService.getPined(company||'')
      const filterData:Pined [] = await res.filter((item)=>item.page==='MAIN_PAGE')
      const resNews: NewsInterface[] = await NewsService.getNewsList(company || '', 1, 99, 'NEWEST', '')

      if(res?.length==0||res==undefined){
       
        setNewsList(resNews)
      }else{
        setNewsList(filterData)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fecthNewsPromotion()
    fecthNewsList()
  }, [])
  const ListMenus = useMemo(() => {
    const staticMenus = [
      {
        title: t('menu.order'),
        image: images.iconOrder,
        name: 'Order',
        styles: {
          width: 80,
          height: 80,
        },
        textStyle: {},
        onPress: async () => {
          await AsyncStorage.setItem('pickupLocation', 'NAKHON_LUANG');
          await navigation.navigate('StoreDetailScreen')
        },
      },
      {
        title: t('menu.history'),
        image: images.iconHistory,
        name: 'History',
        styles: {
          width: 80,
          height: 80,
          marginTop: 2,
        },
        textStyle: {
          bottom: 1,
        },
        onPress: () => {
          navigation.navigate('history');
        },
      },
      {
        title: t('menu.confirmOrder'),
        image: images.iconConfirmOrder,
        name: 'ConfirmOrder',
        styles: {
          width: 70,
          height: 70,
        },
        textStyle: {
          top: 5,
        },
        onPress: () => {
          navigation.navigate('confirmOrder');
        },
      },
    ];
    if (company === 'ICPI') {
      return staticMenus.filter(el => el.name !== 'ConfirmOrder');
    } else {
      return staticMenus.filter(el => el.name !== 'Order');
    }
  }, [t, navigation, company]);


  const renderPromotion = () => (
    <>
     {NewsPromotion?.length > 0 ? <View style={{ paddingHorizontal: 20, marginTop: 20 }} >
        <Text bold fontSize={18} fontFamily='NotoSans' >โปรโมชั่น</Text>


      </View> :newsList?.length ==0 ? 
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50
          }}>
          <Image
            source={images.news}
            style={{
              height: 100,
              width: 110,
            }}
          />
          <Text color="text3">{t('screens.HomeScreen.news')}</Text>
        </View>:null
      }
      <View style={{ alignItems: 'center' }}>
        <NewsPromotionCarousel data={NewsPromotion} loading={loading} navigation={navigation} />
      </View>
    </>
  )
  const renderNews = () => (
    <View style={{ marginBottom: 40 }}>
      {newsList?.length > 0 ? <View style={{ paddingHorizontal: 20, marginTop: 20 }} >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text bold fontSize={18} fontFamily='NotoSans' >ข่าวสาร</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NewsScreen')}>
            <Text semiBold fontSize={14} color='text3' fontFamily='NotoSans' >ทั้งหมด</Text>
          </TouchableOpacity>

        </View>

      </View> :
        <View style={{ paddingHorizontal: 20, marginTop: 50 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text bold fontSize={18} fontFamily='NotoSans' >ข่าวสาร</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewsScreen')}>
              <Text semiBold fontSize={14} color='text3' fontFamily='NotoSans' >ทั้งหมด</Text>
            </TouchableOpacity>

          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={images.news}
              style={{
                height: 100,
                width: 110,
              }}
            />
            <Text color="text3">{t('screens.HomeScreen.news')}</Text>
          </View>
        </View>
      }

      <View style={{ paddingLeft: 20, marginTop: 10 }}>
        <NewsList data={newsList} loading={loading} navigation={navigation} />
      </View>
    </View>
  )
  return (
    <View style={styles.container}>
      <View style={styles.containerMenu}>
        {ListMenus.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={item.onPress}>
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={{
                    ...item.styles,
                  }}
                />

                <Text
                  center
                  fontFamily="NotoSans"
                  style={{
                    position: 'relative',
                    ...item.textStyle,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <ScrollView>
      {newsList?.length<=0&&NewsPromotion?.length<=0?  <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:'10%'
          }}>
          <Image
            source={images.news}
            style={{
              height: 100,
              width: 110,
            }}
          />
          <Text color="text3">{t('screens.HomeScreen.news')}</Text>
        </View> : <>
        {renderPromotion()}
      
     
      {renderNews()}
      </>}
     
      </ScrollView>

     
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
    bottom: 24,
    backgroundColor: 'white',
  },
  containerMenu: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
