import { request } from '../../config/request';

interface Order {
  company: string;
  customerCompanyId: string;
  customerName: string;
  customerNo: string;
  isUseCod?: boolean;
  orderProducts: {
    productId: number;
    quantity: number;
    shipmentOrder: number;
  }[];
  paymentMethod?: string;
  saleCoRemark?: string | null;
  specialRequestRemark?: string | null;
  userShopId: string;
}
const createOrder = async (order: Order) => {
  const response = await request.post('/cart/order', order);
  return response.data;
};
const getOrderById = async (orderId: string) => {
  const response = await request.get(`/cart/order/${orderId}`);
  return response.data;
};
const postStatusOrder = async (payload: {
  orderId: string;
  status: string;
  paidStatus: string;
  cancelRemark: string;
  soNo: string | null;
  navNo: string | null;
  updateBy: string;
}) => {
  return await request
    .post('/cart/order/update-order-status', payload)
    .then(res => res.data)
    .catch(err => err);
};
export const orderServices = {
  createOrder,
  getOrderById,
  postStatusOrder,
};
