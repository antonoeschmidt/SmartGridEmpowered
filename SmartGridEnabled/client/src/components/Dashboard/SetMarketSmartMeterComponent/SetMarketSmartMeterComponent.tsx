import React, { useContext } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./SetMarketSmartMeterComponent.module.css";
import Button from "../../Shared/Button/Button";

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
                    onClick={() => setMarketAddressSmartMeter()}
                    text="Set Market Address"
                />
            </div>
        </div>
    );
};

export default SetMarketSmartMeterComponent;
