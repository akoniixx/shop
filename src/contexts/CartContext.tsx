import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { CartDetailType, ProductType } from '../entities/productEntities';
import { CartItemType, cartServices } from '../services/CartServices';
import { useAuth } from './AuthContext';
import { DataForOrderLoad, DataForReadyLoad } from '../entities/orderLoadTypes';
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
    postCartItem: (
      cl: ProductTypeContext[],
      DataForReadyLoad?: DataForReadyLoad[],
    ) => Promise<any>;
  };
  cartDetail: CartDetailType | null;
  setFreebieListItem: React.Dispatch<React.SetStateAction<any>>;
  // setCartDetail: React.Dispatch<React.SetStateAction<CartDetailType | null>>;
  setCartList: React.Dispatch<React.SetStateAction<ProductTypeContext[]>>;
  freebieListItem: any;
  cartOrderLoad: DataForOrderLoad[];
  setCartOrderLoad: React.Dispatch<React.SetStateAction<DataForOrderLoad[]>>;
  setIsDelCart: React.Dispatch<React.SetStateAction<boolean>>;
  isDelCart: boolean;
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
  cartOrderLoad: [],
  setCartOrderLoad: () => {},
  setIsDelCart: () => {
    return;
  },
  isDelCart: false,
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartList, setCartList] = React.useState<ProductTypeContext[]>([]);
  const [cartOrderLoad, setCartOrderLoad] = React.useState<DataForOrderLoad[]>(
    [],
  );
  const [freebieListItem, setFreebieListItem] = React.useState<any>([]);
  const [isDelCart, setIsDelCart] = React.useState<boolean>(false);
  const [cartDetail, setCartDetail] = React.useState<CartDetailType | null>(
    null,
  );
  const {
    state: { user },
  } = useAuth();
  const { setCurrentList, setDataReadyLoad, dataReadyLoad } = useOrderLoads();

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

      const data: DataForOrderLoad[] = res.orderProducts;

      const processedData: DataForOrderLoad[] = data?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        saleUOMTH: item.saleUOMTH,
        productImage: item.productImage,
        baseUnitOfMeaTh: item.baseUnitOfMeaTh,
        productFreebiesId: item.productFreebiesId,
        isFreebie: item.isFreebie,
      }));

      /*  console.log(processedData) */

      /*  const mergedProducts = processedData.reduce((acc: { [key: string]: DataForOrderLoad }, processedData) => {
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
        const mergedProductsArray = Object.values(mergedProducts); */

      const mergedProducts = processedData.reduce(
        (acc: { [key: string]: DataForOrderLoad }, item) => {
          const key =
            item.productId ||
            `freebie_${item.productFreebiesId}` ||
            'undefined';
          if (acc[key]) {
            acc[key].quantity += item.quantity;
            if (item.isFreebie) {
              acc[key].freebieQuantity =
                (acc[key].freebieQuantity || 0) + item.quantity;
            }
          } else {
            acc[key] = { ...item };
            acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
          }
          return acc;
        },
        {},
      );

      const mergedProductsArray = Object.values(mergedProducts);

      const cl = res.orderProducts.filter((el: any) => !el.isFreebie);
      const orderLoads = res?.orderLoads;
      setCartDetail(res);
      setFreebieListItem(freebieLists);
      setCartList(cl);
      setCartOrderLoad(mergedProductsArray);
      if (orderLoads.length > 0) {
        setDataReadyLoad(orderLoads);
      }
      return res;
    };
    const postCartItem = async (
      cl: ProductTypeContext[],
      dataReadyLoad?: DataForReadyLoad[],
    ) => {
      try {
        const company = await AsyncStorage.getItem('company');

        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );

        const orderProducts = cl.map(el => {
          return {
            ...el,
            promotion: [],
            orderProductPromotions: [],
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
          orderLoads: dataReadyLoad || [],
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
        if (res?.orderLoads && res.orderLoads.length > 0) {
          setDataReadyLoad(res.orderLoads);
        }
        setFreebieListItem(freebieLists);
        const data: DataForOrderLoad[] = res.orderProducts;

        const processedData: DataForOrderLoad[] = data?.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          saleUOMTH: item.saleUOMTH,
          productImage: item.productImage,
          baseUnitOfMeaTh: item.baseUnitOfMeaTh,
          productFreebiesId: item.productFreebiesId,
          isFreebie: item.isFreebie,
        }));

        const mergedProducts = processedData.reduce(
          (acc: { [key: string]: DataForOrderLoad }, item) => {
            const key =
              item.productId ||
              `freebie_${item.productFreebiesId}` ||
              'undefined';
            if (acc[key]) {
              acc[key].quantity += item.quantity;
              if (item.isFreebie) {
                acc[key].freebieQuantity =
                  (acc[key].freebieQuantity || 0) + item.quantity;
              }
            } else {
              acc[key] = { ...item };
              acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
            }
            return acc;
          },
          {},
        );

        const mergedProductsArray = Object.values(mergedProducts);
        setCartOrderLoad(mergedProductsArray);

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
        setCartOrderLoad,
        isDelCart,
        setIsDelCart,
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
