import { mixpanel } from '../../mixpanel';
import { request } from '../config/request';

const requestOtp = async (payload: {
  telephoneNo: string;
  brand: string;
  model: string;
  versionMobile: string;
  versionApp: string;
  isOpenLocation: unknown;
}) => {
  return await request
    .post('/auth/auth/shop/request-login-otp', payload)
    .catch(err => {
      mixpanel.track('requestOtpErrorFromService', {
        tel: payload.telephoneNo,
        error: err,
        payload: payload,
      });
      throw err;
    });
};
const verifyOtp = async ({
  telephoneNo,
  otpCode,
  refCode,
  token,
}: {
  telephoneNo: string;
  otpCode: string;
  refCode: string;
  token: string;
}) => {
  return await request
    .post('/auth/auth/shop/verify-otp', {
      telephoneNo,
      otpCode,
      refCode,
      token,
    })
    .then(res => {
      if (res.data.success === false) {
        mixpanel.track('otpErrorFromService', {
          tel: telephoneNo,
          error: res.data,
          payload: {
            telephoneNo: telephoneNo,
            otpCode: otpCode,
            refCode: refCode,
            token: token,
          },
        });
      }
      return res;
    })
    .catch(err => {
      mixpanel.track('otpErrorFromServiceThrow', {
        tel: telephoneNo,
        error: err,
        payload: {
          telephoneNo: telephoneNo,
          otpCode: otpCode,
          refCode: refCode,
          token: token,
        },
      });

      throw err;
    });
};

export const AuthServices = {
  requestOtp,
  verifyOtp,
};
