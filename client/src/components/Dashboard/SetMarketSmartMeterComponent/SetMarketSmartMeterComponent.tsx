import React, { useContext } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";
import ToastContext from "../../../contexts/toastContext";

const SetMarketSmartMeterComponent = () => {
    const { user, setSmartMeterMarketAddress } =
        useContext(EthereumContext);

    const { setToastProps, onOpen } = useContext(ToastContext);

    const setMarketAddressSmartMeter = async () => {
        if (!user.accountAddress || !user.market) return;
        await setSmartMeterMarketAddress();
        setToastProps(`Success!`, "success");
        onOpen();
    };

    return (
        <>
            <Button
                disabled={!user.accountAddress}
                onClick={() => setMarketAddressSmartMeter()}
                text="Set Market Address"
            />
        </>
    );
};

export default SetMarketSmartMeterComponent;
