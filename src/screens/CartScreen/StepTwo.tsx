import { View, StyleSheet, Platform, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import InputText from '../../components/InputText/InputText';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Summary from './Summary';
import { FactoryType, TypeDataStepTwo } from '.';

interface Props {
  setDataStepTwo: React.Dispatch<React.SetStateAction<TypeDataStepTwo>>;
  dataStepTwo: TypeDataStepTwo;
  currentLocation: FactoryType;
  isShowError: boolean;
  setIsShowError: React.Dispatch<React.SetStateAction<boolean>>;
  refInput: React.MutableRefObject<any>;
}
export default function StepTwo({
  setDataStepTwo,
  dataStepTwo,
  currentLocation,
  setIsShowError,
  isShowError,
  refInput,
}: Props) {
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text semiBold color="text2" fontFamily="NotoSans">
            หมายเหตุการจัดส่ง
          </Text>
          <InputText
            multiline
            returnKeyType="done"
            value={dataStepTwo?.saleCoRemark || ''}
            placeholder="ใส่หมายเหตุ..."
            numberOfLines={5}
            blurOnSubmit
            onChangeText={text =>
              setDataStepTwo(prev => ({ ...prev, saleCoRemark: text }))
            }
            style={{
              minHeight: Platform.OS === 'ios' ? 100 : 100,
              textAlignVertical: 'top',
              paddingTop: 10,
            }}
          />
        </View>
      </View>
      <View
        style={[
          styles.container,
          {
            marginTop: 8,
          },
        ]}></View>
      <View
        style={[
          styles.container,
          {
            marginTop: 8,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.border1,
            paddingBottom: 14,
          }}>
          <Text bold fontSize={18} fontFamily="NotoSans">
            สถานที่รับสินค้า
          </Text>
        </View>
        <View
          style={{
            marginTop: 16,
            padding: 8,
            backgroundColor: colors.background1,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={icons.location}
              style={{
                width: 24,
                height: 24,
              }}
            />
            <View
              style={{
                marginLeft: 8,
              }}>
              <Text semiBold>
                จัดส่งโรงงาน
                {` ${currentLocation.factoryName}`}
              </Text>
              <Text
                lineHeight={18}
                color="text3"
                fontSize={14}
                style={{
                  width: 280,
                  marginTop: 4,
                }}>
                {currentLocation.address}
              </Text>
              <Text
                lineHeight={18}
                color="text3"
                fontSize={14}
                style={{
                  width: 280,
                }}>
                {currentLocation.subDistrict}
                {''}
                <Text
                  style={{
                    paddingLeft: 4,
                    marginLeft: 4,
                  }}
                  lineHeight={18}
                  color="text3"
                  fontSize={14}>
                  {` ${currentLocation.district}`}
                </Text>{' '}
                {currentLocation.province} {currentLocation.postcode}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text fontFamily="NotoSans" semiBold fontSize={16}>
            <Text color="error">{'*  '}</Text>
            ข้อมูลทะเบียนรถ
          </Text>
          <InputText
            ref={refInput}
            value={dataStepTwo?.numberPlate || ''}
            multiline
            returnKeyType="done"
            blurOnSubmit
            isError={isShowError}
            scrollEnabled={false}
            style={{
              paddingTop: 16,
            }}
            onChangeText={(text: string) => {
              setIsShowError(false);
              setDataStepTwo(prev => ({ ...prev, numberPlate: text }));
            }}
            placeholder="ระบุทะเบียนรถ"
          />
          <Text color="text3" fontSize={14} lineHeight={26}>
            หากมีรถมากกว่า 1 คัน กรุณาใส่ลูกน้ำคั่น (,)
          </Text>
          {isShowError && (
            <Text color="error" fontFamily="NotoSans">
              กรุณากรอกทะเบียนรถ
            </Text>
          )}
        </View>
      </View>
      <Summary dataStepTwo={dataStepTwo} setDataStepTwo={setDataStepTwo} />
    </>
  );
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
  inputContainer: {
    marginTop: 8,
  },
});
