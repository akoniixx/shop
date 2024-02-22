import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import Avatar from '../../components/Avatar/Avatar';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { phoneNumberWithHyphen } from '../../utils/phoneNumberWithHyphen';
import dayjs from 'dayjs';
import icons from '../../assets/icons';

type Props = StackScreenProps<MainStackParamList, 'UserShopDetailScreen'>;

const UserShopDetailScreen = ({ navigation, route }: Props) => {
  const userShopData = route.params;
  const activeText = userShopData?.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน';
  const updateBy = `${userShopData?.updateBy} ${dayjs(
    userShopData?.updateDate,
  ).format('DD/MM/BBBB , HH:mm น.')}`;

  return (
    <Container>
      <Header
        title="รายละเอียดผู้ใช้"
        componentRight={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditUserShopScreen', {
                userShopId: userShopData?.userShopId,
              });
            }}>
            <Image source={icons.iconUserEdit} style={styles.imageEdit} />
          </TouchableOpacity>
        }
      />

      <Content>
        <ScrollView>
          <View style={styles.imageContainer}>
            <Avatar
              editWhite
              source={
                userShopData?.profileImage
                  ? {
                      uri: userShopData?.profileImage,
                    }
                  : images.emptyAvatar
              }
            />
          </View>
          <View style={styles.row}>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              ชื่อผู้ใช้ :{' '}
              <Text
                lineHeight={36}
                fontSize={
                  16
                }>{` ${userShopData?.firstname} ${userShopData?.lastname}`}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              ชื่อเล่น :{' '}
              <Text fontSize={16}>{` ${userShopData.nickname}`}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              บทบาท : {''}
              <Text fontSize={16}>{` ${userShopData.position}`}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              เบอร์โทรศัพท์ : {''}
              <Text fontSize={16}>{` ${phoneNumberWithHyphen(
                userShopData.telephone,
              )}`}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              อีเมล : {''}
              <Text fontSize={16}>{`  ${userShopData.email}`}</Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              สถานะ : {''}
              <Text
                fontSize={16}
                color={
                  userShopData.isActive ? 'current' : 'error'
                }>{` ${activeText}`}</Text>
            </Text>
          </View>
          <View>
            <Text
              fontSize={16}
              semiBold
              fontFamily="NotoSans"
              color="text2"
              lineHeight={36}>
              อัปเดตโดย : {''}
            </Text>
            <Text fontSize={16} lineHeight={28}>{`${updateBy}`}</Text>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
};

export default UserShopDetailScreen;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  imageEdit: {
    width: 30,
    height: 30,
  },
});
