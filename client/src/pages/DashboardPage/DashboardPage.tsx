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

type DashboardItemProps = {
    title: string;
    content: JSX.Element;
};

const DashboardItem = ({ title, content }: DashboardItemProps) => {
    return (
        <div className={styles.item}>
            <div className={styles.title}>{title}</div>
            <hr />
            <div className={styles.itemContent}>{content}</div>
        </div>
    );
};

const DashboardPage = () => {
    return (
        <div className={styles.container}>
            <h1>Settings</h1>
            <div className={styles.content}>
                <div className={styles.col}>
                    <h3>Accounts</h3>
                    <DashboardItem
                        title="Choose user"
                        content={<PickAccountsComponent type="user" onboarding={false} />}
                    />
                    <DashboardItem
                        title="Choose admin"
                        content={<PickAccountsComponent type="admin" onboarding={false} />}
                    />
                </div>
                <div className={styles.col}>
                    <h3>Markets</h3>
                    <DashboardItem
                        title="Manage markets"
                        content={<ManageMarketsComponent />}
                    />
                    <DashboardItem
                        title="Choose Market"
                        content={<PickMarketComponent />}
                    />
                </div>
                <div className={styles.col}>
                    <h3>Cable Company</h3>
                    <DashboardItem
                        title="Cable Company"
                        content={<CableCompanyComponent />}
                    />
                    <DashboardItem
                        title="Smart Meter"
                        content={<ManageSmartMeterComponent />}
                    />
                    <DashboardItem
                        title="Register Smart Meter"
                        content={<RegisterSmartMeterComponent />}
                    />
                    <DashboardItem
                        title="Check registration"
                        content={<IsRegisteredSmartMeterComponent />}
                    />
                    <DashboardItem
                        title="Set Market Address Smart Meter"
                        content={<SetMarketSmartMeterComponent />}
                    />

                    <div />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
