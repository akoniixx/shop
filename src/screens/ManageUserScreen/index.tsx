import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import Content from '../../components/Content/Content';

const TAB_LIST = [
  {
    label: 'เปิดใช้งาน',
    value: 'active',
  },
  {
    label: 'ปิดใช้งาน',
    value: 'inActive',
  },
];
const mockData = [1, 2, 3, 4, 5];
export default function ManageUserScreen() {
  const [currentTab, setCurrentTab] = React.useState(0);

  return (
    <Container edges={['left', 'right', 'top']}>
      <Header
        textStyle={{
          marginLeft: 42,
        }}
        title="จัดการผู้ใช้"
        componentRight={
          <Button
            title="เพิ่มผู้ใช้"
            style={{
              width: 'auto',
              paddingHorizontal: 16,
              height: 'auto',
              paddingVertical: 8,
            }}
          />
        }
      />
      <Content
        noPadding
        style={{
          backgroundColor: colors.background2,
        }}>
        <HeaderFlatList currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <Text
            style={
              styles.allMemberText
            }>{`ทั้งหมด ${mockData.length} รายชื่อ`}</Text>
        </View>
        <FlatList
          data={mockData}
          scrollIndicatorInsets={{ right: 1 }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            flex: 1,
            width: '100%',
            paddingHorizontal: 16,
          }}
          renderItem={({ item, index }) => {
            return (
              <>
                <View style={styles.card}>
                  <Text>test {index}</Text>
                </View>
              </>
            );
          }}
        />
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  tabStyles: {
    backgroundColor: colors.white,
  },
  allMemberText: {
    fontSize: 14,
    color: colors.text3,
    marginTop: 8,
    lineHeight: 24,
  },
  itemList: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 24,
    width: '100%',
  },
});

const HeaderFlatList = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    // Trigger the animation whenever the currentTab changes
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to opacity: 1 (opaque)
      duration: 500, // 500ms duration
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // Reset the animation value to 0 after it ends for the next animation cycle
      fadeAnim.setValue(0);
    });
  }, [currentTab, fadeAnim]); // Only re-run the effect if currentTab changes

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.white,
        height: 'auto',
      }}>
      {TAB_LIST.map((tab, index) => {
        return (
          <TouchableOpacity
            key={index}
            disabled={currentTab === index}
            onPress={() => setCurrentTab(index)}
            style={[
              styles.tabStyles,
              {
                backgroundColor:
                  currentTab === index ? colors.background2 : colors.white,
                paddingVertical: 8,
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 70,
              },
            ]}>
            <Text
              key={index}
              semiBold
              fontSize={16}
              fontFamily="NotoSans"
              color={currentTab === index ? 'primary' : 'text1'}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
