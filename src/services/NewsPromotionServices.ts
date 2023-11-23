import { request } from "../config/request";


const getNewsPromotion = async (company: string, zone: string) => {
    return await request
      .get(
        `/master/promotion/promotion-active?company=${company}&zone=${zone}&isShowPromotion=true&isShowShopApp=true`,
      )
      .then(res => res.data)
      .catch(err => console.log(err));
  };

  const getHighlight = async (company:string) => {
    return await request
      .get(
        `/news/highlight?company=${company}&status=PUBLISHED&application=SHOP&page=1&take=1`,
      )
      .then(res => res.data.responseData)
      .catch(err => console.log(err));
  };

  const getNewsPromotionById = async (id:string) => {
    return await request
    .get(`/master/promotion/${id}`)
    .then(res => res.data)
    .catch(err => console.log(err));
  }


  export const NewsPromotionService = {
    getNewsPromotion,
    getHighlight,
    getNewsPromotionById
} 