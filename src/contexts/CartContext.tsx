import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ProductType } from '../entities/productEntities';
import { CartItemType, cartServices } from '../services/CartServices';

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
  setCartList: React.Dispatch<React.SetStateAction<ProductTypeContext[]>>;
}
const CartContext = React.createContext<ContextCart>({
  cartList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},
  cartApi: {
    getCartList: async () => Promise.resolve(),
    postCartItem: async () => Promise.resolve(),
  },
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartList, setCartList] = React.useState<ProductTypeContext[]>([]);
  const [freebieListItem, setFreebieListItem] = React.useState<any>([]);
  const [cartDetail, setCartDetail] = React.useState<any>({});
  const value = React.useMemo(() => ({ cartList, setCartList }), [cartList]);
  const cartApi = React.useMemo(() => {
    const getCartList = async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const user = await AsyncStorage.getItem('user');
      const userObj = JSON.parse(user || '{}');

      const res = await cartServices.getCartList({
        userShopId: userObj.userShopId,
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
      });
      setCartDetail(res);
      console.log('res', JSON.stringify(res, null, 2));
    };
    const postCartItem = async (cl: ProductTypeContext[]) => {
      try {
        const company = await AsyncStorage.getItem('company');

        const user = await AsyncStorage.getItem('user');
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        const parseUser = JSON.parse(user || '{}');
        console.log(JSON.stringify(cl, null, 2));
        const orderProducts = cl.map(el => {
          return {
            ...el,
            specialRequest: 0,
          };
        });
        const payload: CartItemType = {
          company: company ? company : 'ICPI',
          orderProducts,
          userShopId: parseUser.userShopId || '',
          isUseCod: false,
          paymentMethod: 'CREDIT',
          customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
        };
        const res = await cartServices.postCart(payload);
        console.log('res', JSON.stringify(res, null, 2));
      } catch (e) {
        console.log('e', e);
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
