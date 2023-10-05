import { StyleSheet, TouchableOpacity, View } from "react-native";
import Button from "../../components/Button/Button";
import { CartItemType, cartServices } from "../../services/CartServices";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../navigations/MainNavigator";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ModalWarning from "../../components/Modal/ModalWarning";
import Text from "../../components/Text/Text";


interface Props {
    orderId: string;
    navigation: StackNavigationProp<
        MainStackParamList
    >;
}

export default function FooterReorder({ orderId, navigation }: Props) {
    const [loading,setLoading] = useState<boolean>(false)
    const [modalConfirm, setModalConfirm] = useState<boolean>(false);

    const {
        cartList,
        setCartList,
        setFreebieListItem,
        cartApi: { getCartList },
    } = useCart();
    const {
        state: { user, company }
    } = useAuth();
    const onReoder = async () => {
        try {
            setLoading(true)
            const payload = {
                company: 'ICPI',
                userShopId: user?.userShopId || '',
                orderId: orderId
            }

            const res: CartItemType = await cartServices.porsReorder(payload)
            const response = await cartServices.postCart(res)
            if(response){
                setModalConfirm(false)
                navigation.navigate('CartScreen')  
            }

        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return (
        <>
        <View style={styles.container}>
            <TouchableOpacity
            style={{justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            width: '100%',
            borderRadius:8,
            borderColor:'#4C95FF',
            borderWidth:1,
        }}
                
                onPress={() => {
                    setModalConfirm(true);
                }}
            >
                <Text bold color="primary">สั่งซื้ออีกครั้ง</Text>
                </TouchableOpacity>
        </View>
        <ModalWarning
            title="สินค้าที่คุณเลือกไว้ในตะกร้าจะถูกล้างทั้งหมด"
            titleCenter={true}
            visible={modalConfirm}
            width={'70%'}
            minHeight={50}
            desc="ต้องการยืนยันคำสั่งซื้อใช่หรือไม่?"
            onConfirm={() => {
                onReoder()
            }}
            onRequestClose={() => {
              setModalConfirm(false);
            }}
          />
        <LoadingSpinner visible={loading} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal:20
    },
});