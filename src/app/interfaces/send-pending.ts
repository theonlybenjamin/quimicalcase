import { IProductSelled } from "./stock";

export interface SendPending {
    cliente: string;
    productos: Array<IProductSelled>;
    tipo_entrega: string;
    total?: number;
    capital?: number;
    canal_venta?: string;
}

export interface SendPendingArray {
    data: Array<SendPending>;
}