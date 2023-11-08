import React, { useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./ManageSmartMeterComponent.module.css";

const ManageSmartMeterComponent = () => {
    const {
        ethereumInstance,
        currentAccount,
        setSmartMeterAddress,
        smartMeterAddress,
    } = useContext(EthereumContext);

    const [newSmartMeterCreated, setNewSmartMeterCreated] = useState(false);

    const newSmartMeter = async () => {
        if (!currentAccount) return;
        let address = await ethereumInstance.deploySmartMeter(currentAccount);
        setNewSmartMeterCreated(true);
        setSmartMeterAddress(address);
        console.log(address);
    };

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Smart Meter</h3>
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => newSmartMeter()}
                >
                    New Smart Meter
                </Button>
            </div>
            <TextField
                variant="outlined"
                placeholder="Set smart meter address"
                onChange={(e) => setSmartMeterAddress(e.target.value)}
            ></TextField>
            {newSmartMeterCreated && (
                <>
                    <p className="light-text">New Smart Meter created!</p>
                </>
            )}
            {smartMeterAddress && (
                <p className="light-text">
                    Current Smart Meter:
                    <br />
                    {smartMeterAddress}
                </p>
            )}
        </div>
    );
};

export default ManageSmartMeterComponent;
