import React, { useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./PickMarketComponent.module.css";

const PickMarketComponent = () => {
    const { currentMarket, setCurrentMarket, markets } =
        useContext(EthereumContext);

    return (
        <>
            <Select
                className={styles.pickMarketSelector}
                value={currentMarket ? currentMarket.toLowerCase() : ""}
                label="Market"
                onChange={(e) => {
                    setCurrentMarket(e.target.value);
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
