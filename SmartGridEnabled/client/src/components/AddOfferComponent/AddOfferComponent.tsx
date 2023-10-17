import React, { useContext, useState } from "react";
import styles from "./AddOfferComponent.module.css";
import { Button, TextField } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import { v4 as uuidv4 } from "uuid";
import { Offer } from "../../models/models";

const AddOfferComponent = () => {
    const { ethereumInstance, currentAccount, currentMarket, setOffers } = useContext(EthereumContext);
    const [amount, setAmount] = useState<number>(10)
    const [price, setPrice] = useState<number>(10);

    const addNewOffer = () => {
        if (!currentAccount) {
            alert("Please select an account before creating new offer!");
            return;
        }

        let newOffer: Offer = {
            id: uuidv4(),
            price: price,
            amount: amount,
            expriration: 100000,
            owner: "",
            active: true,
        };
        ethereumInstance.addOffer(newOffer, currentMarket, currentAccount);
    };

    const getOffers = () => {
        ethereumInstance.getOffers(currentMarket).then((data) => {
            console.log(data); 
            setOffers(data);
                })
        .catch((err) => console.log(err));
    }

    return (
        <div className={`${styles.item}`}>
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
                <Button
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => getOffers()}
                >
                    Get offers
                </Button>
            </div>
        </div>
    );
};

export default AddOfferComponent;
