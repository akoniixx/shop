export interface ProfileEntities {
  userShopId: string;
  firstname: string;
  lastname: string;
  nickname: string;
  telephone: string;
  isActive: true;
  isPrimary: any;
  primaryId: any;
  position: any;
  idCard: string;
  createDate: string;
  updateDate: string;
  updateBy: null;
  lastLogin: string;
  customerToUserShops: CustomerEntities[];
  company: string;
}
// export interface UserShopEntities {
//   userShopId: string;
//   firstname: string;
//   lastname: string;
//   nickname: string;
//   telephone: string;
//   isActive: true;
//   isPrimary: any;
//   primaryId: any;
//   position: any;
//   idCard: string;
//   createDate: string;
//   updateDate: string;
//   updateBy: null;
//   lastLogin: string;
// }
export interface CustomerEntities {
  customer: {
    customerId: string;
    address: string;
    province: string;
    district: string;
    subdistrict: string;
    postcode: string;
    telephone: string;
    taxNo: string;
    createDate: string;
    updateDate: string;
    updateBy: string;
    customerCompany: CustomerCompanyEntities[];
  };
}
export interface CustomerCompanyEntities {
  customerCompanyId: string;
  customerId: string;
  isNav: boolean;
  customerName: string;
  customerNo: string;
  company: 'ICPL' | 'ICPF' | 'ICPI';
  customerType: 'DL' | 'SD';
  zone: string;
  termPayment: string;
  creditLimit: number;
  isActive: boolean;
  salePersonCode: string;
  createDate: string;
  updateDate: string;
  updateBy: string;
  productBrand: {
    company: 'ICPL' | 'ICPF' | 'ICPI';
    product_brand_id: string | number;
    product_brand_name: string;
  }[];
}
