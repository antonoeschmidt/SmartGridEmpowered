import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import EthereumContext from "../../../contexts/ethereumContext";
import styles from "./CableCompanyComponent.module.css";

const CableCompanyComponent = () => {
    const {
        ethereumInstance,
        currentAccount,
        setCableCompanyAddress,
        cableCompanyAddress,
    } = useContext(EthereumContext);

    const [newCableCompanyCreated, setNewCableCompanyCreated] = useState(false);

    const newCableCompany = async () => {
        if (!currentAccount) return;
        let cableCompanyAddress = await ethereumInstance.deployCableCompany(
            currentAccount
        );
        setNewCableCompanyCreated(true);
        setCableCompanyAddress(cableCompanyAddress);
    };

    return (
        <div className={`${styles.item} ${styles.pickAccount}`}>
            <h3>Cable Company</h3>
            <div className={styles.buttons}>
                <Button
                    disabled={!currentAccount}
                    variant="contained"
                    color="primary"
                    style={{ maxHeight: "3em" }}
                    onClick={() => newCableCompany()}
                >
                    New Cable Company
                </Button>
            </div>
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
        </div>
    );
};

export default CableCompanyComponent;
