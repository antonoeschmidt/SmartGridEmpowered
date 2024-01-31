import React, { useContext } from "react";

import styles from "./SupplyContractInfoModal.module.css";
import { Dialog, DialogTitle, TextField } from "@mui/material";
import { ApprovedSupplyContractDTO, PendingSupplyContractDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";
import EthereumContext from "../../../contexts/ethereumContext";

type SupplyContractInfoModalProps = {
    currentItem: ApprovedSupplyContractDTO | PendingSupplyContractDTO;
    open: boolean;
    handleClose: () => void;
    verifyPendingOffer: (pendingOffer: PendingSupplyContractDTO) => void;
    revealIdentities: (approvedContract: ApprovedSupplyContractDTO) => void;
};

const SupplyContractInfoModal = ({
    currentItem,
    open,
    handleClose,
    verifyPendingOffer,
    revealIdentities,
}: SupplyContractInfoModalProps) => {
    const timestampToDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        return `Energy bought ${date.toDateString()}`;
    };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Contract Info</DialogTitle>
            {currentItem && (
                <div className={styles.container}>
                    <div className={styles.top}>
                        {'nonce' in currentItem &&
                        <div>Nonce: {currentItem.nonce}</div>
                        }
                        {/* <span>
                            Supply Contract #{currentItem.id.slice(0, 7)}
                        </span> */}
                        <div className={styles.dateString}>
                            {timestampToDateString(currentItem.timestamp)}
                        </div>
                        <div className={styles.signature}>
                            <h4 className={styles.h4}>Buyer signature</h4>
                            <TextField
                                id="outlined-multiline-flexible"
                                multiline
                                maxRows={4}
                                value={currentItem.buyerSignature}
                            />
                        </div>
                        <div className={styles.signature}>
                            <h4 className={styles.h4}>Seller signature</h4>
                            <TextField
                                id="outlined-multiline-flexible"
                                multiline
                                maxRows={4}
                                value={currentItem.sellerSignature}
                            />
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.largeText}>
                            {currentItem.amount} kWh
                        </div>
                        <div className={styles.largeText}>
                            {currentItem.price} €
                        </div>
                        <div>
                            <Button
                                text="Reveal"
                                onClick={() => revealIdentities(currentItem)}
                                sx={{ width: "10em", marginTop: "2em" }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default SupplyContractInfoModal;
