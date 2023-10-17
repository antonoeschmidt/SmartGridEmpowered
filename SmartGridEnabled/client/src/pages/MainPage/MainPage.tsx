import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import styles from "./MainPage.module.css";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import EthereumContext from "../../contexts/ethereumContext";

const MainPage = () => {
    const { setMarkets, ethereumInstance, markets, setSupplyContracts, setCurrentMarket } =
        useContext(EthereumContext);

    useEffect(() => {
        if (markets) return;

        ethereumInstance
            .scanBlocksForContractCreations()
            .then(({marketAddresses, supplyContractAddresses}) => {
                console.log("Scan completed.");
                setMarkets(marketAddresses);
                setSupplyContracts(supplyContractAddresses);
                if (marketAddresses.length > 0) {
                    setCurrentMarket(marketAddresses[0]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [ethereumInstance, markets, setMarkets, setSupplyContracts]);

    return (
        <div className={styles.container}>
            <DrawerComponent />

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default MainPage;
