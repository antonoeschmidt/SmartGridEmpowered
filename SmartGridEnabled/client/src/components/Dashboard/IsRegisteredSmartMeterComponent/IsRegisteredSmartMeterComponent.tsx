import React, { useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./IsRegisteredSmartMeterComponent.module.css";

const IsRegisteredSmartMeterComponent = () => {
    const { currentAccount, isRegisteredKey } = useContext(EthereumContext);

    const [smartMeterPubKey, setSmartMeterPubKey] = useState<string>();
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>();

    const isKeyRegistered = async () => {
        if (!currentAccount) return;
        let res = await isRegisteredKey(smartMeterPubKey, smartMeterAddress);
        console.log(res);
    };

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Check registration</h3>
            <TextField
                id="outlined-basic"
                label="Public Key"
                variant="outlined"
                onChange={(e) => setSmartMeterPubKey(e.target.value)}
            />
            <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                onChange={(e) => setSmartMeterAddress(e.target.value)}
            />
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => isKeyRegistered()}
                >
                    Check registration
                </Button>
            </div>
        </div>
    );
};

export default IsRegisteredSmartMeterComponent;
