import React from "react";
import styles from "./DashboardPage.module.css";
import PickAccountsComponent from "../../components/Dashboard/PickAccountsComponent/PickAccountsComponent";
import PickMarketComponent from "../../components/Dashboard/PickMarketComponent/PickMarketComponent";
import ManageMarketsComponent from "../../components/Dashboard/ManageMarketsComponent/ManageMarketsComponent";
import CableCompanyComponent from "../../components/Dashboard/CableCompanyComponent/CableCompanyComponent";
import ManageSmartMeterComponent from "../../components/Dashboard/ManageSmartMeterComponent/ManageSmartMeterComponent";
import RegisterSmartMeterComponent from "../../components/Dashboard/RegisterSmartMeterComponent/RegisterSmartMeterComponent";
import IsRegisteredSmartMeterComponent from "../../components/Dashboard/IsRegisteredSmartMeterComponent/IsRegisteredSmartMeterComponent";
import SetMarketSmartMeterComponent from "../../components/Dashboard/SetMarketSmartMeterComponent/SetMarketSmartMeterComponent";

const DashboardPage = () => {
    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>
            <div className={styles.row}>
                <PickAccountsComponent />
            </div>
            <div className={styles.row}>
                <CableCompanyComponent />
            </div>
            <div className={styles.row}>
                <ManageSmartMeterComponent />
            </div>
            <div className={styles.row}>
                <RegisterSmartMeterComponent />
            </div>
            <div className={styles.row}>
                <ManageMarketsComponent />
            </div>
            <div className={styles.row}>
                <PickMarketComponent />
            </div>
            <div className={styles.row}>
                <IsRegisteredSmartMeterComponent />
            </div>
            <div className={styles.row}>
                <SetMarketSmartMeterComponent />
            </div>

        </div>
    );
};

export default DashboardPage;
