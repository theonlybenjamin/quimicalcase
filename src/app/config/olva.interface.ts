export interface Olva {
    general: {
        fecha_envio: string,
        id_envio: string,
        emision: string,
        remito: string,
        remitente: string,
        doc_externo: string,
        consignado: string,
        contenido: string,
        peso: string,
        cantidad: string,
        nombre_estado_tracking: string,
        nombre_estado: string,
        nombre_oficina: string,
        destino: string;
    }
    details: OlvaDetails[]
}
export interface OlvaDetails {
    fecha_creacion: string
    id_rpt_envio_ruta: string,
    nombre_sede: string,
    estado_tracking: string,
    obs: string,
}
