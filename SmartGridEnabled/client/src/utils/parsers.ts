import { OfferDTO, SupplyContractDTO } from "../models/models";

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
    } as OfferDTO;
};

export const supplyContractParser = (d: any): SupplyContractDTO => {
    return {
        id: d.id,
        address: d.scAddress,
        buyer: d.buyer,
        seller: d.seller,
        price: Number(d.price),
        amount: Number(d.amount),
        timestamp: Number(d.timestamp) * 1000
    } as SupplyContractDTO;
};
