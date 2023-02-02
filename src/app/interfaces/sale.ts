import { IProduct } from "./stock";

export interface Sale {
    cliente?: string;
    products: Array<IProduct>;
    tipo_entrega: string;
    total: number;
    canal_venta?: string;
    payment_type?: string;
    date?: string;
}

export interface SaleArray {
    data: Array<Sale>;
}
