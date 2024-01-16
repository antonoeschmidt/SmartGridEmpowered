import React, { useEffect, useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import styles from "./PickAccountsComponent.module.css";
import EthereumContext from "../../../contexts/ethereumContext";

const PickAccountsComponent = ({ type, onboarding }: { type: string, onboarding: boolean }) => {
    const {
        accounts,
        user,
        setUser,
        setAdminAccount,
        adminAccount,
        changeUser
    } = useContext(EthereumContext);

    useEffect(() => {
        if (!accounts) return;
        if (type === "admin") setAdminAccount(accounts[0]);
        if (!user.accountAddress) setUser(prev => ({...prev, accountAddress: accounts[1]}))
    }, [accounts, setAdminAccount, setUser, type, user.accountAddress]);

    return (
        <>
            <Select
                className={styles.pickAccountSelector}
                value={type === "admin" ? adminAccount : user.accountAddress}
                label="Account"
                defaultValue=""
                onChange={(e) => {
                    if (type === "admin") {
                        console.log("set admin account");
                        setAdminAccount(e.target.value);
                    } else {                        
                        if (onboarding) setUser(prev => ({...prev, accountAddress: e.target.value}));
                        else changeUser(e.target.value);
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
                    {user.accountAddress && (
                        <p className="light-text">
                            User account:
                            <br />
                            {user.accountAddress}
                        </p>
                    )}
                </>
            )}
        </>
    );
};

export default PickAccountsComponent;
