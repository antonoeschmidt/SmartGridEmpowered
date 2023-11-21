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

type OnboardingContentComponentProps = {
    handleChangeStep: (step: Steps) => void;
};

const OnboardingContentComponent = ({
    handleChangeStep,
}: OnboardingContentComponentProps) => {
    const { currentStep } = useContext(StepContext);
    const {
        adminAccount,
        deployCableCompany,
        setCableCompanyAddress,
        currentAccount,
        deploySmartMeter,
        setSmartMeterAddress,
        registerSmartMeter,
        currentMarket,
        deployMarket,
        setCurrentMarket,
        setMarkets,
        markets,
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
        const cableCompanyAddress = await deployCableCompany();
        setCableCompanyAddress(cableCompanyAddress);
        handleChangeStep(Steps.Step2);
    };

    const handleStep2 = async () => {
        // Deploy Smart Meter
        const address = await deploySmartMeter(currentAccount);
        setSmartMeterAddress(address);

        // Register Smart Meter
        await registerSmartMeter(address, currentAccount);

        // Create New Market
        if (!markets) {
            const marketAddress = await deployMarket();
            setCurrentMarket(marketAddress);
            setMarkets(markets ? [...markets, marketAddress] : [marketAddress]);
        }

        handleChangeStep(Steps.Step3);
    };

    const handleStep3 = () => {
        localStorage.setItem("onboarded", "true");
        navigate("/");
    };

    return (
        <>
            <OnboardingDialogComponent />
            {currentStep === Steps.Step1 && (
                <>
                    <OnboardingItem
                        title="Choose admin account"
                        content={<PickAccountsComponent type="admin" />}
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
                        content={<PickAccountsComponent type="user" />}
                    />
                    <Button
                        text={"Next"}
                        onClick={() => handleStep2()}
                        disabled={!currentAccount}
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
                        disabled={!currentMarket}
                    />
                </>
            )}
        </>
    );
};

export default OnboardingContentComponent;
