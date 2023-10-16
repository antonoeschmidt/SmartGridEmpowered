import React, { useContext  } from "react";
import { MenuItem, Select } from "@mui/material";
import EthereumContext from "../../contexts/ethereumContext";
import styles from "./PickMarketComponent.module.css";

const PickMarketComponent = () => {
    const { currentMarket, setCurrentMarket, markets } = useContext(EthereumContext);
    
    return (
        <div className={`${styles.item} ${styles.pickMarket}`}>
            <h3>Choose Market</h3>
            <Select
                className={styles.pickMarketSelector}
                value={currentMarket}
                label="Age"
                onChange={(e) => {
                    setCurrentMarket(e.target.value);
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
        </div>
    );
};

export default PickMarketComponent;
