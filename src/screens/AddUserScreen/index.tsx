import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';

import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Text from '../../components/Text/Text';
import { AddUserShopPayload, userServices } from '../../services/UserServices';
import { useAuth } from '../../contexts/AuthContext';
import { InputDataType } from '../../entities/userShopTypes';
import FormUserShop from '../../components/Form/FormUserShop';
import ModalWarning from '../../components/Modal/ModalWarning';

export default function AddUserScreen({ navigation }: { navigation: any }) {
  const {
    state: { user },
  } = useAuth();
  const [inputData, setInputData] = React.useState<InputDataType>({
    file: null,
    prefix: null,
    firstname: null,
    lastname: null,
    email: null,
    tel: null,
  } as InputDataType);

  const [isShowConfirmAddUser, setIsShowConfirmAddUser] = React.useState(false);
  const [emailOrTelDuplicate, setEmailOrTelDuplicate] = React.useState(false);

  const onShowConfirmAddUser = () => {
    setIsShowConfirmAddUser(true);
  };
  const isDisable = useMemo(() => {
    const listRequired = ['prefix', 'firstname', 'lastname', 'role', 'tel'];
    const isAllRequired = listRequired.every(key => {
      return !!inputData[key as keyof InputDataType];
    });
    return !isAllRequired;
  }, [inputData]);

  const onConfirmAdd = async () => {
    try {
      const isOwnerCreate = user?.position === 'เจ้าของร้าน';
      const removeHyphen = inputData.tel?.replace(/-/g, '');
      const payload: AddUserShopPayload = {
        firstname: inputData.firstname || '',
        lastname: inputData.lastname || '',
        nickname: inputData.nickname || '',
        telephone: removeHyphen || '',
        position: inputData.role?.value || '',
        email: inputData.email || '',
        nametitle: inputData.prefix?.value || '',
        isOwnerCreate: isOwnerCreate,
        customerId: user?.customerToUserShops[0].customerId || '',
        createBy: `${user?.firstname} ${user?.lastname}`,
        updateBy: `${user?.firstname} ${user?.lastname}`,
      };

      const result = await userServices.addUserShop(payload).then(async res => {
        try {
          if (inputData.file === null) {
            return res;
          }
          const userShopId = res.responseData.userShopId;
          const { uri, type, fileName } = inputData.file;

          const isIOS = Platform.OS === 'ios';
          const localFilePath = isIOS ? uri : uri.replace('file://', '');

          const data = new FormData();
          data.append('file', {
            uri: localFilePath,
            type,
            name: fileName,
          });
          data.append('userShopId', userShopId);
          await userServices.postUserProfile(data);
          return res;
        } catch (e) {
          console.log('e :>> ', e);
        }
      });
      if (result && result.success) {
        setIsShowConfirmAddUser(false);
        navigation.goBack();
      } else if (
        result.userMessage === 'ไม่สามารถบันทึกได้ เนื่องจากข้อมูลซ้ำ'
      ) {
        setEmailOrTelDuplicate(true);
      }
    } catch (error) {
      console.log('error :>> ', error);

      throw error;
    } finally {
      setIsShowConfirmAddUser(false);
    }
  };

  return (
    <Container edges={['top', 'left', 'right']}>
      <Header title="เพิ่มผู้ใช้ในร้าน" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Content noPadding>
          <FormUserShop inputData={inputData} setInputData={setInputData} />
          <View style={styles.footer}>
            <Button
              title="บันทึก"
              disabled={isDisable}
              onPress={onShowConfirmAddUser}
            />
          </View>
        </Content>
      </KeyboardAvoidingView>
      <Modal visible={isShowConfirmAddUser} hideClose noPadding width="70%">
        <View style={styles.contentModalConfirm}>
          <Text
            semiBold
            fontSize={16}
            style={{
              marginBottom: 8,
            }}>
            ยืนยันการบันทึก
          </Text>
          <Text
            fontSize={14}>{`กรุณาตรวจสอบรายละเอียดข้อมูล \nก่อนกดยืนยัน`}</Text>
        </View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            width: '100%',
            borderTopWidth: 1,
            borderTopColor: colors.border1,
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsShowConfirmAddUser(false);
            }}
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text semiBold fontSize={14} fontFamily="NotoSans" center>
              ยกเลิก
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirmAdd}
            style={{
              flex: 1,
              justifyContent: 'center',
              borderLeftWidth: 1,
              borderLeftColor: colors.border1,
            }}>
            <Text
              semiBold
              center
              fontSize={14}
              fontFamily="NotoSans"
              color="primary">
              ยืนยัน
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ModalWarning
        visible={emailOrTelDuplicate}
        title="เบอร์โทรศัพท์ซ้ำในระบบ"
        desc={`กรุณาดำเนินการตรวจสอบ\nหมายเลขโทรศัพท์ใหม่อีกครั้ง`}
        onRequestClose={() => {
          setEmailOrTelDuplicate(false);
        }}
        textCancel="ตกลง"
        width={Dimensions.get('window').width - 62}
        onlyCancel
      />
    </Container>
  );
}

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
});
