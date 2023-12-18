import { request } from "../../config/request";
  const getNotilist = async(
    page: number,
    take: number,
    sortDirection: 'ASC' | 'DESC',
    userShopId:string,
    customerCompanyId:string
   
  ) => {

    return await request
    .get(`/fcm/notification?page=${page}&take=${take}&sortDirection=${sortDirection}&userShopId=${userShopId}&type=ORDER&customerCompanyId=${customerCompanyId}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
  }
  
  const readNoti = async(
    notiId:string
  ) => {
    return await request
    .post(`/fcm/notification/read/${notiId}`)
    .then( res => res.data)
    .catch(err => {
      throw err;
    });
  }

  const getPromoNotilist = async(
    page: number,
    take: number,
    sortDirection: 'ASC' | 'DESC',
    userShopId:string,
    company:string
    
   
  ) => {

    return await request
    .get(`/fcm/notification?page=${page}&take=${take}&sortDirection=${sortDirection}&userShopId=${userShopId}&type=PROMOTION&company=${company}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
  }
  export const notiListServices = {
    getNotilist,
    readNoti,
    getPromoNotilist,
  };