import React, { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";
import ToastContext from "../../../contexts/toastContext";

const IsRegisteredSmartMeterComponent = () => {
    const {
        currentAccount,
        isRegisteredKey,
        smartMeterAddress: contextSmartMeterAddress,
    } = useContext(EthereumContext);

    const [smartMeterPubKey, setSmartMeterPubKey] = useState<string>("");
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>("");

    useEffect(() => {
        setSmartMeterPubKey(currentAccount);
    }, [currentAccount]);

    useEffect(() => {
        setSmartMeterAddress(contextSmartMeterAddress);
    }, [contextSmartMeterAddress]);

    const { setToastProps, onOpen } = useContext(ToastContext);

    const isKeyRegistered = async () => {
        if (!currentAccount) return;
        let res = await isRegisteredKey(smartMeterPubKey, smartMeterAddress);
        setToastProps(`Response was: ${res}`, "info");
        onOpen();
    };

    return (
        <>
            <TextField
                id="outlined-basic"
                label="Public Key"
                variant="outlined"
                value={smartMeterPubKey ? smartMeterPubKey : ""}
                onChange={(e) => setSmartMeterPubKey(e.target.value)}
            />
            <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                value={smartMeterAddress ? smartMeterAddress : ""}
                onChange={(e) => setSmartMeterAddress(e.target.value)}
            />

            <Button
                disabled={!currentAccount}
                onClick={() => isKeyRegistered()}
                text="Check registration"
            />
        </>
    );
};

export default IsRegisteredSmartMeterComponent;
