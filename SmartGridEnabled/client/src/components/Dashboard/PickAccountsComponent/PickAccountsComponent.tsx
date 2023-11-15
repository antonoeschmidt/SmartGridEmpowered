import React, { useEffect, useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import styles from "./PickAccountsComponent.module.css";
import { getAccounts } from "../../../apis/web3";
import EthereumContext from "../../../contexts/ethereumContext";

const PickAccountsComponent = () => {
    const { accounts, currentAccount, setAccounts, setCurrentAccount } =
        useContext(EthereumContext);

    useEffect(() => {
        if (accounts) return;

        getAccounts().then((accounts) => {
            if (accounts) {
                setAccounts(accounts);
                if (!currentAccount) setCurrentAccount(accounts[0]);
            }
        });
    }, [accounts, currentAccount, setAccounts, setCurrentAccount]);

    return (
        <>
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
        </>
    );
};

export default PickAccountsComponent;
