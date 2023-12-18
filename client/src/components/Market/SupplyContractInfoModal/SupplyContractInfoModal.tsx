import React from "react";

import styles from "./SupplyContractInfoModal.module.css";
import { Dialog, DialogTitle, TextField } from "@mui/material";
import { SupplyContractDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

type SupplyContractInfoModalProps = {
    supplyContract: SupplyContractDTO;
    open: boolean;
    handleClose: () => void;
    verifySupplyContract: (supplyContract: SupplyContractDTO) => void;
    revealIdentities: (supplyContract: SupplyContractDTO) => void;
};

const SupplyContractInfoModal = ({
    supplyContract,
    open,
    handleClose,
    verifySupplyContract,
    revealIdentities,
}: SupplyContractInfoModalProps) => {
    const timestampToDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        return `Energy bought ${date.toDateString()}`;
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Contract Info</DialogTitle>
            {supplyContract && (
                <div className={styles.container}>
                    <div className={styles.top}>
                        <div>Nonce: {supplyContract.nonce}</div>
                        <span>
                            Supply Contract #{supplyContract.id.slice(0, 7)}
                        </span>
                        <div className={styles.dateString}>
                            {timestampToDateString(supplyContract.timestamp)}
                        </div>
                        <div className={styles.signature}>
                            <h4 className={styles.h4}>Buyer signature</h4>
                            <TextField
                                id="outlined-multiline-flexible"
                                multiline
                                maxRows={4}
                                value={supplyContract.buyerSignature}
                            />
                        </div>
                        <div className={styles.signature}>
                            <h4 className={styles.h4}>Seller signature</h4>
                            <TextField
                                id="outlined-multiline-flexible"
                                multiline
                                maxRows={4}
                                value={supplyContract.sellerSignature}
                            />
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.largeText}>
                            {supplyContract.amount} kWh
                        </div>
                        <div className={styles.largeText}>
                            {supplyContract.price} €
                        </div>
                        <div>
                            <Button
                                text="Reveal"
                                onClick={() => revealIdentities(supplyContract)}
                                sx={{ width: "10em", marginTop: "2em" }}
                            />
                        </div>
                        <div>
                            <Button
                                text="Verify"
                                onClick={() =>
                                    verifySupplyContract(supplyContract)
                                }
                                sx={{
                                    width: "10em",
                                    marginTop: "2em",
                                    backgroundColor: "#32ba37",
                                    "&:hover": {
                                        backgroundColor: "#155417",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default SupplyContractInfoModal;
