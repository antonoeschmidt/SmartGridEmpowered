import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
} from "@mui/material";
import AddOfferComponent from "../AddOfferComponent/AddOfferComponent";
import { FC, useContext, useState } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import { v4 as uuidv4 } from "uuid";
import { OfferDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

import ToastContext from "../../../contexts/toastContext";
import { sign } from "../../../apis/groupSignature";

type OfferModalProps = {
    open: boolean;
    handleClose: () => void;
};

export const OfferModal: FC<OfferModalProps> = ({ open, handleClose }) => {
    const {
        currentAccount,
        setOffers,
        addOffer,
        currentAccountSignature,
        newSignatureDialog,
    } = useContext(EthereumContext);

    const [price, setPrice] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);

    const { setToastProps, onOpen } = useContext(ToastContext);

    const onSubmit = async () => {
        if (!currentAccount) {
            alert("Please select an account before creating new offer!");
            return;
        }

        if (!(amount >= 1 || price >= 1)) {
            alert("Amount and price must have a value");
            return;
        }
        let signature = currentAccountSignature;
        if (!signature) {
            signature = newSignatureDialog();
            if (!signature) {
                return;
            }
        }

        const randomNonce = Math.floor(Math.random() * 1000000000);

        // Seller signs offer
        const sellerSignature = await sign(
            JSON.stringify({
                amount: amount,
                price: price,
                nonce: randomNonce,
            }),
            signature
        );

        const newOffer: OfferDTO = {
            id: uuidv4(),
            price: price,
            amount: amount,
            expiration: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days in ms
            owner: currentAccount,
            active: true,
            sellerSignature: sellerSignature,
            nonce: randomNonce,
        };

        addOffer(newOffer).then((offer) => {
            if (!offer) {
                setToastProps(
                    "Not enough stored energy to make offer",
                    "error"
                );
                onOpen();
                return;
            }
            setToastProps("Offer was created!", "success");
            onOpen();
            setOffers((prev) => [...prev, offer]);
            handleClose();
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={"sm"}>
            <DialogTitle>Add offer</DialogTitle>
            <DialogContent sx={{ paddingBottom: "0" }}>
                <DialogContentText>
                    To add an offer, fill out the form
                </DialogContentText>
                <Box width="25em" sx={{ display: "flex" }}>
                    <AddOfferComponent
                        price={price}
                        setPrice={setPrice}
                        amount={amount}
                        setAmount={setAmount}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                    text="Cancel"
                    onClick={handleClose}
                    sx={{
                        backgroundColor: "red",
                        "&:hover": {
                            backgroundColor: "#880b0b",
                        },
                    }}
                />
                <Button text="Add offer" onClick={() => onSubmit()} />
            </DialogActions>
        </Dialog>
    );
};
