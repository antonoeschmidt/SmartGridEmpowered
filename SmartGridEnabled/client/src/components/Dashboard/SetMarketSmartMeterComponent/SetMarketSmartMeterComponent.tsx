import React, { useContext } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";

const SetMarketSmartMeterComponent = () => {
    const { currentAccount, currentMarket, setSmartMeterMarketAddress } =
        useContext(EthereumContext);

    const setMarketAddressSmartMeter = async () => {
        if (!currentAccount || !currentMarket) return;
        let res = await setSmartMeterMarketAddress();
        console.log(res);
    };

    return (
        <>
            <Button
                disabled={!currentAccount}
                onClick={() => setMarketAddressSmartMeter()}
                text="Set Market Address"
            />
        </>
    );
};

export default SetMarketSmartMeterComponent;
