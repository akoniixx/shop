import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { UserShopTypes } from '../../entities/userShopTypes';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface Props {
  firstName: string;
  lastName: string;
  imageUrl: string;
  nickName: string;
  role: string;
  tel: string;
  email: string;
  navigation: any;
  userShopId: string;
  userShopData: UserShopTypes;
}
const CardList = ({
  email,
  firstName,
  imageUrl,
  lastName,
  nickName,
  role,
  tel,
  navigation,
  userShopData,
}: Props) => {
  const onPressSeeDetail = () => {
    navigation.navigate('UserShopDetailScreen', {
      ...userShopData,
    });
  };
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.topLeft}>
          {imageUrl ? (
            <>
              <FastImage
                source={{
                  uri: imageUrl,
                }}
                style={styles.imageAvatar}
              />
            </>
          ) : (
            <Image source={images.emptyAvatar} style={styles.imageAvatar} />
          )}

          <Text lineHeight={28} fontSize={14} semiBold fontFamily="NotoSans">
            {firstName} {lastName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onPressSeeDetail}
          style={{
            marginBottom: 8,
          }}>
          <Text color="primary" fontSize={12} lineHeight={26}>
            ดูรายละเอียด
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.rowContent}>
        <View
          style={{
            flex: 1,
          }}>
          <Text fontFamily="NotoSans" fontSize={12} semiBold>
            ชื่อเล่น : <Text fontSize={12}>{nickName}</Text>
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <Text fontFamily="NotoSans" fontSize={12} semiBold>
            บทบาท : <Text fontSize={12}>{role}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text fontFamily="NotoSans" fontSize={12} semiBold>
          เบอร์โทร : <Text fontSize={12}>{tel}</Text>
        </Text>
      </View>
      <View style={styles.rowContent}>
        <Text fontFamily="NotoSans" fontSize={12} semiBold>
          อีเมล : <Text fontSize={12}>{email || '-'}</Text>
        </Text>
      </View>
    </View>
  );
};

export default CardList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border1,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 20,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border1,
    marginVertical: 4,
  },
});
