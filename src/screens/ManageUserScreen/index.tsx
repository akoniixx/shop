import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import Content from '../../components/Content/Content';
import CardList from './CardList';
import { phoneNumberWithHyphen } from '../../utils/phoneNumberWithHyphen';
import { useInfiniteQuery } from 'react-query';
import { userServices } from '../../services/UserServices';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

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
const take = 10;
export default function ManageUserScreen({ navigation }: { navigation: any }) {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const initialMount = useRef(true);

  const {
    state: { user },
  } = useAuth();

  const onPressAddUser = () => {
    navigation.navigate('AddUserScreen');
  };

  const getUserList = async ({
    page,
    take,
    currentTab,
    customerId,
  }: {
    page: number;
    take: number;
    currentTab: number;
    customerId: string;
  }) => {
    try {
      return await userServices.getUserList({
        customerId,
        page,
        take,
        isActive: currentTab === 0,
      });
    } catch (error) {
      console.log('error :>> ', error);
    }
  };
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch: refetchUserList,
  } = useInfiniteQuery(
    ['get-users-list', page, currentTab],
    async () => {
      return await getUserList({
        page,
        take,
        currentTab,
        customerId: user?.customerToUserShops[0].customerId || '',
      }).then(res => res.responseData);
    },
    {
      getNextPageParam: (
        lastPage: {
          count: number;
          data: any[];
        },
        pages,
      ) => {
        if (lastPage.count > pages.length * take) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  );
  const userList = useMemo(() => {
    if (data?.pages) {
      const flatData = data.pages.flatMap(item => item.data);
      const count = data.pages[0].count;

      return {
        count: count,
        data: flatData,
      };
    }
    return {
      count: 0,
      data: [],
    };
  }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      const onFocus = () => {
        if (initialMount.current) {
          refetchUserList();
          initialMount.current = false;
        }
      };

      onFocus();

      return () => {
        initialMount.current = true;
      };
    }, [refetchUserList]),
  );
  if (isError) {
    return (
      <Container>
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
          <HeaderFlatList
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </Content>
      </Container>
    );
  }
  return (
    <Container edges={['left', 'right', 'top']}>
      <Header
        textStyle={{
          marginLeft: 42,
        }}
        onBack={() => {
          setPage(1);
          navigation.goBack();
        }}
        title="จัดการผู้ใช้"
        componentRight={
          <Button
            onPress={onPressAddUser}
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
        <HeaderFlatList
          currentTab={currentTab}
          setCurrentTab={index => {
            setCurrentTab(index);
            setPage(1);
          }}
        />
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 4,
          }}>
          <Text
            style={
              styles.allMemberText
            }>{`ทั้งหมด ${userList?.count} รายชื่อ`}</Text>
        </View>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  refetchUserList();
                }}
              />
            }
            data={userList.data}
            scrollIndicatorInsets={{ right: 1 }}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              width: '100%',
              paddingHorizontal: 16,
            }}
            onEndReached={() => {
              if (!isFetchingNextPage && hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={<View style={{ height: 32 }} />}
            renderItem={({ item }) => {
              return (
                <CardList
                  imageUrl={item.userShop.profileImage}
                  nickName={item.userShop.nickname}
                  firstName={item.userShop.firstname}
                  lastName={item.userShop.lastname}
                  tel={phoneNumberWithHyphen(item.userShop.telephone)}
                  email={item.userShop.email}
                  role={item.userShop.position}
                  navigation={navigation}
                  userShopId={item.userShop.userShopId}
                  userShopData={item.userShop}
                />
              );
            }}
          />
        )}
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
