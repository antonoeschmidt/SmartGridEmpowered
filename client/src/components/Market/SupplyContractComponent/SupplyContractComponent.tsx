import React from "react";
import styles from "./SupplyContractComponent.module.css";
import { ApprovedContractDTO, PendingOfferDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

type SupplyContractComponentProps = {
    item: PendingOfferDTO | ApprovedContractDTO;
    handleShowClick: () => void;
};

const SupplyContractComponent = ({
    item,
    handleShowClick,
}: SupplyContractComponentProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <div>
                    {/* <div className={styles.lightTextItalic}>
                        Supply Contract#{item.id.slice(0, 7)}
                    </div> */}
                    Buyer: {item.buyerSignature.slice(0, 7)}
                    <br />
                    Seller: {item.sellerSignature.slice(0, 7)}
                </div>
                <img
                    className={styles.greenEnergyLogo}
                    src="/images/greenEnergyLogo.png"
                    alt=""
                />
            </div>
            <div className={styles.header} style={{ marginTop: "0.7em" }}>
                {item.amount} kWh
            </div>
            <div className={styles.header} style={{ marginTop: "-0.3em" }}>
                {item.price} €
            </div>
            <div>
                {(item.price / item.amount).toFixed(2)}{" "}
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
