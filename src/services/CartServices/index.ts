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
  return await request
    .post('/order-cart/cart/shop', payload)
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
const getCartList = async ({ userShopId, customerCompanyId }: GetCartType) => {
  return await request
    .get(
      `/order-cart/cart/shop?userShopId=${userShopId}&customerCompanyId=${customerCompanyId}`,
    )
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};

const porsReorder =async (payload:
  {
    company:string,
   
    userShopId:string,
    orderId:string
  }) => {
    return await request
    .post('/order-cart/cart/shop-reorder', payload)
    .then(res => res.data)
    .catch(err => {throw err});
}
export const cartServices = {
  postCart,
  getCartList,
  porsReorder
};
