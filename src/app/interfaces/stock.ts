
export interface Stock {
    data: Array<IProduct>;
    docId?: string
}

export interface IProduct {
    name: string;
    sell_price: number;
    buy_price: number;
    cant: number;
    code: string;
}

export interface IFirebaseDocument {
    id: string;
    name: string;
}
