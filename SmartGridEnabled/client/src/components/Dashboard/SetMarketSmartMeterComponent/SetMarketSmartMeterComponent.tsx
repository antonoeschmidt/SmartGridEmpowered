import React, { useContext } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";
import ToastContext from "../../../contexts/toastContext";

const SetMarketSmartMeterComponent = () => {
    const { currentAccount, currentMarket, setSmartMeterMarketAddress } =
        useContext(EthereumContext);

    const { setToastProps, onOpen } = useContext(ToastContext);

    const setMarketAddressSmartMeter = async () => {
        if (!currentAccount || !currentMarket) return;
        await setSmartMeterMarketAddress();
        setToastProps(`Success!`, "success");
        onOpen();
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
