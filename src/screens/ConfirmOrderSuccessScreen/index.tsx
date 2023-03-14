import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { Image, TouchableOpacity, View } from 'react-native';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import Button from '../../components/Button/Button';

export default function ConfirmOrderSuccessScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'ConfirmOrderSuccessScreen'>) {
  const { orderId } = route.params;
  const onNavigateDetail = () => {
    navigation.navigate('HistoryDetailScreen', {
      orderId: orderId,
    });
  };
  return (
    <Container>
      <Header
        title="ยืนยันคำสั่งซื้อ"
        componentLeft={
          <TouchableOpacity
            onPress={() => {
              onNavigateDetail();
            }}>
            <Image
              source={icons.iconCloseBlack}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        }
      />
      <Content>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.8,
          }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={images.confirmOrderImage}
              style={{
                width: 175,
                height: 175,
              }}
            />
            <Text bold fontFamily="NotoSans" color="primary" fontSize={20}>
              ยืนยันคำสั่งซื้อสำเร็จ
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.2,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Button title="ดูข้อมูลออเดอร์" onPress={onNavigateDetail} />
        </View>
      </Content>
    </Container>
  );
}
