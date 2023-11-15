import React, { useContext, useState } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./ManageMarketsComponent.module.css";
import Button from "../../Shared/Button/Button";

const ManageMarketsComponent = () => {
    const {
        currentAccount,
        setCurrentMarket,
        setMarkets,
        markets,
        deployMarket,
    } = useContext(EthereumContext);

    const [newMarketCreated, setNewMarketCreated] = useState(false);

    const newMarket = async () => {
        if (!currentAccount) {
            alert("No account or cable company selected");
            return;
        }
        let marketAddress = await deployMarket();
        setNewMarketCreated(true);
        setCurrentMarket(marketAddress);
        setMarkets(markets ? [...markets, marketAddress] : [marketAddress]);
    };

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Manage markets</h3>
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    onClick={() => newMarket()}
                    text={"New Market"}
                />
            </div>
            {newMarketCreated && (
                <p className="light-text">New market created!</p>
            )}
        </div>
    );
};

export default ManageMarketsComponent;
