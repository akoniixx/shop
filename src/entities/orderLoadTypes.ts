export interface DataForOrderLoad { 
    productId: string;
    quantity: number;
    productName: string;
    saleUOMTH: string;
    productImage: string;
    productFreebiesId?: string;
    isFreebie?: boolean;
    baseUnitOfMeaTh?:string
}