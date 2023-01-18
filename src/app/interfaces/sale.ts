export interface Sale {
    cliente?: string;
    products: Array<ProductSelled>;
    tipo_entrega: string;
    total: number;
    canal_venta?: string;
    payment_type?: string;
    date?: string;
}

export interface SaleArray {
    data: Array<Sale>;
}

export interface ProductSelled {
    name: string;
    sell_price: number;
    cant: number;
    code: string;
    selectedQuantity?: number;
    buy_price: number;
}
