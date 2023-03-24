import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { CartDetailType, ProductType } from '../entities/productEntities';
import { CartItemType, cartServices } from '../services/CartServices';
import { useAuth } from './AuthContext';

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
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [cartList, setCartList] = React.useState<ProductTypeContext[]>([]);
  const [freebieListItem, setFreebieListItem] = React.useState<any>([]);
  const [cartDetail, setCartDetail] = React.useState<CartDetailType | null>(
    null,
  );
  const {
    state: { user },
  } = useAuth();
  const value = React.useMemo(() => ({ cartList, setCartList }), [cartList]);
  const cartApi = React.useMemo(() => {
    const getCartList = async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');

      const userObj = user || {
        userShopId: '',
      };

      const res = await cartServices.getCartList({
        userShopId: userObj.userShopId,
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
      });

      console.log('res', JSON.stringify(res, null, 2));
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
      const cl = res.orderProducts.filter((el: any) => !el.isFreebie);
      setCartDetail(res);
      setFreebieListItem(freebieLists);
      setCartList(cl);
      return res;
    };
    const postCartItem = async (cl: ProductTypeContext[]) => {
      try {
        setLoading(true);
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
        setFreebieListItem(freebieLists);
        setLoading(false);
        return res;
      } catch (e) {
        console.log('e', e);
      } finally {
        setLoading(false);
      }
    };
    return {
      getCartList,
      postCartItem,
    };
  }, []);
  return (
    <CartContext.Provider
      value={{
        cartList: value.cartList,
        setCartList: value.setCartList,
        cartApi,
        cartDetail,
        freebieListItem,
        setFreebieListItem,
      }}>
      {children}
      <LoadingSpinner visible={loading} />
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
