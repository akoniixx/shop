import { View, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import Container from '../../components/Container/Container';
import LinearGradient from 'react-native-linear-gradient';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import Avatar from '../../components/Avatar/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalWarning from '../../components/Modal/ModalWarning';
import Body from './Body';

import { userServices } from '../../services/UserServices';
import Text from '../../components/Text/Text';
import VersionCheck from 'react-native-version-check';

interface Props {
  navigation?: any;
}
export default function ProfileScreen({ navigation }: Props) {
  const [version, setVersion] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const {
    state: { user },
    dispatch,
  } = useAuth();

  useEffect(() => {
    const getCurrentVersion = async () => {
      const currentVersion = await VersionCheck.getCurrentVersion();
      setVersion(currentVersion);
    };
    getCurrentVersion();
  }, []);

  const onLogout = async () => {
    setModalVisible(false);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('company');
    await AsyncStorage.removeItem('customerCompanyId');
    await AsyncStorage.removeItem('userShopId');
    navigation.navigate('initPage');
  };
  const onChangeCompany = () => {
    navigation.navigate('SelectCompanyScreen');
  };
  const onEditProfile = async (value: any) => {
    try {
      const { uri, type, fileName } = value;

      const isIOS = Platform.OS === 'ios';
      const localFilePath = isIOS ? uri : uri.replace('file://', '');

      const data = new FormData();
      data.append('file', {
        uri: localFilePath,
        type,
        name: fileName,
      });
      data.append('userShopId', user?.userShopId);

      const res = await userServices.postUserProfile(data);
      if (res && res.success && user) {
        dispatch({
          type: 'SET_PROFILE_IMG',
          user: { ...user, profileImage: uri },
        });
      }
    } catch (e) {
      console.log('e :>> ', e);
    }
  };
  return (
    <Container edges={['right', 'left']}>
      <LinearGradient
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
        colors={['#0064FB', 'rgba(76, 149, 255, 0) 27.84%)']}
        style={{
          height: 160,
          position: 'absolute',
          width: '100%',
        }}
      />
      <Content noPadding>
      <ScrollView style={{flex:1}} contentContainerStyle={{ flexGrow: 1}}>
        <View style={styles.cardRadius}>
        

          <View>
            <View
              style={{
                width: '100%',
                position: 'relative',
                bottom: 52,
                alignItems: 'center',
              }}>
              <Avatar
                source={
                  user?.profileImage
                    ? { uri: user?.profileImage }
                    : icons.noStoreImage
                }
                onPressEdit={onEditProfile}
              />
            </View>
            <Body navigation={navigation} />
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <Button
              onPress={onChangeCompany}
              title="เปลี่ยนบริษัท"
              style={{
                marginBottom: 8,
              }}
            />
            <Button
              onPress={() => setModalVisible(true)}
              iconFont={
                <Image
                  source={icons.iconLogout}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              }
              title="ออกจากระบบ"
              secondary
            />
            <Text
              fontSize={14}
              color="text3"
              style={{
                marginTop: 8,
              }}>
              เวอร์ชั่น {version}
            </Text>
          </View>
          

        </View>
        </ScrollView>
      </Content>
      <ModalWarning
        title="ต้องการออกจากระบบ"
        width={200}
        minHeight={50}
        visible={modalVisible}
        onConfirm={onLogout}
        onRequestClose={() => setModalVisible(false)}
      />
    </Container>
  );
}
const styles = StyleSheet.create({
  cardRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: colors.white,
    marginTop: '24%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
});
