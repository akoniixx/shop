import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import InputText from '../../components/InputText/InputText';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Summary from './Summary';
import { FactoryType, TypeDataStepTwo } from '.';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const [selectPlate, setSelectPlate] = useState<boolean>(true);

  return (
    <>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
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
              สถานที่รับสินค้า / สถานที่จัดส่ง
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text fontFamily="NotoSans" semiBold fontSize={16}>
                ข้อมูลทะเบียนรถ
              </Text>
              <Text color="error" fontFamily="NotoSans" fontSize={16}>
                * (จำเป็นต้องระบุ)
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setDataStepTwo(prev => ({ ...prev, numberPlate: '' }));
                    setSelectPlate(true);
                  }}
                  style={[
                    styles.radio,
                    {
                      borderColor: selectPlate
                        ? colors.primary
                        : colors.border1,
                      backgroundColor: selectPlate
                        ? colors.white
                        : colors.border1,
                    },
                  ]}
                />
                <Text>ระบุทะเบียนรถ</Text>
              </View>
            </View>
            {selectPlate && (
              <>
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
                    marginTop: 10,
                  }}
                  onChangeText={(text: string) => {
                    setIsShowError(false);
                    setDataStepTwo(prev => ({ ...prev, numberPlate: text }));
                  }}
                  placeholder="ระบุทะเบียนรถ"
                />
                <Text color="text3" fontSize={14} lineHeight={26}>
                  {`หากมีรถมากกว่า 1 คัน กรุณาใส่ลูกน้ำคั่น (,) `}
                </Text>
              </>
            )}

            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setDataStepTwo(prev => ({ ...prev, numberPlate: '-' }));
                    setSelectPlate(false);
                  }}
                  style={[
                    styles.radio,
                    {
                      borderColor: selectPlate
                        ? colors.border1
                        : colors.primary,
                      backgroundColor: selectPlate
                        ? colors.border1
                        : colors.white,
                    },
                  ]}
                />
                <Text>ไม่ระบุทะเบียนรถ</Text>
              </View>
            </View>
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
                  รับที่โรงงาน
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
        </View>
        <View style={[styles.container, { marginTop: 10 }]}>
          <View
            style={{
              minHeight: 120,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text semiBold color="text2" fontFamily="NotoSans">
                หมายเหตุการจัดส่ง
              </Text>
              <Text semiBold color="text2" fontFamily="NotoSans">
                {dataStepTwo.saleCoRemark?.length || 0}/150
              </Text>
            </View>
            <InputText
              multiline
              value={dataStepTwo?.saleCoRemark || ''}
              placeholder="ใส่หมายเหตุ..."
              numberOfLines={5}
              maxLength={150}
              scrollEnabled={false}
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

        <Summary dataStepTwo={dataStepTwo} setDataStepTwo={setDataStepTwo} />
      </KeyboardAwareScrollView>
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
  radio: {
    borderWidth: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
});
