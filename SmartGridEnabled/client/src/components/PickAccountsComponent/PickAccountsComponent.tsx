import React, { useContext, useEffect } from "react";
import { MenuItem, Select } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import { getAccounts, getWeb3 } from "../../utils/web3";
import styles from "./PickAccountsComponent.module.css";

const PickAccountsComponent = () => {
    const { accounts, setAccounts, currentAccount, setCurrentAccount } =
        useContext(EthereumContext);

    useEffect(() => {
        if (accounts) return;
        let web3 = getWeb3();
        getAccounts(web3).then((accounts) => {
            console.log(accounts);
            setAccounts(accounts);
        });
    }, [setAccounts, accounts]);

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <p>Choose Account</p>
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
