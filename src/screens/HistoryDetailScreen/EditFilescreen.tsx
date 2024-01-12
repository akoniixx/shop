import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, TouchableOpacity, View, Modal as ModalRN, StyleSheet, ImageBackground, ActivityIndicator, } from "react-native";
import { MainStackParamList } from "../../navigations/MainNavigator";
import Container from "../../components/Container/Container";
import Header from "../../components/Header/Header";
import Text from "../../components/Text/Text";
import icons from "../../assets/icons";
import { colors } from "../../assets/colors/colors";
import DashedLine from "react-native-dashed-line";
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment'
import { orderServices } from "../../services/OrderServices";
import { HistoryDataType } from "../../entities/historyTypes";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

interface file {
    base64?: string;
    uri?: string;
    width?: number;
    height?: number;
    originalPath?: string;
    fileSize?: number;
    type?: string;
    fileName?: string;
    duration?: number;
    bitrate?: number;
    timestamp?: string;
    id?: string;
    orderFileId?: string
}

export default function EditFileScreen({
    route,
    navigation,
}: StackScreenProps<MainStackParamList, 'EditFileScreen'>) {
    const [file, setFile] = useState<file[] | undefined>([]);
    const [url, setUrl] = useState()
    const [toggleModle, setToggleModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
   
  
    const params = route.params
    

    const viewImage = (url: any) => {
        setUrl(url)
        setToggleModal(true)
    }
   

   

   
    const getImageUris = async () => {
        try {
            setLoading(true)
            const res: HistoryDataType = await orderServices.getOrderById(params.orderId);
           
            let data: file[] = res.orderFiles.map((e, idx) => ({

                uri: e.filePath,
                fileName: `${idx}-${moment().unix()}`,
                id: e.orderFileId,
                orderFileId: e.orderFileId

            }))

            setFile(data)
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    };

   

    useEffect(() => {
        getImageUris()
    }, [])

    const renderViewImg = () => (<ModalRN
        animationType="fade"
        onRequestClose={() => setToggleModal(false)}
        visible={toggleModle}
        transparent>
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setToggleModal(false)}>
                <Image source={icons.iconCloseBlack} style={{ width: 24, height: 24, marginRight: 20 }} />
            </TouchableOpacity>
            <View style={[styles.modalView]}>
                <ImageBackground source={{ uri: url }} style={{ width: '100%', height: '100%' }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)}>
                    <ActivityIndicator animating={loading} size={'large'} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }} />
                </ImageBackground>
            </View>
        </View>
    </ModalRN>)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            {renderViewImg()}
            <Header title="เพิ่มเอกสาร" />
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Text bold color='text3' >{`เอกสารทั้งหมด ${file?.length?file?.length:0} ภาพ`}</Text>
                <DashedLine
                    dashColor={colors.border2}
                    dashGap={0}
                    dashLength={1}
                    style={{
                        marginTop: 20
                    }}
                    dashThickness={1}
                />

                {
                    file?.length != undefined && file?.length > 0 ?
                        <View style={{  flex: 1 }}>
                        
                            <View style={{ marginTop: 20, flex: 1 }}>
                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }} >
                                    {file != undefined && file?.map((item, idx) => (
                                        <View style={{ marginTop: 10 }} key={idx}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                <View style={{ flexDirection: 'row', maxWidth: '60%', alignItems: 'center' }}>
                                                    <Image source={{ uri: item.uri }} style={{ width: 40, height: 40, marginRight: 20 }} />
                                                    <Text numberOfLines={1} ellipsizeMode='tail'>{item.fileName}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>

                                                    <TouchableOpacity onPress={() => viewImage(item.uri)}>
                                                        <Image source={icons.viewDoc} style={{ width: 25, height: 25, marginRight: 20 }} />
                                                    </TouchableOpacity>
                                                    

                                                </View>
                                            </View>
                                            <DashedLine
                                                dashColor={colors.border2}
                                                dashGap={0}
                                                dashLength={1}
                                                style={{
                                                    marginTop: 20
                                                }}
                                                dashThickness={1}
                                            />
                                        </View>
                                    ))}
                                   
                                </ScrollView>
                            </View>
                        </View> : null
                }

            </View>



            {/* <LoadingSpinner visible={loading} /> */}
        </SafeAreaView>

    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalView: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        height: '60%',

        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    close: {
        width: 24,
        height: 24,
    },
});