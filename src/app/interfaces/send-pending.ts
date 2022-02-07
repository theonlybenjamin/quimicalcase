import { IProductSelled } from "./stock";

export interface SendPending {
    cliente: string;
    productos: Array<IProductSelled>;
    tipo_entrega: 'contraentrega' | 'olva';
    costo_delivery?: number;
    total?: number;
    capital?: number;
}

export interface SendPendingArray {
    data: Array<SendPending>;
}