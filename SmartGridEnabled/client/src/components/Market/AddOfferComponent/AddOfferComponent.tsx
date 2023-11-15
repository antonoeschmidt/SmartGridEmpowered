import React, { useContext } from "react";
import styles from "./AddOfferComponent.module.css";
import { TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import { v4 as uuidv4 } from "uuid";
import { OfferDTO } from "../../../models/models";
import Button from "../../Shared/Button/Button";

type Props = {
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    price: number;
    setPrice: React.Dispatch<React.SetStateAction<number>>;
};

const AddOfferComponent = ({ amount, setAmount, price, setPrice }: Props) => {
    const { currentAccount, setOffers, addOffer } = useContext(EthereumContext);

    const addNewOffer = () => {
        if (!currentAccount) {
            alert("Please select an account before creating new offer!");
            return;
        }

        if (!(amount >= 1 || price >= 1)) {
            alert("Amount and price must have a value");
            return;
        }

        let newOffer: OfferDTO = {
            id: uuidv4(),
            price: price,
            amount: amount,
            expiration: Date.now() + 24 * 60 * 60 * 1000, // 24 hours in ms
            owner: currentAccount,
            active: true,
        };

        addOffer(newOffer).then((offer) => {
            if (!offer) {
                alert("Not enough stored energy to make offer");
                return;
            }
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
                <Button onClick={() => addNewOffer()} text="New Offer" />
            </div>
        </div>
    );
};

export default AddOfferComponent;
