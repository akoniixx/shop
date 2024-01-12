import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import Text from "../Text/Text";
import images from "../../assets/images";

import ImageCache from "../ImageCache/ImageCache";
import { normalize } from "../../utils/function";


interface Props {
    data: Pined[]
    navigation?: any;
    allScreen?: boolean;
    loading?: boolean;
}
export default function NewsList({
    data,
    navigation,
    loading
}: Props) {



    return (
        <View style={{ flexDirection: 'row' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.map((e, i) => (
                    i < 5 ? (<TouchableOpacity  style={{ marginRight: 5 }} key={i} onPress={() => navigation.navigate('NewsDetailScreen', {
                        newsId: e.newsId
                    })}>
                        <ImageCache uri={e.imageUrl} style={{ width: normalize(150), height: normalize(150) }} resizeMode='contain' />
                    </TouchableOpacity>) : <></>


                ))}


            </ScrollView>



        </View>
    )
}