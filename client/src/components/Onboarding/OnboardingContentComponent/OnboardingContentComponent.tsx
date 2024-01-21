import React, { useContext } from "react";
import StepContext, { Steps } from "../../../contexts/stepContext";
import PickAccountsComponent from "../../Dashboard/PickAccountsComponent/PickAccountsComponent";
import styles from "./OnboardingContentComponent.module.css";
import ManageMarketsComponent from "../../Dashboard/ManageMarketsComponent/ManageMarketsComponent";
import PickMarketComponent from "../../Dashboard/PickMarketComponent/PickMarketComponent";
import OnboardingDialogComponent from "../OnboardingDialogComponent/OnboardingDialogComponent";
import Button from "../../Shared/Button/Button";
import EthereumContext from "../../../contexts/ethereumContext";
import { useNavigate } from "react-router-dom";
import SelectSmartMeterAddressComponent from "../SelectSmartMeterAddress/SelectSmartMeterAddressComponent";

type OnboardingContentComponentProps = {
    handleChangeStep: (step: Steps) => void;
};

const OnboardingContentComponent = ({
    handleChangeStep,
}: OnboardingContentComponentProps) => {
    const { currentStep } = useContext(StepContext);
    const {
        adminAccount,
        deployDSO,
        setDSOAddress,
        createSmartMeter,
        registerSmartMeter,
        deployMarket,
        setMarkets,
        markets,
        setSmartMeterMarketAddress,
        setLoading,
        deploySmartMeter,
        smartMeterContractAddress,
        setUser,
        user,
        smartMeterAccounts,
        accounts
    } = useContext(EthereumContext);
    const navigate = useNavigate();

    type OnboardingItemProps = {
        title: string;
        content: JSX.Element;
    };

    const OnboardingItem = ({ title, content }: OnboardingItemProps) => {
        return (
            <div className={styles.item}>
                <div className={styles.title}>{title}</div>
                <hr />
                <div className={styles.itemContent}>{content}</div>
            </div>
        );
    };

    const handleStep1 = async () => {
        // Deploy DSO
        let DSOAddress = localStorage.getItem("DSO");
        if (!DSOAddress) {
            DSOAddress = await deployDSO();
            localStorage.setItem("DSO", DSOAddress);
        }
        setDSOAddress(DSOAddress);

        // sets the address of the smart meter contract.
        let smartMeterAddress = localStorage.getItem("smartMeterContractAddress");
        if (!smartMeterAddress) {
            smartMeterAddress = await deploySmartMeter();
            localStorage.setItem("smartMeterContractAddress", smartMeterAddress);
        }
        smartMeterContractAddress.current = smartMeterAddress;
        
        handleChangeStep(Steps.Step2);
    };

    const handleStep2 = async () => {
        // Deploy Smart Meter
        
        let marketAddress;
        // Create New Market
        if (markets?.length < 1) {
            marketAddress = await deployMarket();
            setMarkets((prev) => [...prev, marketAddress]);
        } else {
            marketAddress = markets[0];
        }
        setUser(prev => ({...prev, market: marketAddress}));
        const addressIndex = accounts.indexOf(user.accountAddress);
        await createSmartMeter(smartMeterAccounts[addressIndex], user.accountAddress, marketAddress);
        // Register Smart Meter
        await registerSmartMeter(user.accountAddress, user.smartMeterAddress);
        localStorage.setItem("currentUser", user.accountAddress);

        handleChangeStep(Steps.Step3);
    };

    const handleStep3 = async () => {
        // Set Market Address for SmartMeter
        let res = await setSmartMeterMarketAddress();
        console.log("setSmartMeterMarketAddress", res);
        localStorage.setItem("onboarded", "true");

        setLoading(true);
        navigate("/");
    };

    return (
        <>
            <OnboardingDialogComponent />
            {currentStep === Steps.Step1 && (
                <>
                    <OnboardingItem
                        title="Choose admin account"
                        content={<PickAccountsComponent onboarding={true} type="admin" />}
                    />
                    <Button
                        text={"Next"}
                        onClick={() => handleStep1()}
                        disabled={!adminAccount}
                    />
                </>
            )}
            {currentStep === Steps.Step2 && (
                <>
                    <OnboardingItem
                        title="Choose user account"
                        content={<PickAccountsComponent onboarding={true} type="user" />}
                    />
                    <OnboardingItem
                        title="Choose smart meter account"
                        content={<SelectSmartMeterAddressComponent />}
                    />
                    <Button
                        text={"Next"}
                        onClick={() => handleStep2()}
                        disabled={!user.accountAddress}
                    />
                </>
            )}
            {currentStep === Steps.Step3 && (
                <>
                    <OnboardingItem
                        title="Manage markets"
                        content={<ManageMarketsComponent />}
                    />
                    <OnboardingItem
                        title="Choose Market"
                        content={<PickMarketComponent />}
                    />
                    <Button
                        text={"Go to Marketplace"}
                        onClick={() => handleStep3()}
                        disabled={!user.market}
                    />
                </>
            )}
        </>
    );
};

export default OnboardingContentComponent;
