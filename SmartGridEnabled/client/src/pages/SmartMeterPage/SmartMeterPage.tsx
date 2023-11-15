import React, { useContext, useState } from "react";
import styles from "./SmartMeterPage.module.css";
import { TextField } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import Button from "../../components/Shared/Button/Button";

const SmartMeterPage = () => {
    const [consumption, setConsumption] = useState<number>();
    const [production, setProduction] = useState<number>();

    const { smartMeterAddress, getBatteryCharge, createSmartMeterLog } =
        useContext(EthereumContext);

    const createLogClick = async () => {
        if (!consumption || !production || !smartMeterAddress) {
            alert("No energy data or smart meter selected");
            return;
        }
        let res = await createSmartMeterLog(consumption, production);
        console.log(res);
    };

    const getBatteryLevel = async () => {
        let batteryLevel = await getBatteryCharge();
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
                        onChange={(e) =>
                            setConsumption(parseInt(e.target.value))
                        }
                    ></TextField>
                    <TextField
                        variant="outlined"
                        label="Production"
                        onChange={(e) =>
                            setProduction(parseInt(e.target.value))
                        }
                    ></TextField>
                    <Button
                        onClick={() => createLogClick()}
                        text="Simulate Log"
                    />

                    <Button
                        onClick={() => getBatteryLevel()}
                        text="Get level"
                    />
                </div>
            </div>
        </div>
    );
};

export default SmartMeterPage;
