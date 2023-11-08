import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./ManageMarketsComponent.module.css";

const ManageMarketsComponent = () => {
    const {
        ethereumInstance,
        currentAccount,
        setCurrentMarket,
        setMarkets,
        markets,
        // cableCompanyAddress
    } = useContext(EthereumContext);

    const [newMarketCreated, setNewMarketCreated] = useState(false);

    const newMarket = (async () => {
        if (!currentAccount) {
            alert("No account or cable company selected")
            return;
        }
        let marketAddress = await ethereumInstance.deployMarket(currentAccount, "0xb82E6d77223F480EAd1345b5D93Bb9e71B452a55");
        setNewMarketCreated(true);
        setCurrentMarket(marketAddress);
        setMarkets(markets ? [...markets, marketAddress] : [marketAddress]);
    });

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Manage markets</h3>
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => newMarket()}
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
