import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import images from '../../assets/images';
import Content from '../../components/Content/Content';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OtpInput from '../../components/OtpInput/OtpInput';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigations/AuthNavigator';
import { AuthServices } from '../../services/AuthService';
import { navigate } from '../../navigations/RootNavigator';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import { mixpanel } from '../../../mixpanel';
import { getBrand, getModel, getSystemVersion, isLocationEnabled } from 'react-native-device-info';
import packageJson from '../../../package.json'
import VersionCheck from 'react-native-version-check';

export default function OtpScreen({
  route,
}: StackScreenProps<AuthStackParamList, 'OtpScreen'>): JSX.Element {
  const { t } = useLocalization();
  const params = route.params;
  const [otpTimeOut, setOtpTimeOut] = useState(120);
  const [time, setTime] = useState('02:00');
  const [isError, setIsError] = useState(false);
  const [paramsData, setParamsData] = useState({
    token: '',
    refCode: '',
    tel: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = React.useState<string>('');
  const {
    authContext: { login },
  } = useAuth();
  useEffect(() => {
    if (params) {
      setParamsData(params);
    }
  }, [params]);
  const brand = getBrand()
  const model = getModel()
  const vMobile = getSystemVersion()
  
  const onResendOtp = async () => {

    try {
      const payload = {
        telephoneNo: params.tel,
        brand: brand,
        model: model,
        versionMobile: vMobile,
        versionApp: version,
        isOpenLocation: await isLocationEnabled()
      }
      const { data } = await AuthServices.requestOtp(payload);
      setOtpTimeOut(120);
      setTime('02:00');
      setParamsData(prev => ({
        ...prev,
        token: data?.result.token,
        refCode: data?.result.refCode,
      }));
    } catch (e: any) {

      console.log(e)
      mixpanel.track('loginError', {
        tel: paramsData.tel,
        error: e.response.data
      })

    }
  };

  const onCodeChange = async (code: string) => {
    setIsError(false);
    const payload = {
      token: paramsData.token,
      otpCode: code,
      refCode: paramsData.refCode,
      telephoneNo: paramsData.tel,
    };
    if (code.length === 6) {
      try {
        setIsLoading(true);
        const res = await login(payload);
        
        if (res.accessToken) {
          navigate('Main');
        }else{
          mixpanel.track('otpErrorNoToken', {
            tel: paramsData.tel,
            error: res
          })
        }
      } catch (e: any) {
        setIsError(true)
       mixpanel.track('otpError', {
        tel:  paramsData.tel,
        error: e,
        payload: payload
      })

      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    const getCurrentVersion = async () => {
      const currentVersion = await VersionCheck.getCurrentVersion();
      setVersion(currentVersion);
    };
    getCurrentVersion()
    const timer = setInterval(() => {
      if (otpTimeOut === 0) {
        return null;
      } else {
        const second = otpTimeOut - 1;
        setOtpTimeOut(second);
        setTime(
          `0${parseInt((second / 60).toString(), 10)}:${second % 60 < 10 ? '0' + (second % 60) : second % 60
          }`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  });
  return (
    <Container>
      <Image
        source={images.LoginScreen}
        style={{
          width: '100%',
          height: Dimensions.get('screen').height * 0.6,
          position: 'absolute',
        }}
      />

      <Content
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingHorizontal: 16,
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-start',
            marginTop: Dimensions.get('screen').height * 0.3,
          }}>
          <Text color="text1" bold left fontSize={24} fontFamily="NotoSans">
            {t('screens.OtpScreen.otpInput.label')}
          </Text>

          <Text color="text2" left>
            {t('screens.OtpScreen.otpInput.subLabel')}
          </Text>
        </View>
        <View
          style={{
            marginTop: 24,
          }}>
          <OtpInput isError={isError} onCodeChange={onCodeChange} />
        </View>
        <View
          style={{
            marginTop: Platform.OS === 'ios' ? 24 : 56,
            width: '100%',
            alignItems: 'center',
          }}>
          {isError ? (
            <View>
              <Text color="error" lineHeight={36}>
                รหัส OTP ไม่ถูกต้อง ลองใหม่อีกครั้ง
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: 24,
              }}
            />
          )}
          {otpTimeOut === 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}>
              <Text color="text3">
                {t('screens.OtpScreen.timer.otpNotSend')}
              </Text>
              <TouchableOpacity onPress={onResendOtp}>
                <Text
                  color="primary"
                  fontFamily="NotoSans"
                  fontSize={14}
                  semiBold
                  style={{
                    marginLeft: 4,
                    textDecorationLine: 'underline',
                  }}>
                  {t('screens.OtpScreen.timer.resend')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text color="text3">
              {t('screens.OtpScreen.timer.label', {
                time,
              })}
            </Text>
          )}
        </View>
        <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
           <Text  fontSize={14}
              color="text3"> Shop App เวอร์ชั่น {version}</Text>
           </View>
      </Content>
      <LoadingSpinner visible={isLoading} />
    </Container>
  );
}
