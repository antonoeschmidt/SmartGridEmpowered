import React, { useContext } from "react";
import StepComponent from "../StepComponent/StepComponent";
import styles from "./StepsComponent.module.css";
import StepContext, { Steps } from "../../../contexts/stepContext";

type StepsComponentProps = {
    handleChangeStep: (step: Steps) => void;
};

const StepsComponent = ({ handleChangeStep }: StepsComponentProps) => {
    const { currentStep, completedSteps } = useContext(StepContext);

    return (
        <div className={styles.container}>
            <StepComponent
                step={Steps.Step1}
                title={"1. setup Account and DSO"}
                isActiveStep={currentStep === Steps.Step1}
                complete={completedSteps?.includes(Steps.Step1)}
                handleChange={handleChangeStep}
                image="/images/user.svg"
            />
            <StepComponent
                step={Steps.Step2}
                title={"2. register Smart Meter"}
                isActiveStep={currentStep === Steps.Step2}
                complete={completedSteps?.includes(Steps.Step2)}
                handleChange={handleChangeStep}
                image="/images/smartMeter.svg"
            />
            <StepComponent
                step={Steps.Step3}
                title={"3. select Market"}
                isActiveStep={currentStep === Steps.Step3}
                complete={completedSteps?.includes(Steps.Step3)}
                handleChange={handleChangeStep}
                image="/images/market.svg"
            />
        </div>
    );
};

export default StepsComponent;
