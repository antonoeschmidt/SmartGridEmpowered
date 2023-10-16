import React, { useContext, useEffect } from "react";
import { MenuItem, Select } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import styles from "./PickAccountsComponent.module.css";

const PickAccountsComponent = () => {
    const {
        ethereumInstance,
        accounts,
        setAccounts,
        currentAccount,
        setCurrentAccount,
    } = useContext(EthereumContext);

    useEffect(() => {
        ethereumInstance.getAccounts().then((accounts) => {
            console.log(accounts);
            setAccounts(accounts);
        });
    }, [ethereumInstance, setAccounts]);

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Choose Account</h3>
            <Select
                className={styles.pickAccountSelector}
                value={currentAccount}
                label="Age"
                onChange={(e) => {
                    setCurrentAccount(e.target.value);
                }}
            >
                {accounts &&
                    accounts.map((account: string, index: number) => {
                        return (
                            <MenuItem key={index} value={account}>
                                Account {index + 1}
                            </MenuItem>
                        );
                    })}
            </Select>
            {currentAccount && (
                <p className="light-text">
                    Current account:
                    <br />
                    {currentAccount}
                </p>
            )}
        </div>
    );
};

export default PickAccountsComponent;
