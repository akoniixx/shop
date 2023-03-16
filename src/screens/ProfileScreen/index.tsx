import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import LinearGradient from 'react-native-linear-gradient';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import Avatar from '../../components/Avatar/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import images from '../../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalWarning from '../../components/Modal/ModalWarning';
import Body from './Body';

interface Props {
  navigation?: any;
}
export default function ProfileScreen({ navigation }: Props) {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const {
    state: { user },
  } = useAuth();
  console.log('user :>> ', JSON.stringify(user, null, 2));
  const onLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('company');
    await AsyncStorage.removeItem('customerCompanyId');
    navigation.navigate('Login');
  };
  const onChangeCompany = () => {
    navigation.navigate('SelectCompanyScreen');
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
        <View style={styles.cardRadius}>
          <View>
            <View
              style={{
                width: '100%',
                position: 'relative',
                bottom: 52,
                alignItems: 'center',
              }}>
              <Avatar source={images.emptyStore} />
            </View>
            <Body navigation={navigation} />
          </View>

          <View>
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
          </View>
        </View>
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
