import React, { useContext, useState } from "react";
import styles from "./AddOfferComponent.module.css";
import { Button, TextField } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import { v4 as uuidv4 } from "uuid";
import { OfferDTO } from "../../models/models";

const AddOfferComponent = () => {
    const { ethereumInstance, currentAccount, currentMarket, setOffers } =
        useContext(EthereumContext);
    const [amount, setAmount] = useState<number>();
    const [price, setPrice] = useState<number>();

    const addNewOffer = () => {
        if (!currentAccount) {
            alert("Please select an account before creating new offer!");
            return;
        }

        if (!(amount >= 1 || price >= 1)) {
            alert("Amount and price must have a value")
            return
        }

        let newOffer: OfferDTO = {
            id: uuidv4(),
            price: price,
            amount: amount,
            expriration: Date.now() + (24 * 60 * 60 * 1000), // 24 hours in ms
            owner: currentAccount,
            active: true,
        };
        ethereumInstance
            .addOffer(newOffer, currentMarket, currentAccount)
            .then((offer) => {
                console.log(offer);
                setOffers((prev) => [...prev, newOffer]);
            });
    };

    return (
        <div className={`${styles.item}`}>
            <h3>Add new offer</h3>
            <div className={styles.container}>
                <TextField
                    label="Amount (Wh)"
                    variant="outlined"
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                />
                <TextField
                    label="Price (€ cents)"
                    variant="outlined"
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => addNewOffer()}
                >
                    New Offer
                </Button>
            </div>
        </div>
    );
};

export default AddOfferComponent;
