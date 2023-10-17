import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import styles from "./ManageMarketsComponent.module.css";

const ManageMarketsComponent = () => {
    const {
        ethereumInstance,
        currentAccount,
        setCurrentMarket,
        setMarkets,
        markets,
    } = useContext(EthereumContext);

    const [newMarketCreated, setNewMarketCreated] = useState(false);

    const newMarketClick = async () => {
        let marketAddress = await ethereumInstance.deployMarket(currentAccount);
        setNewMarketCreated(true);
        setCurrentMarket(marketAddress);
        setMarkets(markets ? [...markets, marketAddress] : [marketAddress])
    };

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Manage markets</h3>
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => newMarketClick()}
                >
                    New Market
                </Button>

            </div>
            {newMarketCreated && (
                <p className="light-text">New market created!</p>
            )}
        </div>
    );
};

export default ManageMarketsComponent;
