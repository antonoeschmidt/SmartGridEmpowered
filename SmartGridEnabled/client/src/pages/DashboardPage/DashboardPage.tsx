import React from "react";
import styles from "./DashboardPage.module.css";
import PickAccountsComponent from "../../components/PickAccountsComponent/PickAccountsComponent";
import PickMarketComponent from "../../components/PickMarketComponent/PickMarketComponent";
import ManageMarketsComponent from "../../components/ManageMarketsComponent/ManageMarketsComponent";

const DashboardPage = () => {
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

export default DashboardPage;
