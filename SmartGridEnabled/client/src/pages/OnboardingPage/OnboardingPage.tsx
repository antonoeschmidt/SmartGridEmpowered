import React from "react";
import styles from "./OnboardingPage.module.css";
import StepContext, { useStepContextValue } from "../../contexts/stepContext";
import StepsComponent from "../../components/Onboarding/StepsComponent/StepsComponent";
import OnboardingContentComponent from "../../components/Onboarding/OnboardingContentComponent/OnboardingContentComponent";

const OnboardingPage = () => {
    const stepContextValue = useStepContextValue();

    return (
        <StepContext.Provider value={stepContextValue}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <OnboardingContentComponent />
                </div>
                <div className={styles.steps}>
                    <StepsComponent />
                </div>
            </div>
        </StepContext.Provider>
    );
};

export default OnboardingPage;
