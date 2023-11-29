import React from "react";
import styles from "./OfferComponent.module.css";
import { OfferDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

type Props = {
    offer: OfferDTO;
    ownOffer?: boolean;
    onClickButton: (id: string) => any;
};

const OfferComponent = ({ offer, ownOffer, onClickButton }: Props) => {
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
            <div className={styles.lightTextItalic}>
                Offer#{offer.id.slice(0, 7)}
            </div>
            {ownOffer ? (
                <>
                    {" "}
                    <br />
                </>
            ) : (
                <> Seller: {offer.owner.slice(0, 7)}</>
            )}
            <div className={styles.header} style={{ marginTop: "0.7em" }}>
                {offer.amount} kWh
            </div>
            <div className={styles.header} style={{ marginTop: "-0.3em" }}>
                {offer.price} €
            </div>
            <div>
                {(offer.price / offer.amount).toFixed(2)} €/kWh <br />
                {expirationToHours(offer.expiration)}
            </div>
            <div className={styles.button}>
                {ownOffer ? (
                    <Button
                        text="Remove"
                        onClick={() => onClickButton(offer.id)}
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
                        onClick={() => onClickButton(offer.id)}
                        sx={{ width: "10em", marginTop: "2em" }}
                    />
                )}
            </div>
        </div>
    );
};

export default OfferComponent;
