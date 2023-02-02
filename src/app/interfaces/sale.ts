import { IProduct } from "./stock";

export interface Sale {
    client?: string;
    products: Array<IProduct>;
    total: number;
    sale_channel: string;
    payment_type: string;
    date: string;
}

export interface SaleArray {
    data: Array<Sale>;
}
