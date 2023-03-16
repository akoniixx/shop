import { request } from '../../config/request';

export interface CartItemType {
  company: string;
  customerCompanyId: string | number;
  isUseCod?: boolean;
  orderProducts: {
    productId: number | string;
    quantity: number;
    shipmentOrder: number;
    specialRequest: number;
  }[];
  paymentMethod?: string;
  customerName?: string;
  customerNo?: string;
  userShopId: string;
}
interface GetCartType {
  userShopId?: string;
  customerCompanyId?: number;
}
const postCart = async (payload: CartItemType) => {
  console.log('payload', JSON.stringify(payload, null, 2));
  return await request
    .post('/cart/cart/shop', payload)
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
const getCartList = async ({ userShopId, customerCompanyId }: GetCartType) => {
  return await request
    .get(
      `/cart/cart/shop?userShopId=${userShopId}&customerCompanyId=${customerCompanyId}`,
    )
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
export const cartServices = {
  postCart,
  getCartList,
};