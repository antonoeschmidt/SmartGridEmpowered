import { Offer } from "../models/models";

export const dateFormatter = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("da-DK")} at ${date.toLocaleTimeString(
        "da-DK"
    )}`;
};

export const offerParser = (d: any): Offer => {
    return {
        id: d.id,
        amount: Number(d.kWh),
        price: Number(d.price),
        expriration: Number(d.expirationTime),
        owner: d.owner,
        active: d.active,
    } as Offer;
};
