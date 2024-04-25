export interface DataForOrderLoad {
  amount: any;
  amountFreebie: any;
  type?: string;
  key?: string;
  productId?: string;
  quantity: number;
  productName: string;
  saleUOMTH?: string;
  freebieQuantity?: number;
  productImage: string;
  productFreebiesId?: string;
  isFreebie?: boolean;
  baseUnitOfMeaTh?: string;
  maxQuantity?: number;
}

export type DataForReadyLoad = {
  amountFreebie: any;
  amount: any;
  productId?: string;
  productFreebiesId?: string;
  productName: string;
  truckType: string;
  deliveryNo: number;
  quantity: number;
  unit?: string;
  key?: string;
  freebieQuantity?: number;
  productImage: string;
};
