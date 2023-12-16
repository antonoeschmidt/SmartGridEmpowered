import React from "react";
import styles from "./SupplyContractComponent.module.css";
import { SupplyContractDTO } from "../../../models/models";

type SupplyContractComponentProps = {
    supplyContract: SupplyContractDTO;
};

const SupplyContractComponent = ({
    supplyContract,
}: SupplyContractComponentProps) => {
    const timestampToDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        return `Energy bought ${date.toDateString()}`;
    };
    return (
        <div className={styles.card}>
            <div className={styles.lightTextItalic}>
                Supply Contract#{supplyContract.id.slice(0, 7)}
            </div>
            Buyer: {supplyContract.buyerSignature.slice(0, 7)}
            <br />
            Seller: {supplyContract.sellerSignature.slice(0, 7)}
            <img
                className={styles.greenEnergyLogo}
                src="/images/greenEnergyLogo.png"
                alt=""
            />
            <div className={styles.header} style={{ marginTop: "0.7em" }}>
                {supplyContract.amount} kWh
            </div>
            <div className={styles.header} style={{ marginTop: "-0.3em" }}>
                {supplyContract.price} €
            </div>
            <div>
                {(supplyContract.price / supplyContract.amount).toFixed(2)}{" "}
                €/kWh
                <div className={styles.dateString}>
                    {timestampToDateString(supplyContract.timestamp)}
                </div>
            </div>
        </div>
    );
};

export default SupplyContractComponent;
