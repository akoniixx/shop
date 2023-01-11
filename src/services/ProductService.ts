import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../config/request';
import { ProductTypeParams } from '../entities/productEntities';

const getAllProducts = async ({
  page = 1,
  take = 10,
  customerId,
  company,
  isPromotion = false,
  productBrandId,
  productCategoryId,
  sortField,
  sortDirection,
  searchText,
  productLocation,
}: ProductTypeParams) => {
  const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
  const payload: ProductTypeParams = {
    page,
    take,
    company,
    isPromotion,
    productLocation,
    productStatus: 'ACTIVE',
    customerCompanyId: customerCompanyId || '',
  };
  if (customerId) {
    payload.customerId = customerId;
  }
  if (productBrandId) {
    payload.productBrandId = productBrandId;
  }
  if (productCategoryId) {
    payload.productCategoryId = productCategoryId;
  }
  if (sortField) {
    payload.sortField = sortField;
  }
  if (sortDirection) {
    payload.sortDirection = sortDirection;
  }
  if (searchText) {
    payload.searchText = searchText;
  }

  const genQuery = Object.keys(payload)
    .map(key => `${key}=${payload[key as keyof ProductTypeParams]}`)
    .join('&');

  return await request
    .get(`/master/product?${genQuery}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};
const getProductBrandList = async (company?: string) => {
  return await request
    .get(`/master/product-brand?company=${company}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};
const getProductCategory = async (company?: string) => {
  return await request
    .get(`/master/product-category?company=${company}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};
const getProductById = async (productId: string) => {
  const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');

  return await request
    .get(
      `/master/product/product-by-id?productId=${productId}&customerCompanyId=${customerCompanyId}`,
    )
    .then(res => res.data)
    .catch(err => console.log(err));
};

export const productService = {
  getAllProducts,
  getProductBrandList,
  getProductCategory,
  getProductById,
};
