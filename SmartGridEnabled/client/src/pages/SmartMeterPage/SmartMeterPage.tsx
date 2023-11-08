import React, { useContext, useState } from "react";
import styles from "./SmartMeterPage.module.css";
import { Button, TextField } from "@mui/material";
import { createLog, getBatteryCharge } from "../../utils/smartMeterApi";
import EthereumContext from "../../contexts/ethereumContext";

const SmartMeterPage = () => {
    const [consumption, setConsumption] = useState<number>()
    const [production, setProduction] = useState<number>()

    const { currentAccount, smartMeterAddress } = useContext(EthereumContext);
    
    const createLogClick = async () => {
        if (!consumption || !production || !smartMeterAddress) {
            alert("No energy data or smart meter selected")
            return;
        } 
        let res = await createLog(currentAccount, smartMeterAddress, consumption, production)
        console.log(res);
    };

    const getBatteryLevel = async () => {
        let batteryLevel = await getBatteryCharge(smartMeterAddress);
        console.log(batteryLevel);
        
    };

    return (
        <div className={styles.container}>
            <h1>Smart Meter</h1>
            <div className={styles.row}>
                <div className={styles.item}>
                    <h3>Simulate power generation</h3>
                    <TextField
                        variant="outlined"
                        label="Consumption"
                        onChange={(e) => setConsumption(parseInt(e.target.value))}
                    ></TextField>
                    <TextField
                        variant="outlined"
                        label="Production"
                        onChange={(e) => setProduction(parseInt(e.target.value))}
                    ></TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ maxHeight: "3em" }}
                        onClick={() => createLogClick()}
                    >
                        Simulate log
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ maxHeight: "3em" }}
                        onClick={() => getBatteryLevel()}
                    >
                        Get level
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SmartMeterPage;
