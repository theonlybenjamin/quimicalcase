
export interface Stock {
    data: Array<Product>;
    docId?: string
}

export interface Product {
    producto: string;
    precio: number;
    cant: number;
    iphoneCode?: string;
}

export interface ProductForm {
    model: string;
    precio: number;
    cant: number;
    code: string;
}

export interface IPhone {
    id: string;
    name: string;
}
