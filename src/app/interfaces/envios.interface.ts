import { IProduct } from "./stock";

export interface IPendingArray {
    data: Array<IPending>;
}

export interface IPending {
    id?: string;
    total?: string;
    address: string;
    agency: string;
    courier: string;
    district: string;
    documentNumber: string;
    fullname: string;
    phone: string;
    reference: string;
    username: string;
    products: Array<IProduct>;
    date?: string;
    email?: string;
}
