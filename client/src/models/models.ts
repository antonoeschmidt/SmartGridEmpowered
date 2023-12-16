export type OfferDTO = {
    id: string;
    price: number;
    expiration: number;
    amount: number;
    owner: string;
    active: boolean;
    sellerSignature: string;
};

export interface SupplyContractDTO {
    id: string;
    address: string;
    buyerSignature: string;
    sellerSignature: string;
    amount: number;
    price: number;
    timestamp: number;
}
