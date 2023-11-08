import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import styles from "./MainPage.module.css";
import DrawerComponent from "../../components/Shared/DrawerComponent/DrawerComponent";
import EthereumContext from "../../contexts/ethereumContext";

const MainPage = () => {
    const {
        setMarkets,
        ethereumInstance,
        setSupplyContracts,
        setCurrentMarket,
        currentMarket,
        markets,
        setCableCompanyAddress,
    } = useContext(EthereumContext);

    useEffect(() => {
        const getData = () => {
            ethereumInstance
                .scanBlocksForContractCreations()
                .then(
                    ({
                        marketAddresses,
                        supplyContractAddresses,
                        cableCompanyAddresses,
                    }) => {
                        console.log("Scan completed.");
                        setMarkets(marketAddresses);
                        setSupplyContracts(supplyContractAddresses);
                        console.log("marketAddresses", marketAddresses);
                        console.log(
                            "supplyContractAddresses",
                            supplyContractAddresses
                        );
                        console.log(
                            "cableCompanyAddresses",
                            cableCompanyAddresses
                        );
                        if (cableCompanyAddresses.length > 0) {
                            setCableCompanyAddress(cableCompanyAddresses[0]);
                        }
                    }
                )
                .catch((error) => {
                    console.error("Error:", error);
                });
        };
        return () => getData();
    }, [
        currentMarket,
        ethereumInstance,
        setCableCompanyAddress,
        setMarkets,
        setSupplyContracts,
    ]);

    useEffect(() => {
        if (!currentMarket && markets) setCurrentMarket(markets[0]);
    }, [currentMarket, markets, setCurrentMarket]);

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
