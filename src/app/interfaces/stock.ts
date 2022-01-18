
export interface Stock {
    data: Array<StockProduct>;
    docId?: string
}

export interface Stock2 {
    data: Array<StockProduct2>;
    docId?: string
}
export interface StockProduct {
    producto: string;
    precio: string;
    cant: number;
    iphoneCode?: string
}
export interface StockProduct2 {
    producto: string;
    precio: string;
    cant: number;
    iphoneCode: string
}

export interface IPhone {
    id: string;
    name: string;
}
export interface IProductSelled {
    code: string;
    model: string;
    index: number;
}