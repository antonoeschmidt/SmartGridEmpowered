import React, { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";

const RegisterSmartMeterComponent = () => {
    const {
        currentAccount,
        registerSmartMeter,
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

    const handleRegisterSmartMeter = async () => {
        if (!currentAccount) return;
        let res = await registerSmartMeter(smartMeterPubKey, smartMeterAddress);
        console.log(res);
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
                onClick={() => handleRegisterSmartMeter()}
                text="Register Smart Meter"
            />
        </>
    );
};

export default RegisterSmartMeterComponent;
