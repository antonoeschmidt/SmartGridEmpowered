import React, { useContext, useState } from "react";
import { TextField } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";
import { createAccount } from "../../../apis/web3";

const ManageSmartMeterComponent = () => {
    const {
        user,
        setUser,
        createSmartMeter,
    } = useContext(EthereumContext);

    const [newSmartMeterCreated, setNewSmartMeterCreated] = useState(false);

    const newSmartMeter = async () => {
        if (!user.accountAddress) return;
        const address = await createAccount();
        await createSmartMeter(user.accountAddress);
        setNewSmartMeterCreated(true);
        setUser(prev => ({...prev, smartMeterAddress: address}));
        console.log(address);
    };

    return (
        <>
            <Button
                disabled={!user.accountAddress}
                onClick={() => newSmartMeter()}
                text="New Smart Meter"
            />
            <TextField
                variant="outlined"
                placeholder="Set smart meter address"
                onChange={(e) => setUser(prev => ({...prev, smartMeterAddress: e.target.value}))}
            ></TextField>
            {newSmartMeterCreated && (
                <>
                    <p className="light-text">New Smart Meter created!</p>
                </>
            )}
            {user.smartMeterAddress && (
                <p className="light-text">
                    Current Smart Meter:
                    <br />
                    {user.smartMeterAddress}
                </p>
            )}
        </>
    );
};

export default ManageSmartMeterComponent;
