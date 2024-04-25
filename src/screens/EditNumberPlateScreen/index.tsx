import {
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import InputText from '../../components/InputText/InputText';
import Text from '../../components/Text/Text';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';

type Props = StackScreenProps<MainStackParamList, 'EditNumberPlateScreen'>;

interface InputDataType {
  numberPlate: string;
  orderId: string;
  deliveryRemark: string;
}
const NUMBER_PLATE_LENGTH = 50;
const REMARK_LENGTH = 150;
export default function EditNumberPlateScreen({ navigation, route }: Props) {
  const {
    state: { user },
  } = useAuth();
  const [inputData, setInputData] = React.useState<InputDataType>({
    numberPlate: '',
    orderId: '',
    deliveryRemark: '',
  });
  const [showWarning, setShowWarning] = React.useState<boolean>(false);
  useEffect(() => {
    if (route.params) {
      setInputData({
        numberPlate:
          route.params.numberPlate === '-' ? '' : route.params.numberPlate,
        orderId: route.params.orderId,
        deliveryRemark: route.params.deliveryRemark || '',
      });
    }
  }, [route.params]);

  const onSubmitEdit = async () => {
    try {
      const result = await orderServices.postUpdatePlateNumber({
        numberPlate: inputData.numberPlate,
        orderId: inputData.orderId,
        remark: inputData.deliveryRemark,
        updateBy: `${user?.firstname} ${user?.lastname}`,
      });
      if (result) {
        setShowWarning(false);
        setTimeout(() => {
          navigation.goBack();
        }, 800);
      }
    } catch {
      console.log('onSubmitEdit error');
    }
  };

  const buttonList = [
    {
      title: 'บันทึก และออก',
      color: 'primary',
      onPress: onSubmitEdit,
    },
    {
      title: 'ไม่บันทึก และออก',
      color: 'error',
      onPress: () => {
        navigation.goBack();
      },
    },
    {
      title: 'ปิด',
      color: 'text1',
      onPress: () => {
        setShowWarning(false);
      },
    },
  ];
  const isNotChangeData = useMemo(() => {
    return (
      inputData.numberPlate === route.params.numberPlate &&
      inputData.deliveryRemark === route.params.deliveryRemark
    );
  }, [inputData.numberPlate, inputData.deliveryRemark, route.params]);
  return (
    <Container>
      <Header
        title="แก้ไขเลขทะเบียน"
        style={{
          minHeight: 40,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      />
      <TouchableWithoutFeedback
        style={{
          flex: 1,
        }}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <Content>
          <View
            style={{
              backgroundColor: colors.background1,
              height: 10,
              width: '100%',
            }}
          />
          <View>
            <View
              style={{
                paddingVertical: 12,
              }}>
              <Text fontFamily="NotoSans" semiBold color="text2">
                ข้อมูลทะเบียนรถ
                <Text color="error">*</Text>
              </Text>
              <InputText
                value={inputData?.numberPlate || ''}
                multiline
                returnKeyType="done"
                blurOnSubmit
                scrollEnabled={false}
                style={{
                  marginTop: 10,
                  alignItems: 'flex-start',
                  textAlignVertical: 'center',
                  paddingTop: 12,
                  minHeight: 48,
                }}
                onChangeText={(text: string) => {
                  setInputData(prev => ({ ...prev, numberPlate: text }));
                }}
                placeholder="ระบุทะเบียนรถ"
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text color="text3" fontSize={14} lineHeight={26}>
                  {`หากมีรถมากกว่า 1 คัน กรุณาใส่ลูกน้ำคั่น (,) `}
                </Text>
                <Text>
                  {inputData.numberPlate.length}/{NUMBER_PLATE_LENGTH}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.background1,
              height: 10,
              width: '100%',
            }}
          />
          <View
            style={{
              paddingVertical: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text fontFamily="NotoSans" semiBold color="text2">
                หมายเหตุการจัดส่ง
              </Text>
              <Text>
                {inputData.deliveryRemark.length}/{REMARK_LENGTH}
              </Text>
            </View>
            <InputText
              multiline
              value={inputData?.deliveryRemark}
              placeholder="ใส่หมายเหตุ..."
              maxLength={150}
              onChangeText={text =>
                setInputData(prev => ({ ...prev, deliveryRemark: text }))
              }
              style={{
                minHeight: Platform.OS === 'ios' ? 100 : 100,
                textAlignVertical: 'top',
                paddingTop: 10,
              }}
            />
          </View>
        </Content>
      </TouchableWithoutFeedback>
      <FooterShadow
        style={{
          paddingBottom: 0,
        }}>
        <Button
          disabled={
            inputData.numberPlate.length === 0 ||
            inputData.numberPlate.length > NUMBER_PLATE_LENGTH ||
            isNotChangeData
          }
          title="บันทึก"
          onPress={() => {
            setShowWarning(true);
          }}
        />
      </FooterShadow>
      <Modal
        visible={showWarning}
        hideClose
        width={'80%'}
        styleContainer={{
          padding: 0,
        }}>
        <View style={styles.title}>
          <Text semiBold center>
            มีการแก้ไขข้อมูล คุณต้องการบันทึก
          </Text>
          <Text semiBold center>
            และออกจากหน้านี้ใช่ไหม?
          </Text>
        </View>
        {buttonList.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={item.onPress}>
              <Text
                fontFamily="NotoSans"
                color={item.color as 'primary' | 'error' | 'text1'}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Modal>
    </Container>
  );
}
const styles = StyleSheet.create({
  button: {
    borderTopWidth: 1,
    borderTopColor: colors.border1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: {
    padding: 16,
    marginBottom: 4,
  },
});
