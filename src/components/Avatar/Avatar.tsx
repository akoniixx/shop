import {
  View,
  Text,
  ImageSourcePropType,
  Image,
  ImageStyle,
  ViewStyle,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import ModalWarning from '../Modal/ModalWarning';
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
}
export default function Avatar({
  source,
  style,
  styleView,
  isShowEdit = true,
  onPressEdit,
  ...props
}: Props) {
  const { width = 108, height = 108 } = props;
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

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
        if (onPressEdit) {
          onPressEdit(response.assets[0]);
        }
      }
    });
  };
  const borderRadius = width / 2;
  return (
    <View
      style={{
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderRadius,
        width,
        height,
        backgroundColor: colors.background1,
        justifyContent: 'center',
        alignItems: 'center',
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
          onPress={onPickImage}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 4,
          }}>
          <Image
            source={icons.iconEditPhoto}
            style={{
              width: 28,
              height: 28,
            }}
          />
        </TouchableOpacity>
      )}
      <ModalWarning
        title={'กรุณาเปิดสิทธิ์การเข้าถึง Storage'}
        onlyCancel
        width={300}
        minHeight={50}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
}
