import React, { useContext, useState } from "react";
import EthereumContext from "../../../contexts/ethereumContext";
import Button from "../../Shared/Button/Button";

const CableCompanyComponent = () => {
    const {
        user,
        setCableCompanyAddress,
        cableCompanyAddress,
        deployCableCompany,
    } = useContext(EthereumContext);
    const [newCableCompanyCreated, setNewCableCompanyCreated] = useState(false);

    const newCableCompany = async () => {
        if (!user.accountAddress) return;
        let cableCompanyAddress = await deployCableCompany();
        setNewCableCompanyCreated(true);
        setCableCompanyAddress(cableCompanyAddress);
    };

    return (
        <>
            <Button
                text={"New Cable Company"}
                onClick={newCableCompany}
                disabled={!user.accountAddress}
            />
            {newCableCompanyCreated && (
                <>
                    <p className="light-text">New Cable Company created!</p>
                </>
            )}
            <p className="light-text">
                Current Cable Company:
                <br />
                {cableCompanyAddress}
            </p>
        </>
    );
};

export default CableCompanyComponent;
