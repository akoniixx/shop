import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Text from '../../components/Text/Text';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import FormUserShop, {
  LIST_PREFIX,
  LIST_ROLE,
} from '../../components/Form/FormUserShop';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import {
  UpdateUserShopPayload,
  userServices,
} from '../../services/UserServices';
import { InputDataType, UserShopTypes } from '../../entities/userShopTypes';
import Modal from '../../components/Modal/Modal';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import { useAuth } from '../../contexts/AuthContext';

type Props = StackScreenProps<MainStackParamList, 'EditUserShopScreen'>;
const EditUserShopScreen = ({ navigation, route }: Props) => {
  const { userShopId } = route.params;
  const {
    state: { user },
  } = useAuth();
  const [inputData, setInputData] = useState<InputDataType>({});
  const [inputDataNew, setInputDataNew] = useState<InputDataType>({});
  const [isShowConfirmEdit, setIsShowConfirmEdit] = useState(false);

  const onConfirmEdit = async () => {
    try {
      const payload: UpdateUserShopPayload = {
        userShopId: userShopId,
        email: inputDataNew.email || '',
        firstname: inputDataNew.firstname || '',
        lastname: inputDataNew.lastname || '',
        nickname: inputDataNew.nickname || '',
        nametitle: inputDataNew.prefix?.value || '',
        position: inputDataNew.role?.value || '',
        telephone: inputDataNew.tel || '',
        isActive: inputDataNew.isActive || false,
        customerId: user?.customerToUserShops[0].customerId || '',
        updateBy: `${user?.firstname} ${user?.lastname}`,
      };
      const result = await userServices
        .updateUserShop(payload)
        .then(async res => {
          if (inputDataNew.file === null) {
            return res;
          }
          const isStartWithHttp = inputDataNew.file.uri.startsWith('http');
          if (isStartWithHttp) {
            return res;
          }

          const userShopId = res.responseData.userShopId;
          const { uri, type, fileName } = inputDataNew.file;

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
        });
      if (result && result.success) {
        setIsShowConfirmEdit(false);
        setTimeout(() => {
          navigation.navigate('UserShopDetailScreen', {
            ...result.responseData,
            profileImage: inputDataNew.file?.uri,
          });
        }, 800);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const isDisable = useMemo(() => {
    const isChange = Object.keys(inputData).some((key: string) => {
      if (key === 'file') {
        return inputData[key].uri !== inputDataNew[key].uri;
      }
      if (key === 'role' || key === 'prefix') {
        return (
          inputData[key as keyof InputDataType].value !==
          inputDataNew[key as keyof InputDataType].value
        );
      }

      return (
        inputData[key as keyof InputDataType] !==
        inputDataNew[key as keyof InputDataType]
      );
    });

    const requiredField = Object.keys({
      firstname: inputDataNew.firstname,
      lastname: inputDataNew.lastname,
      prefix: inputDataNew.prefix,
      role: inputDataNew.role,
      tel: inputDataNew.tel,
    }).some((key: string) => {
      if (key === 'prefix' || key === 'role') {
        return !inputDataNew[key as keyof InputDataType]?.value;
      }

      return !inputDataNew[key as keyof InputDataType];
    });
    return !isChange || requiredField;
  }, [inputData, inputDataNew]);

  useEffect(() => {
    if (userShopId) {
      const getUserShopById = async () => {
        try {
          const userShop: UserShopTypes = await userServices.getUserShopById(
            userShopId,
          );

          const findPrefix = LIST_PREFIX.find(el => {
            return el.value === userShop.nametitle;
          });
          const findRole = LIST_ROLE.find(el => {
            return el.value === userShop.position;
          });

          const currentState = {
            email: userShop.email,
            firstname: userShop.firstname,
            lastname: userShop.lastname,
            nickname: userShop.nickname,
            prefix: findPrefix,
            role: findRole,
            tel: userShop.telephone,
            file: {
              uri: userShop.profileImage,
            },
            isActive: userShop.isActive,
          };
          setInputData(currentState);
          setInputDataNew(currentState);
        } catch (error) {
          console.log('error', error);
        }
      };
      getUserShopById();
    }
    return () => {
      setInputData({});
      setInputDataNew({});
    };
  }, [userShopId]);

  return (
    <Container edges={['left', 'right', 'top']}>
      <Header title="แก้ไขข้อมูลผู้ใช้" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Content noPadding>
          <FormUserShop
            inputData={inputDataNew}
            setInputData={setInputDataNew}
            isEdit
          />
          <View style={styles.footer}>
            <Button
              title="บันทึก"
              disabled={isDisable}
              onPress={() => {
                setIsShowConfirmEdit(true);
              }}
            />
          </View>
        </Content>
      </KeyboardAvoidingView>
      <Modal visible={isShowConfirmEdit} hideClose noPadding width="70%">
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
              setIsShowConfirmEdit(false);
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
            onPress={onConfirmEdit}
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
    </Container>
  );
};

export default EditUserShopScreen;

const styles = StyleSheet.create({
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
