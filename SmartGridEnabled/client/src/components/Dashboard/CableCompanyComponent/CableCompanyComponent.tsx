import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import styles from "./CableCompanyComponent.module.css";
import EthereumContext from "../../../contexts/ethereumContext";

const CableCompanyComponent = () => {
    const {
        currentAccount,
        setCableCompanyAddress,
        cableCompanyAddress,
        deployCableCompany,
    } = useContext(EthereumContext);
    const [newCableCompanyCreated, setNewCableCompanyCreated] = useState(false);

    const newCableCompany = async () => {
        if (!currentAccount) return;
        let cableCompanyAddress = await deployCableCompany();
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
