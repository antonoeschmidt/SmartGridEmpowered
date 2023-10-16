import React from "react";
import styles from "./HomePage.module.css";
import PickAccountsComponent from "../../components/PickAccountsComponent/PickAccountsComponent";
import PickMarketComponent from "../../components/PickMarketComponent/PickMarketComponent";
import ManageMarketsComponent from "../../components/ManageMarketsComponent/ManageMarketsComponent";

const HomePage = () => {
    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>
            <div className={styles.row}>
                <PickAccountsComponent />
            </div>
            <div className={styles.row}>
                <PickMarketComponent />
            </div>
            <div className={styles.row}>
                <ManageMarketsComponent />
            </div>
        </div>
    );
};

export default HomePage;
