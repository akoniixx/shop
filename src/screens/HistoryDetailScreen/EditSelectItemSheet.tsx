import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
  useScrollHandlers,
} from 'react-native-actions-sheet';

import uuid from 'react-native-uuid';
import { useCart } from '../../contexts/CartContext';
import { useOrderLoads } from '../../contexts/OrdersLoadContext';
import { DataForOrderLoad } from '../../entities/orderLoadTypes';
import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import DashedLine from 'react-native-dashed-line';
import { colors } from '../../assets/colors/colors';
import { getNewPath } from '../../utils/function';
import images from '../../assets/images';
import CounterSmall from '../CartScreen/CounterSmall';
import Button from '../../components/Button/Button';


export const EditSelectItemsSheet = (props: SheetProps) => {
  const {
    cartOrderLoad,
  } = useCart();

  
  const type:'รถแม่'|'รถลูก' = props.payload.id
  const { dataForLoad, 
    setDataForLoad,
    currentList,
    setCurrentList,
    setHeadData,
    headData,
    dollyData,
    setDollyData
  } = useOrderLoads();
  /* const [currentList, setCurrentList] = useState<SelectDataForOrderLoad[]>([]);
 */
  

useEffect(()=>{
  const mergedProducts = dataForLoad.reduce((acc: { [key: string]: DataForOrderLoad }, processedData) => {
    const key = processedData.productId ?? 'undefined';
    if (acc[key]) {
      acc[key] = {
        ...acc[key],
        quantity: acc[key].quantity + processedData.quantity
      };
    } else {
      acc[key] = { ...processedData };
    }
    return acc;
  }, {});
  const mergedProductsArray = Object.values(mergedProducts);

  const updatedData = cartOrderLoad.map((item1) => {
    const item2 = mergedProductsArray.find((item) => item.productId === item1.productId);
    if (item2) {
      return { ...item1, quantity: item1.quantity - item2.quantity, isSelected: false, maxQuantity: item1.quantity - item2.quantity };
    }
    return {...item1, quantity: item1.quantity , isSelected: false, maxQuantity: item1.quantity}
  });
 
  setCurrentList(updatedData);
},[cartOrderLoad,dataForLoad])

 /*  useEffect(() => {
    console.log(dataForLoad)
    const initialList = cartOrderLoad.map(item => ({
      ...item,
      maxQuantity: item.quantity,
      isSelected: false
    }));
    setCurrentList(initialList);
  }, [cartOrderLoad]); */



  const onIncrease = (productId: string) => {
    setCurrentList(currentList => currentList.map(item => {
      if (item.productId === productId && item.quantity < item?.maxQuantity) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  };
 const onDecrease = (productId: string) => {
  setCurrentList(currentList => currentList.map(item => {
    if (item.productId === productId && item.quantity > 1) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  }));
};

const handleSelectItem = (productId: string) => {
  setCurrentList(currentList => currentList.map(item => {
    if (item.productId === productId) {
      return { ...item,
         isSelected: !item.isSelected,
        key:uuid.v4(),
        type:type==='รถแม่'?'head':'dolly'
        };
    }
    return item;
  }));

  

};
const onSubmit = () => {
  const selectedItems = currentList.filter(item => item.isSelected);

  if (!selectedItems.length) {
    // Handle the case where no items are selected, if necessary
    return;
  }

  // Update dataForLoad state regardless of the type
  setDataForLoad(prevDataForLoad => [...prevDataForLoad, ...selectedItems]);

  // Conditional state update based on type
  const updateState = type === 'รถแม่' ? setHeadData : setDollyData;
  updateState(prevData => [...prevData, ...selectedItems]);

  // Hide the action sheet with selected items as payload
  SheetManager.hide('selectItemsSheet', {
    payload: { data: selectedItems },
  });
};

  const onChangeText = async ({
    id,
    quantity,
  }: {
    quantity: string;
    id?: any;
  }) => {
    setCurrentList(currentList => currentList.map(item => {
      if (item.productId === id&& item.quantity < item.maxQuantity) {
        return {
          ...item,
          quantity: parseFloat(quantity),
        };
      }
      return item;
    }))
   
  };

  
  return (
    <ActionSheet  containerStyle={{
      height: '90%',
    }}>
      <ScrollView>
        <View style={{ marginTop: 20 }}>
          <View style={{ paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={icons.trailer_head}
                style={{ width: 28, height: 28, marginRight: 10 }}
              />
              <View>
                <Text semiBold fontSize={18}>เพิ่มสินค้าขึ้น{props.payload.id}</Text>
                <Text>เลือกและระบุจำนวนสินค้าอย่างน้อย 1 รายการ</Text>
              </View>
            </View>
          </View>
          <DashedLine
            dashGap={0}
            dashThickness={0.5}
            dashColor={colors.border2}
            style={{ marginVertical: 20 }}
          />
          <View style={{ paddingHorizontal: 10 }}>
            {currentList.filter(item => item.quantity > 0).map((item, idx) => {
             
              return (
                <View
                  key={idx}
                  style={{
                    marginTop: 16,
                  }}>
                  <View style={styles.containerItem}>
                    <View style={styles.containerLeft}>
                      <TouchableOpacity
                        onPress={() => handleSelectItem(item.productId)}>
                        <Image
                          source={
                            item?.isSelected ? icons.checkbox : icons.uncheckbox
                          }
                          style={{ width: 20, height: 20 }}
                        />
                      </TouchableOpacity>
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
                      <View>
                        <Text
                          fontFamily="NotoSans"
                          fontSize={16}
                          bold
                          style={{
                            width: Dimensions.get('window').width - 150,
                          }}
                          numberOfLines={1}>
                          {item?.productName}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 20 ,justifyContent:'space-between'}}>
                          <CounterSmall
                            currentQuantity={item.quantity}
                            onChangeText={onChangeText}
                            onIncrease={() => onIncrease(item.productId)}
                            onDecrease={() => onDecrease(item.productId)}
                            id={item.productId}
                            disable={!item?.isSelected}
                          />
                          {item.isSelected&&
                           <Text color={item?.maxQuantity-item?.quantity>0?'secondary':'text3'}>คงเหลือ {item?.maxQuantity-item?.quantity} {item?.saleUOMTH||item?.baseUnitOfMeaTh}</Text>
                          }
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>
        <Button
          secondary
          title="ยกเลิก"
          style={{ width: '45%' }}
          onPress={() => SheetManager.hide('selectItemsSheet')}
        />
        <Button
          title="ยืนยันการเพิ่ม"
          style={{ width: '45%' }}
          onPress={onSubmit}
          disabled={!currentList.some(item=> item.isSelected)}
        />
      </View>
    </ActionSheet>
  );
};

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
