import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import icons from '../../assets/icons';

import ImageCache from '../../components/ImageCache/ImageCache';

import { notiListServices } from '../../services/NotiListServices';
import { companyFullName, statusHistory, statusHistoryCashText } from '../../utils/mappingObj';
import { useAuth } from '../../contexts/AuthContext';
import images from '../../assets/images';
import { getNewPath } from '../../utils/function';
import { Notification } from '../../entities/notiListTypes';

interface Props {
    data: Notification
    fetchDataMore: () => Promise<void>
    navigation: any



}
export default function ItemPromoNotification({ data, fetchDataMore, navigation, ...props }: Props) {
    const {
        state: { company },
    } = useAuth();
    const isRead = data.isRead



    const onPress = async (orderId: string, notiId: string, createdAt: string) => {
        const date = dayjs(createdAt).format('DD MMM BBBB');
        await notiListServices.readNoti(notiId)
            .then(() => {
                navigation.navigate('HistoryDetailScreen', {
                    orderId: orderId,
                    headerTitle: date,
                    isFromNotification: true,
                });
            })
            .catch(err => console.log(err))

    }
    return (
        <View style={[styles.card, { backgroundColor: isRead ? 'white' : '#F8FAFF' }]}>
            <TouchableOpacity onPress={() => onPress(data.orderId, data.notificationId, data.createdAt)} >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}>
                    <View
                        style={{
                            backgroundColor: isRead ? colors.white : colors.error,
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginRight: 10,
                            marginTop: 10,
                        }}
                    />


                    <View>


                        <View >

                            <Text lineHeight={30} semiBold >
                                {data.promotionNotiSubject}

                            </Text>

                        </View>
                        <Text
                            color="text3"
                            fontSize={12}
                            lineHeight={25}
                            style={{
                                marginTop: 5,
                            }}>
                            {data.promotionNotiDetail}

                        </Text>


                        <Text lineHeight={30} color="text3" fontSize={12}>
                            {dayjs(data.createdAt).format('DD MMM BBBB , HH:mm น.')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: colors.border1,
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 32,

    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
