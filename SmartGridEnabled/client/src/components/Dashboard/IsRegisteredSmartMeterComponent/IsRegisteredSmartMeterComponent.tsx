import React, { useContext, useState } from "react";
import { TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";

const IsRegisteredSmartMeterComponent = () => {
    const { currentAccount, isRegisteredKey } = useContext(EthereumContext);

    const [smartMeterPubKey, setSmartMeterPubKey] = useState<string>();
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>();

    const isKeyRegistered = async () => {
        if (!currentAccount) return;
        let res = await isRegisteredKey(smartMeterPubKey, smartMeterAddress);
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
                onClick={() => isKeyRegistered()}
                text="Check registration"
            />
        </>
    );
};

export default IsRegisteredSmartMeterComponent;
