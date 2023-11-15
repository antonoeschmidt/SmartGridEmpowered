import { Dispatch, SetStateAction, createContext, useState } from "react";

export type StepContextType = {
    currentStep: Steps;
    setCurrentStep: Dispatch<SetStateAction<Steps>>;
    completedSteps: Steps[];
    setCompletedSteps: Dispatch<SetStateAction<Steps[]>>;
};

export enum Steps {
    Step1 = 1,
    Step2 = 2,
    Step3 = 3,
}

export const useStepContextValue = (): StepContextType => {
    const [currentStep, setCurrentStep] = useState(Steps.Step1);
    const [completedSteps, setCompletedSteps] = useState<Steps[]>();

    return {
        currentStep,
        setCurrentStep,
        completedSteps,
        setCompletedSteps,
    };
};

const StepContext = createContext<StepContextType>(null);

export default StepContext;
