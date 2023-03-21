import { View, StyleSheet } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';
import Switch from '../../components/Switch/Switch';
import Text from '../../components/Text/Text';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { userServices } from '../../services/UserServices';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingNotificationScreen() {
  const [loading, setLoading] = React.useState(false);
  const {
    state: { user },
    dispatch,
  } = useAuth();
  const toggleSwitch = async () => {
    setLoading(true);
    try {
      await userServices.updateProfileNotification({
        notiStatus: !user?.notiStatus,
        userShopId: user?.userShopId || '',
      });
      if (user) {
        dispatch({
          type: 'SWITCH_NOTIFICATION',
          user: {
            ...user,
            notiStatus: !user?.notiStatus,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Header title="การแจ้งเตือน" />
      <Content
        noPadding
        style={{
          flex: 1,
          backgroundColor: colors.background1,
        }}>
        <View
          style={{
            flex: 1,
            padding: 16,
            marginTop: 16,

            backgroundColor: colors.white,
          }}>
          <View style={styles.list}>
            <Text fontFamily="NotoSans" semiBold>
              การแจ้งเตือนทั้งหมด
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginRight: 16,
                }}>
                เปิด
              </Text>
              <Switch
                onValueChange={toggleSwitch}
                value={user?.notiStatus || false}
              />
            </View>
          </View>
        </View>
        <LoadingSpinner visible={loading} />
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  list: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
});
