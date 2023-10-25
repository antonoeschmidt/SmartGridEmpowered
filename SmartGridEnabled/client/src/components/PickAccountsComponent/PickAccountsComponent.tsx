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
        
        if (accounts) return;

        ethereumInstance.getAccounts().then((accounts) => {
            if (accounts) {
                setAccounts(accounts);
                if (!currentAccount)setCurrentAccount(accounts[0])
            }
        });
    }, [accounts, currentAccount, ethereumInstance, setAccounts, setCurrentAccount]);

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
