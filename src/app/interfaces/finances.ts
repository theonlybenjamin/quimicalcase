export interface FinancesDoc {
    gastos: Array<FinancesGastos>
}

export interface FinancesGastos {
    detalle: string;
    monto: number;
    fecha: string;
}