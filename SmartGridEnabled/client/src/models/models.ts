export type OfferDTO = {
    id: string;
    price: number;
    expiration: number;
    amount: number;
    owner: string;
    active: boolean;
}

export interface SupplyContractDTO {
    id: string
    address: string;
    buyer: string;
    seller: string;
    amount: number;
    price: number;
    timestamp: number
}