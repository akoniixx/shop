export interface HistoryDataType {
  orderFiles: orderFiles[];
  orderId: string;
  company: string;
  orderNo: string;
  spNo: string;
  userStaffId: string;
  userShopId: string | null;
  customerCompanyId: number;
  customerName: string;
  customerNo: string;
  userStaffName: string | null;
  userShopName: string | null;
  status: string;
  paymentMethod: string;
  isUseCOD: boolean;
  soNo: string | null;
  navNo: string | null;
  paidStatus: string;
  saleCoRemark: string | null;
  specialRequestRemark: string | null;
  cancelRemark: string;
  deliveryDest: string | null;
  deliveryAddress: string | null;
  deliveryRemark: string | null;
  price: string;
  discount: string;
  cashDiscount: string;
  specialRequestDiscount: string;
  coDiscount: string;
  totalDiscount: string;
  totalPrice: string;
  createAt: string;
  updateAt: string;
  updateBy: string;
  numberPlate: string;
  orderProducts: {
    price: number;
    baseUom: string;
    commonName: string;
    marketPrice: number;
    orderId: string;
    orderProductId: string;
    packSize: string;
    packingUom: string;
    productCodeNav: string;
    productId: number;
    productName: string;
    productImage: string | null;
    qtySaleUnit: number;
    quantity: number;
    saleUOM: string;
    saleUOMTH: string;
    shipmentOrder: number;
    totalPrice: number;
    isFreebie: boolean;
  }[];
}
export interface orderFiles{
  createAt:string
  filePath:string
  isDeleted:boolean
  orderFileId:string
  orderId:string
  updateAt:string
 }