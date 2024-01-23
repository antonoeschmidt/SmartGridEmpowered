import React, { useContext, useState } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";

const DSOComponent = () => {
    const {
        user,
        setDSOAddress,
        DSOAddress,
        deployDSO,
    } = useContext(EthereumContext);
    const [newDSOCreated, setNewDSOCreated] = useState(false);

    const newDSO = async () => {
        if (!user.accountAddress) return;
        let DSOAddress = await deployDSO();
        setNewDSOCreated(true);
        setDSOAddress(DSOAddress);
    };

    return (
        <>
            <Button
                text={"New DSO"}
                onClick={newDSO}
                disabled={!user.accountAddress}
            />
            {newDSOCreated && (
                <>
                    <p className="light-text">New DSO Company created!</p>
                </>
            )}
            <p className="light-text">
                Current DSO Company:
                <br />
                {DSOAddress}
            </p>
        </>
    );
};

export default DSOComponent;
