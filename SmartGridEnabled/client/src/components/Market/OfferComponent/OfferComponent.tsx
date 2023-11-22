import React from "react";
import styles from "./OfferComponent.module.css";
import { OfferDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

type Props = {
    offer: OfferDTO;
    ownOffer?: boolean;
};

const OfferComponent = ({ offer, ownOffer }: Props) => {
    const expirationToHours = (timestamp: number) => {
        const date = new Date(timestamp);
        if (date.getTime() < Date.now()) {
            return "Expired";
        }
        const hours = date.getHours();
        const mins = date.getMinutes();
        return `Expires in ${hours}h ${mins}m`;
    };

    return (
        <div className={styles.card}>
            <div className={styles.lightTextItalic}>Offer#{offer.id}</div>
            {ownOffer ? (
                <>
                    {" "}
                    <br />
                </>
            ) : (
                <> Seller: {offer.owner}</>
            )}
            <div className={styles.header} style={{ marginTop: "0.7em" }}>
                {offer.amount} kWh
            </div>
            <div className={styles.header} style={{ marginTop: "-0.3em" }}>
                {offer.price} €
            </div>
            <div>
                {(offer.amount / offer.price).toFixed(2)} €/kWh <br />
                {expirationToHours(offer.expiration)}
            </div>
            <div className={styles.button}>
                {ownOffer ? (
                    <Button
                        text="Remove"
                        onClick={() => {}}
                        sx={{
                            width: "10em",
                            marginTop: "2em",
                            backgroundColor: "red",
                            "&:hover": {
                                backgroundColor: "#880b0b",
                            },
                        }}
                    />
                ) : (
                    <Button
                        text="Buy"
                        onClick={() => {}}
                        sx={{ width: "10em", marginTop: "2em" }}
                    />
                )}
            </div>
        </div>
    );
};

export default OfferComponent;

// id: string;
// price: number;
// expiration: number;
// amount: number;
// owner: string;
// active: boolean;
