import React, { useContext } from "react";
import StepContext, { Steps } from "../../../contexts/stepContext";
import PickAccountsComponent from "../../Dashboard/PickAccountsComponent/PickAccountsComponent";
import styles from "./OnboardingContentComponent.module.css";
import CableCompanyComponent from "../../Dashboard/CableCompanyComponent/CableCompanyComponent";
import ManageSmartMeterComponent from "../../Dashboard/ManageSmartMeterComponent/ManageSmartMeterComponent";
import RegisterSmartMeterComponent from "../../Dashboard/RegisterSmartMeterComponent/RegisterSmartMeterComponent";
import ManageMarketsComponent from "../../Dashboard/ManageMarketsComponent/ManageMarketsComponent";
import PickMarketComponent from "../../Dashboard/PickMarketComponent/PickMarketComponent";

const OnboardingContentComponent = () => {
    const { currentStep } = useContext(StepContext);

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

    return (
        <>
            {currentStep === Steps.Step1 && (
                <>
                    <OnboardingItem
                        title="Choose account"
                        content={<PickAccountsComponent />}
                    />
                    <OnboardingItem
                        title="Cable Company"
                        content={<CableCompanyComponent />}
                    />
                </>
            )}
            {currentStep === Steps.Step2 && (
                <>
                    <OnboardingItem
                        title="Smart Meter"
                        content={<ManageSmartMeterComponent />}
                    />
                    <OnboardingItem
                        title="Register Smart Meter"
                        content={<RegisterSmartMeterComponent />}
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
                </>
            )}
        </>
    );
};

export default OnboardingContentComponent;
