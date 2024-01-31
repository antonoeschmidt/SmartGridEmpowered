import { ApprovedSupplyContractDTO, OfferDTO, PendingSupplyContractDTO, SupplyContractDTO } from "../models/models";

export const dateFormatter = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("da-DK")} at ${date.toLocaleTimeString(
        "da-DK"
    )}`;
};

export const offerParser = (d: any): OfferDTO => {
    return {
        id: d.id,
        amount: Number(d.amount),
        price: Number(d.price),
        expiration: Number(d.expiration),
        owner: d.owner,
        active: d.active,
        sellerSignature: d.sellerSignature,
        nonce: d.nonce,
    };
};

export const supplyContractParser = (d: any): SupplyContractDTO => {
    return {
        id: d.id,
        address: d.scAddress,
        buyerSignature: d.buyerSignature,
        sellerSignature: d.sellerSignature,
        price: Number(d.price),
        amount: Number(d.amount),
        timestamp: Number(d.timestamp) * 1000,
        nonce: Number(d.nonce),
    };
};

export const pendingOfferParser = (d: any): PendingSupplyContractDTO => {
    return {
        nonce: Number(d.nonce),
        amount: Number(d.amount),
        buyerSignature: d.buyerSignature,
        sellerSignature: d.sellerSignature,
        smartMeterAddress: d.smartMeterAddress,
        timestamp: Number(d.timestamp),
        price: Number(d.price),
    }
};

export const approvedContractParser = (d: any | any[]): ApprovedSupplyContractDTO => {

    return {
        buyerSignature: d.returnValues.buyerSignature,
        sellerSignature: d.returnValues.sellerSignature,
        price: Number(d.returnValues.price),
        amount: Number(d.returnValues.amount),
        timestamp: Number(d.returnValues.timestamp)
    }
}
