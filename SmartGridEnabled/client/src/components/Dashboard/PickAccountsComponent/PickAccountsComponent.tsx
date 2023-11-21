import React, { useEffect, useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import styles from "./PickAccountsComponent.module.css";
import { getAccounts } from "../../../apis/web3";
import EthereumContext from "../../../contexts/ethereumContext";

const PickAccountsComponent = ({ type }: { type: string }) => {
    const {
        accounts,
        currentAccount,
        setAccounts,
        setCurrentAccount,
        setAdminAccount,
        adminAccount,
    } = useContext(EthereumContext);

    useEffect(() => {
        if (accounts) return;

        getAccounts().then((accounts) => {
            if (accounts) {
                setAccounts(accounts);
                if (type === "admin") return; // We do not want to pre set the admin account
                if (!currentAccount) setCurrentAccount(accounts[0]);
            }
        });
    }, [accounts, currentAccount, setAccounts, setCurrentAccount, type]);

    return (
        <>
            <Select
                className={styles.pickAccountSelector}
                value={type === "admin" ? adminAccount : currentAccount}
                label="Age"
                onChange={(e) => {
                    if (type === "admin") {
                        setAdminAccount(e.target.value);
                    } else {
                        setCurrentAccount(e.target.value);
                    }
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
            {type === "admin" ? (
                <>
                    {adminAccount && (
                        <p className="light-text">
                            Admin account:
                            <br />
                            {adminAccount}
                        </p>
                    )}
                </>
            ) : (
                <>
                    {currentAccount && (
                        <p className="light-text">
                            User account:
                            <br />
                            {currentAccount}
                        </p>
                    )}
                </>
            )}
        </>
    );
};

export default PickAccountsComponent;
