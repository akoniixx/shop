import { View, Text, Platform, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../assets/colors/colors';
import { useLocalization } from '../../contexts/LocalizationContext';
import icons from '../../assets/icons';

const Tab = createBottomTabNavigator();
export default function MainTabBottomNavigator() {
  const { t } = useLocalization();
  const ListTabs = [
    {
      name: 'home',
      title: t('tabs.HomeTab.title'),
      iconActive: icons.MenuHomeActive,
      iconInactive: icons.MenuHomeInActive,
      component: View,
    },
    {
      name: 'history',
      title: t('tabs.HistoryTab.title'),
      iconActive: icons.MenuHistoryActive,
      iconInactive: icons.MenuHistoryInActive,
      component: View,
    },
    {
      name: 'confirmOrder',
      title: t('tabs.ConfirmOrderTab.title'),
      iconActive: icons.MenuConfirmOrderActive,
      iconInactive: icons.MenuConfirmOrderInActive,
      component: View,
    },
    {
      name: 'notification',
      title: t('tabs.NotificationTab.title'),
      iconActive: icons.MenuNotificationActive,
      iconInactive: icons.MenuNotificationInActive,
      component: View,
    },
    {
      name: 'profile',
      title: t('tabs.ProfileTab.title'),
      iconActive: icons.MenuProfileActive,
      iconInactive: icons.MenuProfileInActive,
      component: View,
    },
  ];

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {ListTabs.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{
              tabBarLabelStyle: {
                fontFamily: 'Sarabun-Medium',
              },
              tabBarStyle: {
                minHeight: Platform.OS === 'ios' ? 95 : 80,
                alignItems: 'center',
                justifyContent: 'center',
              },
              tabBarButton(props) {
                const isFocused = props.accessibilityState?.selected;

                return (
                  <TouchableOpacity
                    {...props}
                    style={[
                      props.style,
                      {
                        paddingVertical: 8,
                        paddingHorizontal: item.name === 'confirmOrder' ? 2 : 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={isFocused ? item.iconActive : item.iconInactive}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                      />

                      <Text
                        style={{
                          fontFamily: 'Sarabun-Medium',
                          fontSize: 10,
                          color: isFocused ? colors.primary : colors.text3,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}
