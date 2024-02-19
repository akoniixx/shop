import React, { useState } from "react";
import { DataForOrderLoad } from "../entities/orderLoadTypes";

interface Props {
    children: JSX.Element;
  }
interface ContextOrderLoads{
    dataForLoad:DataForOrderLoad[]
    setDataForLoad:React.Dispatch<React.SetStateAction<any>>
    headData:DataForOrderLoad[]
    setHeadData:React.Dispatch<React.SetStateAction<any>>;
   
}

const OrderLoadsContext = React.createContext<ContextOrderLoads>({
    dataForLoad: [],
    setDataForLoad: ()=> {},
    headData:[],
    setHeadData:()=>{}
  });

export const OrderLoadsProvider: React.FC<Props> = ({ children }) => {
    const [dataForLoad,setDataForLoad] = useState<DataForOrderLoad[]>([])
    const [headData,setHeadData] = useState<DataForOrderLoad[]>([])

    



    return (
        <OrderLoadsContext.Provider
          value={{
            dataForLoad: dataForLoad,
            setDataForLoad: setDataForLoad,
            headData:headData,
            setHeadData:setHeadData,
          }}>
          {children}
        </OrderLoadsContext.Provider>
      );
}

export const useOrderLoads = () => {
    const context = React.useContext(OrderLoadsContext);
    if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  };