import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { CartDetailType, ProductType } from '../entities/productEntities';
import { CartItemType, cartServices } from '../services/CartServices';
import { useAuth } from './AuthContext';
import { DataForOrderLoad } from '../entities/orderLoadTypes';
import { useOrderLoads } from './OrdersLoadContext';

interface Props {
  children: JSX.Element;
}
export interface ProductTypeContext extends ProductType {
  quantity: number;
  shipmentOrder: number;
}
interface ContextCart {
  cartList: ProductTypeContext[];
  cartApi: {
    getCartList: () => Promise<any>;
    postCartItem: (cl: ProductTypeContext[]) => Promise<any>;
  };
  cartDetail: CartDetailType | null;
  setFreebieListItem: React.Dispatch<React.SetStateAction<any>>;
  // setCartDetail: React.Dispatch<React.SetStateAction<CartDetailType | null>>;
  setCartList: React.Dispatch<React.SetStateAction<ProductTypeContext[]>>;
  freebieListItem: any;
  cartOrderLoad:DataForOrderLoad[]
  setCartOrderLoad:React.Dispatch<React.SetStateAction<DataForOrderLoad[]>>
}
const CartContext = React.createContext<ContextCart>({
 
  cartList: [],
  setFreebieListItem: () => {
    return;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},

  cartDetail: null,
  freebieListItem: [],
  cartApi: {
    getCartList: async () => Promise.resolve(),
    postCartItem: async () => Promise.resolve(),
  },
  cartOrderLoad:[],
  setCartOrderLoad: ()=>{}
  
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartList, setCartList] = React.useState<ProductTypeContext[]>([]);
  const [cartOrderLoad, setCartOrderLoad] = React.useState<DataForOrderLoad[]>([]);
  const [freebieListItem, setFreebieListItem] = React.useState<any>([]);
  const [cartDetail, setCartDetail] = React.useState<CartDetailType | null>(
    null,
  );
  const {
    state: { user },
  } = useAuth();
  const { 
    setCurrentList,
    setDataReadyLoad,
  } = useOrderLoads();
  
  const value = React.useMemo(() => ({ cartList, setCartList }), [cartList]);
  const cartApi = React.useMemo(() => {
    const getCartList = async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');

      const userShopId = await AsyncStorage.getItem('userShopId');
      const userObj = user || {
        userShopId: userShopId || '',
      };

      const res = await cartServices.getCartList({
        userShopId: userObj.userShopId,
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
      });

      const freebieLists = res.orderProducts
        .filter((el: any) => el.isFreebie)
        .map((el: any) => {
          if (el.productFreebiesId) {
            const newObj = {
              productName: el.productName,
              id: el.productFreebiesId,
              quantity: el.quantity,
              baseUnit: el.baseUnitOfMeaTh || el.baseUnitOfMeaEn,
              status: el.productFreebiesStatus,
              productImage: el.productFreebiesImage,
            };
            return newObj;
          } else {
            const newObj = {
              productName: el.productName,
              id: el.productId,
              quantity: el.quantity,
              baseUnit: el.saleUOMTH || el.saleUOM || '',
              status: el.productStatus,
              productImage: el.productImage,
            };
            return newObj;
          }
        });

        const data: DataForOrderLoad[] = res.orderProducts

        const processedData: DataForOrderLoad[] = data?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          saleUOMTH: item.saleUOMTH,
          productImage: item.productImage,
          baseUnitOfMeaTh: item.baseUnitOfMeaTh,
          productFreebiesId: item.productFreebiesId,
          isFreebie: item.isFreebie,
          
        }));

        const mergedProducts = processedData.reduce((acc: { [key: string]: DataForOrderLoad }, processedData) => {
          const key = processedData.productId ?? 'undefined';
          if (acc[key]) {
            acc[key] = {
              ...acc[key],
              quantity: acc[key].quantity + processedData.quantity,
              freebieQuantity: processedData.isFreebie?processedData.quantity:0
            };
          } else {
            acc[key] = { ...processedData };
          }
          return acc;
        }, {});
        const mergedProductsArray = Object.values(mergedProducts);

      const cl = res.orderProducts.filter((el: any) => !el.isFreebie);
      const orderLoads = res.orderLoads
      setCartDetail(res);
      setFreebieListItem(freebieLists);
      setCartList(cl);
      setCartOrderLoad(mergedProductsArray)
      setDataReadyLoad(orderLoads)
      return res;
    };
    const postCartItem = async (cl: ProductTypeContext[]) => {
      try {
        const company = await AsyncStorage.getItem('company');

        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );

        const orderProducts = cl.map(el => {
          return {
            ...el,
            specialRequest: 0,
          };
        });
        const payload: CartItemType = {
          company: company ? company : 'ICPI',
          orderProducts,
          userShopId: user?.userShopId || '',
          isUseCod: false,
          paymentMethod: 'CREDIT',
          customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
        };

        const res = await cartServices.postCart(payload);
        const freebieLists = (res.orderProducts || [])
          .filter((el: any) => el.isFreebie)
          .map((el: any) => {
            if (el.productFreebiesId) {
              const newObj = {
                productName: el.productName,
                id: el.productFreebiesId,
                quantity: el.quantity,
                baseUnit: el.baseUnitOfMeaTh || el.baseUnitOfMeaEn,
                status: el.productFreebiesStatus,
                productImage: el.productFreebiesImage,
              };
              return newObj;
            } else {
              const newObj = {
                productName: el.productName,
                id: el.productId,
                quantity: el.quantity,
                baseUnit: el.saleUOMTH || el.saleUOM || '',
                status: el.productStatus,
                productImage: el.productImage,
              };
              return newObj;
            }
          });
          setDataReadyLoad(res.orderLoads)
        setFreebieListItem(freebieLists);
        const data: DataForOrderLoad[] = res.orderProducts

        const processedData: DataForOrderLoad[] = data?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          saleUOMTH: item.saleUOMTH,
          productImage: item.productImage,
          baseUnitOfMeaTh: item.baseUnitOfMeaTh,
          productFreebiesId: item.productFreebiesId,
          isFreebie: item.isFreebie,
          
        }));

        const mergedProducts = processedData.reduce((acc: { [key: string]: DataForOrderLoad }, processedData) => {
          const key = processedData.productId ?? 'undefined';
          if (acc[key]) {
            acc[key] = {
              ...acc[key],
              quantity: acc[key].quantity + processedData.quantity,
              freebieQuantity: processedData.isFreebie?processedData.quantity:0
            };
          } else {
            acc[key] = { ...processedData };
          }
          return acc;
        }, {});
        const mergedProductsArray = Object.values(mergedProducts);
        setCartOrderLoad(mergedProductsArray)

       

        return res;
      } catch (e) {
        console.log('e', e);
      }
    };
    return {
      getCartList,
      postCartItem,
    };
  }, [user]);
  return (
    <CartContext.Provider
      value={{
        cartList: value.cartList,
        setCartList: value.setCartList,
        cartApi,
        cartDetail,
        freebieListItem,
        setFreebieListItem,
        cartOrderLoad,
        setCartOrderLoad
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
