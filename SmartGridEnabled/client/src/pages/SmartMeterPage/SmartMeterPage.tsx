import React from "react";
import styles from "./SmartMeterPage.module.css";

const SmartMeterPage = () => {
    return (
        <div className={styles.container}>
            <h1>Smart Meter</h1>
            <div className={styles.row}>
                <div className={styles.item} style={{flexGrow: 1}}>hej</div>
                <div className={styles.item}>hej</div>
            </div>
        </div>
    );
};

export default SmartMeterPage;
