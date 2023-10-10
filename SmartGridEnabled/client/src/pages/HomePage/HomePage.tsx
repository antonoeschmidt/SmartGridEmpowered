import React from "react";
import styles from "./HomePage.module.css";
import PickAccountsComponent from "../../components/PickAccountsComponent/PickAccountsComponent";

const HomePage = () => {
    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>
            <div className={styles.row}>
                <PickAccountsComponent />
                <div className={styles.item}><p>Current usage</p></div>
            </div>
        </div>
    );
};

export default HomePage;
