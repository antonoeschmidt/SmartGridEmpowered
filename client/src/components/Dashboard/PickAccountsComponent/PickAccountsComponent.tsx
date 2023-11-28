import React, { useEffect, useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import styles from "./PickAccountsComponent.module.css";
import EthereumContext from "../../../contexts/ethereumContext";

const PickAccountsComponent = ({ type }: { type: string }) => {
    const {
        accounts,
        currentAccount,
        setCurrentAccount,
        setAdminAccount,
        adminAccount,
    } = useContext(EthereumContext);

    useEffect(() => {
        if (!accounts) return;
        if (type === "admin") setAdminAccount(accounts[0]);
        if (!currentAccount) setCurrentAccount(accounts[1]);
    }, [accounts, currentAccount, setAdminAccount, setCurrentAccount, type]);

    return (
        <>
            <Select
                className={styles.pickAccountSelector}
                value={type === "admin" ? adminAccount : currentAccount}
                label="Account"
                defaultValue=""
                onChange={(e) => {
                    if (type === "admin") {
                        console.log("set admin account");
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
