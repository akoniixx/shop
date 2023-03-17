import { request } from '../../config/request';

const postUserProfile = async (data: any) => {
  return await request
    .post('/auth/user-shop/update-profile', data)
    .then(res => res.data);
};

export const userServices = {
  postUserProfile,
};
