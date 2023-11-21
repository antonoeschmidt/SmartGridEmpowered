import React, { useContext, useEffect, useState } from "react";
import OnboardingContentComponent from "../../components/Onboarding/OnboardingContentComponent/OnboardingContentComponent";
import StepsComponent from "../../components/Onboarding/StepsComponent/StepsComponent";
import styles from "./OnboardingPage.module.css";
import StepContext, { Steps } from "../../contexts/stepContext";

const OnboardingPageBody = () => {
    const { currentStep, completedSteps, setCompletedSteps, setCurrentStep } =
        useContext(StepContext);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 500);
    }, [currentStep]);

    const handleChangeStep = (step: Steps) => {
        if (completedSteps) {
            setCompletedSteps((prev) => [...prev, currentStep]);
        } else {
            setCompletedSteps([currentStep]);
        }
        setCurrentStep(step);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Smart Grid Empowered.</h2>
            <div
                className={`${styles.content} ${animate ? styles.animate : ""}`}
            >
                <OnboardingContentComponent
                    handleChangeStep={handleChangeStep}
                />
            </div>
            <div className={styles.steps}>
                <StepsComponent handleChangeStep={handleChangeStep} />
            </div>
        </div>
    );
};

export default OnboardingPageBody;
