import React from "react";
import styles from "./SuggestedPriceComponent.module.css";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

type Props = {
    suggestedPrice: number,
}

const SuggestedPriceComponent = ({suggestedPrice}: Props) => {
    let colors = {
        red: "#d32f2f",
        green: "#2e7d32"
    }

    return (
        <div className={`${styles.item}`}>
            <h3>Suggested Price</h3>
            <p
                className={styles.text}
                style={{ color: suggestedPrice > 0.5 ? colors.green : colors.red }}
            >
                {suggestedPrice} €/kWh
            </p>
            {suggestedPrice > 0.5 ? ( <TrendingUpIcon sx={{fontSize: "50px", color: colors.green}}/>) 
            : ( <TrendingDownIcon sx={{fontSize: "50px", color: colors.red}}/>)}
               
        </div>
    );
};

export default SuggestedPriceComponent;
