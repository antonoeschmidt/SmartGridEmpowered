import React, { useContext, useState } from "react";
import { TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";
import ToastContext from "../../../contexts/toastContext";

const RegisterSmartMeterComponent = () => {
    const { currentAccount, registerSmartMeter } = useContext(EthereumContext);
    const [smartMeterPubKey, setSmartMeterPubKey] = useState<string>();
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>();

    const { setToastProps, onOpen} = useContext(ToastContext);

    const handleRegisterSmartMeter = async () => {
        if (!currentAccount) return;
        let res = await registerSmartMeter(smartMeterPubKey, smartMeterAddress);
        if (res.status < 299) {
            setToastProps("Registration successful", "success");
        } else {
            setToastProps("Something went wrong", "error");
        }
        onOpen();
        console.log(res);
    };

    return (
        <>
            <TextField
                id="outlined-basic"
                label="Public Key"
                variant="outlined"
                onChange={(e) => setSmartMeterPubKey(e.target.value)}
            />
            <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                onChange={(e) => setSmartMeterAddress(e.target.value)}
            />
            <Button
                disabled={!currentAccount}
                onClick={() => handleRegisterSmartMeter()}
                text="Register Smart Meter"
            />
        </>
    );
};

export default RegisterSmartMeterComponent;
