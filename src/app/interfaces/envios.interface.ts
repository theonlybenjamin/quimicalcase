export interface IPendingArray {
    data: Array<IPending>;
}

export interface IPending {
    address: string;
    agency: string;
    courier: string;
    district: string;
    documentNumber: string;
    fullname: string;
    phone: string;
    reference: string;
    username: string;
}