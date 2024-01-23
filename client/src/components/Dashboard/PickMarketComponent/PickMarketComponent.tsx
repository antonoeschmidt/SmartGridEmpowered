import React, { useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./PickMarketComponent.module.css";

const PickMarketComponent = () => {
    const { user, setUser, markets } =
        useContext(EthereumContext);

    return (
        <>
            <Select
                className={styles.pickMarketSelector}
                defaultValue=""
                value={
                    markets
                        ? user.market
                            ? user.market.toLowerCase()
                            : ""
                        : ""
                }
                label="Market"
                onChange={(e) => {
                    setUser(prev => ({...prev, market: e.target.value}));
                }}
            >
                {markets &&
                    markets.map((market: string, index: number) => {
                        return (
                            <MenuItem key={index} value={market?.toLowerCase()}>
                                Market {index + 1}
                            </MenuItem>
                        );
                    })}
            </Select>
            {user.market && (
                <p className="light-text">
                    Current market:
                    <br />
                    {user.market}
                </p>
            )}
        </>
    );
};

export default PickMarketComponent;
