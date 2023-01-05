import * as React from 'react';
import { ProductType } from '../entities/productEntities';

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
    postCartItem: () => Promise<void>;
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
  const [cartList, setCartList] = React.useState<any[]>([]);
  const value = React.useMemo(() => ({ cartList, setCartList }), [cartList]);
  const cartApi = React.useMemo(() => {
    const getCartList = async () => console.log('getCartList');
    const postCartItem = async () => console.log('postCartItem');
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
