export interface Sale {
    cliente: string;
    productos: Array<ProductSelled>;
    tipo_entrega: string;
    total: number;
    capital: number;
    canal_venta: string;
    payment_type?: string;
}

export interface SaleArray {
    data: Array<Sale>;
}

export interface ProductSelled {
    producto: string;
    precio: number;
    cant: number;
    iphoneCode: string;
}