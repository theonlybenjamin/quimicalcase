import { IProductSelled } from "./stock";

export interface SendPending {
    cliente: string;
    productos: Array<IProductSelled>;
    tipo_entrega: 'contraentrega' | 'olva';
}

export interface SendPendingArray {
    data: Array<SendPending>;
}