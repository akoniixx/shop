import { request } from '../../config/request';

const postUserProfile = async (data: any) => {
  return await request
    .post('/auth/user-shop/update-profile', data)
    .then(res => res.data);
};
const updateProfileNotification = async (payload: {
  notiStatus: boolean;
  userShopId: string;
}) => {
  return await request.patch(
    `/auth/user-shop?userShopId=${payload.userShopId}&notiStatus=${payload.notiStatus}`,
  );
};
const getUserShop = async (userShopId: string) => {
  return await request
    .get(`/auth/user-shop/${userShopId}`)
    .then(res => res.data)
    .catch(err => err);
};
const getCoDiscount = async (customerCompanyId: string) => {
  return await request
    .get(`/master/credit-memo-shop/detail/${customerCompanyId}`)
    .then(res => res.data)
    .catch(err => err);
};

export const userServices = {
  postUserProfile,
  updateProfileNotification,
  getUserShop,
  getCoDiscount,
};
