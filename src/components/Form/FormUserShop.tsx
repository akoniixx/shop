import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import { InputDataType } from '../../entities/userShopTypes';
import LabelInput from '../LabelInput/LabelInput';
import InputText from '../InputText/InputText';
import InputSheet from '../InputSheet/InputSheet';
import Avatar from '../Avatar/Avatar';
import images from '../../assets/images';
import { phoneNumberWithHyphen } from '../../utils/phoneNumberWithHyphen';
import Text from '../Text/Text';
import Switch from '../Switch/Switch';

export const LIST_PREFIX = [
  {
    id: 1,
    label: 'คุณ',
    value: 'คุณ',
  },

  {
    id: 2,
    label: 'นาย',
    value: 'นาย',
  },
  {
    id: 3,
    label: 'นาง',
    value: 'นาง',
  },
  {
    id: 4,
    label: 'นางสาว',
    value: 'นางสาว',
  },
];
export const LIST_ROLE = [
  {
    id: 1,
    label: 'เจ้าของร้าน',
    value: 'เจ้าของร้าน',
  },
  {
    id: 2,
    label: 'พนักงาน',
    value: 'พนักงาน',
  },
];
interface Props {
  inputData: InputDataType;
  setInputData: React.Dispatch<React.SetStateAction<InputDataType>>;
  isEdit?: boolean;
}
const FormUserShop = ({ inputData, setInputData, isEdit = false }: Props) => {
  return (
    <ScrollView
      scrollIndicatorInsets={{ right: 1 }}
      style={{
        flex: 1,
        paddingHorizontal: 16,
      }}>
      <View style={styles.imageContainer}>
        <Avatar
          source={
            inputData?.file?.uri
              ? { uri: inputData.file.uri }
              : images.emptyAvatar
          }
          noShadow
          editWhite
          haveTwoOption
          onPressEdit={(value: any) => {
            setInputData({ ...inputData, file: value });
          }}
        />
      </View>
      {isEdit && (
        <View>
          <View style={styles.rowSwitch}>
            <Text fontFamily="NotoSans" fontSize={18} bold>
              เปิดใช้งานบัญชีผู้ใช้
            </Text>
            <Switch
              trackSize={22}
              thumbSize={18}
              onValueChange={() => {
                setInputData({ ...inputData, isActive: !inputData.isActive });
              }}
              value={!!inputData.isActive}
            />
          </View>
          <View
            style={{
              marginVertical: 20,
              height: 1,
              width: '100%',
              backgroundColor: colors.border1,
            }}
          />
          <Text fontFamily="NotoSans" fontSize={18} bold>
            รายละเอียด
          </Text>
        </View>
      )}
      <View style={styles.containerInput}>
        <LabelInput required>คำนำหน้า</LabelInput>
        <InputSheet
          placeholder="เลือกคำนำหน้า"
          listRadio={LIST_PREFIX}
          sheetId="selectRadioSheet"
          onSelected={value => {
            setInputData({ ...inputData, prefix: value });
          }}
          value={inputData.prefix}
        />
      </View>
      <View style={styles.containerInput}>
        <LabelInput required>ชื่อ</LabelInput>
        <InputText
          placeholder="ระบุชื่อ"
          value={inputData.firstname}
          onChangeText={value => {
            setInputData({ ...inputData, firstname: value });
          }}
        />
      </View>
      <View style={styles.containerInput}>
        <LabelInput required>นามสกุล</LabelInput>
        <InputText
          value={inputData.lastname}
          placeholder="ระบุนามสกุล"
          onChangeText={value => {
            setInputData({ ...inputData, lastname: value });
          }}
        />
      </View>
      <View style={styles.containerInput}>
        <LabelInput>ชื่อเล่น</LabelInput>
        <InputText
          placeholder="ระบุชื่อเล่น"
          value={inputData.nickname}
          onChangeText={value => {
            setInputData({ ...inputData, nickname: value });
          }}
        />
      </View>
      <View style={styles.containerInput}>
        <LabelInput required>บทบาท</LabelInput>
        <InputSheet
          placeholder="เลือกบทบาท"
          listRadio={LIST_ROLE}
          sheetId="selectRadioSheet"
          onSelected={value => {
            setInputData({ ...inputData, role: value });
          }}
          value={inputData.role}
        />
      </View>
      <View style={styles.containerInput}>
        <LabelInput required>เบอร์โทรศัพท์</LabelInput>
        <InputText
          placeholder="ระบุเบอร์โทรศัพท์"
          value={phoneNumberWithHyphen(inputData.tel || '')}
          keyboardType="phone-pad"
          onChangeText={value => {
            setInputData({ ...inputData, tel: value });
          }}
          maxLength={12}
        />
      </View>
      <View style={styles.containerInput}>
        <LabelInput>อีเมล</LabelInput>
        <InputText
          placeholder="ระบุอีเมล"
          value={inputData.email}
          onChangeText={value => {
            setInputData({ ...inputData, email: value });
          }}
        />
      </View>
      <View
        style={{
          height: 60,
        }}
      />
    </ScrollView>
  );
};

export default FormUserShop;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInput: {
    marginTop: 16,
    width: '100%',
  },
  footer: {
    padding: 16,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 1.62,
    elevation: 14,
  },
  contentModalConfirm: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    padding: 16,
  },
  rowSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
});
