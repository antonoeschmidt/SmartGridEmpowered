import React, { useContext, useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./PickMarketComponent.module.css";

const PickMarketComponent = () => {
    const { currentMarket, setCurrentMarket, markets } =
        useContext(EthereumContext);

    const [currentMarketSelectValue, setCurrentMarketSelectValue] =
        useState("");

    useEffect(() => {
        if (!currentMarket) return;
        if (markets.includes(currentMarket)) {
            setCurrentMarketSelectValue(currentMarket);
        } else if (markets.includes(currentMarket.toLowerCase())) {
            setCurrentMarketSelectValue(currentMarket.toLowerCase());
        }
    }, [currentMarket, markets]);

    return (
        <>
            <Select
                className={styles.pickMarketSelector}
                value={currentMarketSelectValue}
                label="Age"
                onChange={(e) => {
                    setCurrentMarket(e.target.value);
                    setCurrentMarketSelectValue(e.target.value);
                }}
            >
                {markets &&
                    markets.map((market: string, index: number) => {
                        return (
                            <MenuItem key={index} value={market}>
                                Market {index + 1}
                            </MenuItem>
                        );
                    })}
            </Select>
            {currentMarket && (
                <p className="light-text">
                    Current market:
                    <br />
                    {currentMarket}
                </p>
            )}
        </>
    );
};

export default PickMarketComponent;
