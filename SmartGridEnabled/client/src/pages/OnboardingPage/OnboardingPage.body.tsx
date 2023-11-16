import React, { useContext, useEffect, useState } from "react";
import OnboardingContentComponent from "../../components/Onboarding/OnboardingContentComponent/OnboardingContentComponent";
import StepsComponent from "../../components/Onboarding/StepsComponent/StepsComponent";
import styles from "./OnboardingPage.module.css";
import StepContext from "../../contexts/stepContext";

const OnboardingPageBody = () => {
    const { currentStep } = useContext(StepContext);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 500);
    }, [currentStep]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Smart Grid Empowered.</h2>
            <div
                className={`${styles.content} ${animate ? styles.animate : ""}`}
            >
                <OnboardingContentComponent />
            </div>
            <div className={styles.steps}>
                <StepsComponent />
            </div>
        </div>
    );
};

export default OnboardingPageBody;
