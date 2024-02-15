import React, { useEffect, useState } from "react"
import { MainStackParamList } from "../../../navigations/MainNavigator"
import { StackScreenProps } from "@react-navigation/stack"
import Header from "../../../components/Header/Header"
import Container from "../../../components/Container/Container"
import Content from "../../../components/Content/Content"
import { colors } from "../../../assets/colors/colors"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import Text from "../../../components/Text/Text"
import icons from "../../../assets/icons"
import DashedLine from "react-native-dashed-line"

import Button from "../../../components/Button/Button"
import ActionSheet, { SheetManager } from "react-native-actions-sheet"
import { useCart } from "../../../contexts/CartContext"
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist"
import { getNewPath } from "../../../utils/function"
import images from "../../../assets/images"

export default function OrderLoadsScreen({

}: StackScreenProps<MainStackParamList, 'OrderLoadsScreen'>): JSX.Element {
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const [head, setHead] = useState([])
  const [dolly, setDolly] = useState([])
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    /*   console.log(cartList) */
  }, [])

  const onSelectHead = async () => {
    const list = await SheetManager.show('selectItemsSheet', {
      payload: {
        id: 'รถแม่',
        data: cartList
      },
    })
    if(list){
      setHead(list.data)
    }
  }
  const onSelectDolly = async () => {
    const list = await SheetManager.show('selectItemsSheet', {
      payload: {
        id: 'รถลูก',
        data: cartList
      },

    })
    if(list){
      setDolly(list.data)
    }
  }

  const reset = () =>{
    setHead([])
    setDolly([])
  }

  const renderItem = ({ item, drag, isActive ,getIndex}: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
          isActive?styles.shadow:{}
          ]}
        >
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View>
              <View style={{ backgroundColor: colors.primary, paddingVertical:3,paddingHorizontal:9,borderTopLeftRadius:8}}>
                <Text color="white">{getIndex()+1}</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background3,borderBottomLeftRadius:8}}>
                <Image source={icons.drag} style={{ width: 6, height: 14 }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row',padding:10 }}>
              {item?.productImage ? (
                <Image source={{ uri: getNewPath(item?.productImage) }} style={{ width: 64, height: 64 }} resizeMode='contain' />
              ) : (
                <Image
                  style={{
                    width: 56,
                    height: 56,
                  }}
                  source={images.emptyProduct}
                />
              )}
             <View>
             <Text fontSize={16} lineHeight={24} ellipsizeMode='tail'  numberOfLines={1} >{item?.productName.length>45?item?.productName.substring(0,45-3) + '...' :item.productName}</Text>
             <Text fontSize={14} color='text2' >{`${item?.quantity} ${item?.saleUOMTH}`}</Text>
             </View>
             
            
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );


  };

  return (
    <Container>
      <Header title={'ลำดับการขนสินค้า'} componentRight={<TouchableOpacity onPress={reset}>
        <Text fontSize={16} fontFamily='NotoSans' color='text3' >รีเซ็ท</Text>
      </TouchableOpacity>} />
      <Content
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 10,
        }}>
        <NestableScrollContainer showsVerticalScrollIndicator={false}>

          <View>
            <Text semiBold fontFamily='NotoSans' fontSize={18}>
              รายการการขนสินค้าขึ้นรถ
            </Text>
            <Text fontFamily='NotoSans' fontSize={14} color='text3'>สินค้าที่ต้องเพิ่มขึ้นรถทั้งหมด 5 รายการ</Text>
          </View>

          <View style={{ marginVertical: 20 }}>
            <View style={styles.trailerIcon}>
              <Image source={icons.trailer_head} style={{ width: 28, height: 28, marginRight: 10 }} />
              <Text>รถแม่</Text>
            </View>
            <DashedLine dashThickness={1} dashGap={0} dashColor={colors.border1} />

          </View>


          <NestableDraggableFlatList
            data={head}
            renderItem={renderItem}
            keyExtractor={(i) => i.productId}
            onDragEnd={({ data }) => setHead(data)}
            
          />

          <TouchableOpacity style={styles.addButton} onPress={onSelectHead}>
            <Image source={icons.iconAddWhite} style={{ width: 20, height: 20 }} />
            <Text fontFamily='NotoSans' fontSize={14} color="white">เพิ่มสินค้ารถแม่</Text>
          </TouchableOpacity>

          <View style={{ marginVertical: 20 }}>
            <View style={styles.trailerIcon}>
              <Image source={icons.trailer_dolly} style={{ width: 28, height: 28, marginRight: 10 }} />
              <Text>รถลูก</Text>
            </View>
            <DashedLine dashThickness={1} dashGap={0} dashColor={colors.border1} />
           
          </View>
          <NestableDraggableFlatList

            data={dolly}
            renderItem={renderItem}
            keyExtractor={(i) => i.productId}
            onDragEnd={({ data }) => setDolly(data)}
          
          />
 <TouchableOpacity style={styles.addButton} onPress={onSelectDolly}>
              <Image source={icons.iconAddWhite} style={{ width: 20, height: 20 }} />
              <Text fontFamily='NotoSans' fontSize={14} color="white">เพิ่มสินค้ารถลูก</Text>
            </TouchableOpacity>
        </NestableScrollContainer>



      </Content>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
        <Button title="บันทึก" />
      </View>

    </Container>
  )
}


const styles = StyleSheet.create({
  trailerIcon: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 149, 255, 0.16)',
    width: 90,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border2,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomWidth: 0,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    marginVertical: 20,
    paddingVertical: 8,
    borderRadius: 8
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 8
  },
  rowItem: {
    borderWidth: 0.5,
    borderColor: colors.border2,
    borderRadius: 8,
    marginVertical: 6,
    height: 100
  },
  shadow:{
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.22,
shadowRadius: 5.22,

elevation: 3,
  }
})