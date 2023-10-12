import { request } from '../config/request';

const requestOtp = async (payload: {
  telephoneNo: string,
  brand:string,
  model: string,
  versionMobile: string,
  versionApp: string,
  isOpenLocation:unknown,

}) => {
  return await request.post('/auth/auth/shop/request-login-otp', payload);
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
  return await request.post('/auth/auth/shop/verify-otp', {
    telephoneNo,
    otpCode,
    refCode,
    token,
  })
  .then(res=>res)
  .catch(err=>{console.log(err)})
};

export const AuthServices = {
  requestOtp,
  verifyOtp,
};
