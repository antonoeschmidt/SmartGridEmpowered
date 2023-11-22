import styles from "./AddOfferComponent.module.css";
import { Stack, TextField } from "@mui/material";
import { FC } from "react";

type AddOfferComponentProps = {
    price: number;
    amount: number;
    setPrice: React.Dispatch<React.SetStateAction<number>>;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
}


const AddOfferComponent: FC<AddOfferComponentProps> = ({amount, setAmount, price, setPrice}) => {

    return (
        <div className={`${styles.item}`}>
            <div className={styles.container}>
                <TextField
                    label="Amount (Wh)"
                    variant="outlined"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                />
                <TextField
                    label="Price (€ cents)"
                    variant="outlined"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default AddOfferComponent;
