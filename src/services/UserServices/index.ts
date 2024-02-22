import { request } from '../../config/request';

export interface IGetUserShop {
  text?: string;
  page?: number;
  take?: number;
  customerId?: string;
  position?: string;
  isActive?: boolean;
}
export interface AddUserShopPayload {
  firstname: string;
  lastname: string;
  nickname?: string;
  telephone: string;
  position: string;
  email?: string;
  nametitle: string;
  isOwnerCreate: boolean;
  customerId: string;
  updateBy: string;
  createBy: string;
}
export interface UpdateUserShopPayload {
  firstname: string;
  lastname: string;
  nickname?: string;
  telephone: string;
  position: string;
  email?: string;
  nametitle: string;
  userShopId: string;
  updateBy: string;
  customerId: string;
  isActive: boolean;
}

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
const updateFcmToken = async (payload: {
  userShopId: string;
  deviceToken: string;
  customerId: string;
  token: string;
}) => {
  return await request
    .post(`/fcm/user-device`, payload, {
      headers: {
        Authorization: `Bearer ${payload.token}`,
      },
    })
    .then(res => res.data)
    .catch(err => err);
};
const removeDeviceToken = async (token: string) => {
  return await request
    .delete(`/fcm/user-device/${token}`)
    .then(res => res.data)
    .catch(err => err);
};
const getFactory = async ({
  factoryCode,
  company,
}: {
  factoryCode: string;
  company: string;
}) => {
  return await request
    .get(`/auth/factory?locationCode=${factoryCode}&company=${company}`)
    .then((res: any) => res.data);
};

const getProductBrand = async (company: string) => {
  return await request
    .get(`/master/product-brand?company=${company}`)
    .then((res: any) => res.data)
    .catch(err => err);
};
const getUserList = async (payload: IGetUserShop) => {
  const query = new URLSearchParams(payload as any).toString();
  return await request
    .get(`/auth/user-shop/usershop-company?${query}`)
    .then(res => {
      return res.data;
    });
};
const addUserShop = async (payload: AddUserShopPayload) => {
  return await request
    .post(`/auth/user-shop`, payload)
    .then(res => res.data)
    .catch(err => err);
};
const updateUserShop = async (payload: UpdateUserShopPayload) => {
  return await request
    .patch(`/auth/user-shop/update-user-shop-ex`, payload)
    .then(res => res.data)
    .catch(err => err);
};
const getUserShopById = async (userShopId: string) => {
  return await request
    .get(`/auth/user-shop/${userShopId}`)
    .then(res => res.data)
    .catch(err => err);
};

export const userServices = {
  postUserProfile,
  updateProfileNotification,
  getUserShop,
  getCoDiscount,
  updateFcmToken,
  removeDeviceToken,
  getFactory,
  getProductBrand,
  getUserList,
  addUserShop,
  getUserShopById,
  updateUserShop,
};
