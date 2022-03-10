export interface FinancesDoc {
    ingresos: FinancesIngresos;
    gastos: Array<FinancesGastos>
}

export interface FinancesIngresos {
    monto: number;
    cantidad_ventas: number;
}

export interface FinancesGastos {
    detalle: string;
    monto: number;
    fecha: string;
}