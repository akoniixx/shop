import React, { useEffect, useState } from "react"
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import ActionSheet, { SheetManager, SheetProps, useScrollHandlers } from "react-native-actions-sheet"
import Text from "../../Text/Text"
import { NativeViewGestureHandler } from "react-native-gesture-handler"
import Button from "../../Button/Button"
import icons from "../../../assets/icons"
import DashedLine from "react-native-dashed-line"
import { colors } from "../../../assets/colors/colors"
import images from "../../../assets/images"
import { getNewPath } from "../../../utils/function"
import CounterSmall from "../../../screens/CartScreen/CounterSmall"
import { DataForOrderLoad } from "../../../entities/orderLoadTypes"
import { useOrderLoads } from "../../../contexts/OrdersLoadContext"
import { useCart } from "../../../contexts/CartContext"

export const SelectItemsSheet = (props: SheetProps) => {
  const cartList = props.payload.data?props.payload.data:[]
  const setData = props.payload.setData


  const [unselectData,setUnselectData] = useState<DataForOrderLoad[]>([])
  const [selectedItems, setSelectedItems] = useState<DataForOrderLoad[]>([]);


  
   const {
   
    setCartList,
    cartApi: { postCartItem },
    cartOrderLoad
  } = useCart();
   const {
    dataForLoad,
    setDataForLoad
  } = useOrderLoads()
   


    
    const onIncrease = (productId: string) => {
   
  };


      const onDecrease = async (id: string) => {
        
      };     
      
      
      
      
      
      const onChangeText = async ({
        id,
        quantity,
      }: {
        quantity: string;
        id?: any;
      }) => {
       
      };

      const handleSelectItem = (item) => {
        const index = selectedItems.findIndex(selectedItem => selectedItem.productId === item.productId);
        if (index > -1) {
          // Item is already selected, remove it from the array
          setSelectedItems(selectedItems.filter(selectedItem => selectedItem.productId !== item.productId));
        } else {
          // Item is not selected, add it to the array
          setSelectedItems([...selectedItems, item]);
        }
      
        // Use functional update for cartList state
        setData((currentCartList) => currentCartList.filter(cartItem => cartItem.productId !== item.productId));
      };
      
      
   
    return (
        <ActionSheet >
            <ScrollView >
                <View style={{ marginTop: 20 }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={icons.trailer_head} style={{ width: 28, height: 28, marginRight: 10 }} />
                            <View>
                                <Text>เพิ่มสินค้าขึ้น{props.payload.id}</Text>
                                <Text>เลือกและระบุจำนวนสินค้าอย่างน้อย 1 รายการ</Text>
                            </View>
                        </View>
                    </View>
                    <DashedLine dashGap={0} dashThickness={0.5} dashColor={colors.border2} style={{ marginVertical: 20 }} />
                    <View style={{paddingHorizontal:10}}>
              {cartList.map((item,idx) => {
                 const isSelected = selectedItems.some(selectedItem => selectedItem.productId === item.productId);
                return (
                  <View
                    key={idx}
                    style={{
                      marginTop: 16,
                    }}>
                    <View style={styles.containerItem}>
                      <View style={styles.containerLeft}>
                        <View>
                            <TouchableOpacity onPress={()=>handleSelectItem(item)}>
                              <Image source={isSelected?icons.checkbox:icons.uncheckbox} style={{width:20,height:20}} />
                               
                            </TouchableOpacity>
                        </View>
                        {item?.productImage ? (
                          <Image
                            source={{ uri: getNewPath(item?.productImage) }}
                            style={{
                              width: 62,
                              height: 62,
                              marginRight: 10,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 62,
                              height: 62,
                              marginRight: 10,
                            }}>
                            <Image
                              style={{
                                width: 56,
                                height: 56,
                              }}
                              source={images.emptyProduct}
                            />
                          </View>
                        )}
                        <View  >
                          <Text
                            fontFamily="NotoSans"
                            fontSize={16}
                            bold
                            style={{
                              width: Dimensions.get('window').width - 150,
                            }}
                            numberOfLines={1}>
                            {item.productName}
                          </Text>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginTop: 20 }}>
                              <CounterSmall
                                currentQuantity={item.quantity}
                                onChangeText={onChangeText}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                                id={item.productId}
                              />
                            </View>

                          </View>
                         
                        </View>

                      </View>

                     
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>

                      
                    </View>
                  </View>
                );
              })}
            </View>
                </View>
            </ScrollView>
            <View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>

                    <Button secondary title="ยกเลิก" style={{ width: '45%' }} onPress={()=>SheetManager.hide('selectItemsSheet',{
                    })} />
                    <Button title="ยืนยันการเพิ่ม" style={{ width: '45%' }} onPress={()=>SheetManager.hide('selectItemsSheet',{
                        payload:{
                            data:selectedItems
                        }
                    })}  />
                </View>
            </View>
        </ActionSheet>
    )
}

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: 'white',
    },
    containerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    containerLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    buttonDel: {
      width: 26,
      height: 26,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});