import React, { useEffect, useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import styles from "./SelectSmartMeterAddressComponent.module.css";
import EthereumContext from "../../../contexts/ethereumContext";

const SelectSmartMeterAddressComponent = () => {
    const {
        smartMeterAccounts,
        user,
        setUser
    } = useContext(EthereumContext);

    useEffect(() => {
        if (!smartMeterAccounts) return;
        if (!user.smartMeterAddress) setUser(prev => ({...prev, smartMeterAddress: smartMeterAccounts[0]}));
    }, [setUser, smartMeterAccounts, user.smartMeterAddress]);

    return (
        <>
            <Select
                className={styles.pickAccountSelector}
                value={user.smartMeterAddress}
                label="Smart meter address"
                defaultValue=""
                onChange={(e) => {
                        setUser(prev => ({...prev, smartMeterAddress: e.target.value}))
                }}
            >
                {smartMeterAccounts &&
                    smartMeterAccounts.map((account: string, index: number) => {
                        return (
                            <MenuItem key={index} value={account}>
                                Account {index + 1}
                            </MenuItem>
                        );
                    })}
            </Select>
            {user.smartMeterAddress && (
                        <p className="light-text">
                            Smart meter account:
                            <br />
                            {user.smartMeterAddress}
                        </p>
                    )}
        </>
    );
};

export default SelectSmartMeterAddressComponent;
