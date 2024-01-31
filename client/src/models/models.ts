export type OfferDTO = {
    id: string;
    price: number;
    expiration: number;
    amount: number;
    owner: string;
    active: boolean;
    sellerSignature: string;
    nonce: number;
};

export interface SupplyContractDTO {
    id: string;
    address: string;
    buyerSignature: string;
    sellerSignature: string;
    amount: number;
    price: number;
    timestamp: number;
    nonce: number;
}

export interface PendingSupplyContractDTO {
    buyerSignature: string;
    sellerSignature: string;
    smartMeterAddress: string;
    amount: number;
    price: number;
    timestamp: number;
    nonce: number;
}

export interface ApprovedSupplyContractDTO {
    buyerSignature: string;
    sellerSignature: string;
    price: number;
    amount: number;
    timestamp: number;
    // id: string; //transaction hash.
}