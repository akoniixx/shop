import { View, StyleSheet } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';
import Switch from '../../components/Switch/Switch';
import Text from '../../components/Text/Text';

export default function SettingNotificationScreen() {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
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
              <Switch onValueChange={toggleSwitch} value={isEnabled} />
            </View>
          </View>
        </View>
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
