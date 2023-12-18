import React from "react";
import styles from "./SupplyContractComponent.module.css";
import { SupplyContractDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

type SupplyContractComponentProps = {
    supplyContract: SupplyContractDTO;
    handleShowClick: () => void;
};

const SupplyContractComponent = ({
    supplyContract,
    handleShowClick,
}: SupplyContractComponentProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <div>
                    <div className={styles.lightTextItalic}>
                        Supply Contract#{supplyContract.id.slice(0, 7)}
                    </div>
                    Buyer: {supplyContract.buyerSignature.slice(0, 7)}
                    <br />
                    Seller: {supplyContract.sellerSignature.slice(0, 7)}
                </div>
                <img
                    className={styles.greenEnergyLogo}
                    src="/images/greenEnergyLogo.png"
                    alt=""
                />
            </div>
            <div className={styles.header} style={{ marginTop: "0.7em" }}>
                {supplyContract.amount} kWh
            </div>
            <div className={styles.header} style={{ marginTop: "-0.3em" }}>
                {supplyContract.price} €
            </div>
            <div>
                {(supplyContract.price / supplyContract.amount).toFixed(2)}{" "}
                €/kWh
                <div className={styles.button}>
                    <Button
                        text="Show info"
                        onClick={() => handleShowClick()}
                        sx={{ width: "10em", marginTop: "2em" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SupplyContractComponent;
