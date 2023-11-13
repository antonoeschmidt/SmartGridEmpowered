import React, { useContext } from "react";
import { Button } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./SetMarketSmartMeterComponent.module.css";

const SetMarketSmartMeterComponent = () => {
    const { currentAccount, currentMarket, setSmartMeterMarketAddress } =
        useContext(EthereumContext);

    const setMarketAddressSmartMeter = async () => {
        if (!currentAccount || !currentMarket) return;
        let res = await setSmartMeterMarketAddress();
        console.log(res);
    };

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Set Market Address Smart Meter</h3>
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => setMarketAddressSmartMeter()}
                >
                    Set Market Address
                </Button>
            </div>
        </div>
    );
};

export default SetMarketSmartMeterComponent;
