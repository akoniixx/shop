import {
  View,
  ImageSourcePropType,
  Image,
  ImageStyle,
  ViewStyle,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ModalWarning from '../Modal/ModalWarning';
import Modal from '../Modal/Modal';
import Text from '../Text/Text';
const options: ImageLibraryOptions = {
  maxWidth: 300,
  maxHeight: 300,
  mediaType: 'photo',
};
interface Props {
  source: ImageSourcePropType;
  style?: ImageStyle;
  styleView?: ViewStyle;
  width?: number;
  height?: number;
  isShowEdit?: boolean;
  onPressEdit?: (value: any) => void;
  noShadow?: boolean;
  editWhite?: boolean;
  haveTwoOption?: boolean;
}

export default function Avatar({
  source,
  style,
  styleView,
  isShowEdit = true,
  onPressEdit,
  noShadow,
  editWhite,
  haveTwoOption,
  ...props
}: Props) {
  const { width = 108, height = 108 } = props;
  const [showOption, setShowOption] = React.useState<boolean>(false);
  const [errorShow, setErrorShow] = React.useState<boolean>(false);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  async function requestStoragePermission() {
    try {
      if (Platform.OS === 'ios') {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'สิทธ์การเข้าถึง Storage',
          message: 'เพื่อให้สามารถเข้าถึงไฟล์ได้',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'ยกเลิก',
          buttonPositive: 'ตกลง',
        },
      );

      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        granted === 'never_ask_again'
      ) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (error) {
      console.warn(error);
    }
  }
  async function requestCameraPermission() {
    try {
      if (Platform.OS === 'ios') {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'สิทธ์การเข้าถึง Camera',
          message: 'เพื่อให้สามารถถ่ายรูปได้',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'ยกเลิก',
          buttonPositive: 'ตกลง',
        },
      );
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        granted === 'never_ask_again'
      ) {
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (error) {
      console.warn(error);
    }
  }
  const onPickImage = async () => {
    const isGranted = await requestStoragePermission();
    if (!isGranted) {
      setModalVisible(true);
      return;
    }
    await launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else {
        if (onPressEdit && response.assets[0]) {
          onPressEdit(response.assets[0]);
          setShowOption(false);
        }
      }
    });
  };

  const onTakePhoto = async () => {
    const isGranted = await requestCameraPermission();
    if (!isGranted) {
      setModalVisible(true);
      return;
    }

    await launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        maxWidth: 300,
        maxHeight: 300,
      },
      (response: any) => {
        if (response.didCancel || response.errorCode === 'camera_unavailable') {
          console.log('User cancelled take photo');
          setShowOption(false);
          setTimeout(() => {
            setErrorShow(true);
          }, 1000);
          return;
        } else {
          if (onPressEdit && response) {
            onPressEdit(response.assets[0]);
            setShowOption(false);
          }
        }
      },
    );
  };
  const borderRadius = width / 2;
  const shadowStyles = noShadow
    ? {}
    : {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      };
  const OPTIONS_LIST = [
    {
      id: 1,
      title: 'เลือกรูปภาพ',
      onPress: onPickImage,
      icon: icons.iconSelectImage,
    },
    {
      id: 2,
      title: 'ถ่ายรูป',
      onPress: () => onTakePhoto(),
      icon: icons.iconSelectCamera,
    },
    {
      id: 3,
      title: 'ยกเลิก',
      onPress: () => setShowOption(false),
    },
  ];

  return (
    <View
      style={{
        borderRadius,
        width,
        height,
        backgroundColor: colors.background1,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadowStyles,
        ...styleView,
      }}>
      <Image
        source={source}
        resizeMode="cover"
        style={{
          ...style,
          borderRadius,
          width: '100%',
          height: '100%',
        }}
      />
      {isShowEdit && (
        <TouchableOpacity
          disabled={!onPressEdit}
          onPress={haveTwoOption ? () => setShowOption(true) : onPickImage}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 4,
          }}>
          <Image
            source={editWhite ? icons.iconCamera : icons.iconEditPhoto}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
            }}
          />
        </TouchableOpacity>
      )}
      <Modal visible={showOption} hideClose noPadding>
        {OPTIONS_LIST.map((item, index) => {
          const isLast = index === OPTIONS_LIST.length - 1;
          return (
            <TouchableOpacity
              onPress={item.onPress}
              key={index}
              style={[
                styles.selectItem,
                {
                  borderBottomWidth: isLast ? 0 : 1,
                  justifyContent: isLast ? 'center' : 'space-between',
                },
              ]}>
              <Text
                fontFamily="NotoSans"
                fontSize={16}
                semiBold
                color={isLast ? 'primary' : 'text1'}>
                {item.title}
              </Text>
              {item.icon && (
                <Image
                  source={item.icon}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </Modal>
      <ModalWarning
        title={'กรุณาเปิดสิทธิ์การเข้าถึง Storage'}
        onlyCancel
        width={300}
        minHeight={50}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
      <ModalWarning
        title={'การเข้าถึง Camera ถูกปฎิเสธ'}
        onlyCancel
        textCancel="ปิด"
        width={300}
        minHeight={50}
        visible={errorShow}
        onRequestClose={() => setErrorShow(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
