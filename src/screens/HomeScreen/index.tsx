import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import Body from './Body';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import icons from '../../assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsPromotionService } from '../../services/NewsPromotionServices';
import HightlightPopup from '../../components/Popup/HightlightPopup';
const mappingCompany = {
  ICPL: 'ICP Ladda Co., Ltd.',
  ICPF: 'ICP Fertilizer Co., Ltd.',
  ICPI: 'ICP International Co., Ltd.',
};

export default function HomeScreen({ navigation }: any): JSX.Element {
  const {
    state,
    authContext: { getUser },
  } = useAuth();
  const company = state?.company;

  const [loading, setLoading] = useState<boolean>(false);
  const [highlight,setHighLight] = useState<HighlightNews[]>([])
  const [modalVisible,setModalVisible] = useState<boolean>(true)

  const fetchHitglight = async() => {
    try {
      setLoading(true)
      const company = await AsyncStorage.getItem('company')
      const res = await NewsPromotionService.getHighlight(company||'')
       setHighLight(res.data)
     
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  
  }
  
  useEffect(()=>{
    fetchHitglight()
  },[])
  

  useEffect(() => {
    if (state?.user === null || !state?.user) {
      getUser();
    }
  }, [state?.user, getUser]);

  const name = state.user?.firstname || '';

  return (
    <Container>
      <Content style={{ padding: 0, flex: 1, width: '100%' }}>
        <ImageBackground
          source={images.HomeScreenBG}
          style={{
            minHeight: 160,
            width: '100%',
            justifyContent: 'center',
          }}>
          <View
            style={{
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <View>
              <Text color="white" fontSize={24} fontFamily="NotoSans" bold>
                {`สวัสดี, ${name}`}
              </Text>
              <Text color="white" fontSize={14} fontFamily="NotoSans">
                {
                  mappingCompany[
                    (company || 'ICPL') as keyof typeof mappingCompany
                  ]
                }
              </Text>
            </View>
            <View style={styles.circle}>
              {state.user?.profileImage ? (
                <Image
                  source={{
                    uri: state.user?.profileImage,
                  }}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 62 / 2,
                  }}
                />
              ) : (
                <Image
                  source={icons.noStoreImage}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 62 / 2,
                  }}
                />
              )}
            </View>
          </View>
        </ImageBackground>
        <Body navigation={navigation} />
      </Content>
      {highlight[0]?.status==='true'&& 
      <HightlightPopup visible={modalVisible} imgUrl={highlight[0]?.imageUrl||''} onRequestClose={()=>setModalVisible(false)} url={highlight[0]?.url} highlightNewsId={highlight[0]?.highlightNewsId} />}
      <LoadingSpinner visible={state?.user === null} />
    </Container>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 62,
    height: 62,
    borderRadius: 62 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
