import StepContext, { useStepContextValue } from "../../contexts/stepContext";
import OnboardingPageBody from "./OnboardingPage.body";

const OnboardingPage = () => {
    const stepContextValue = useStepContextValue();

    return (
        <StepContext.Provider value={stepContextValue}>
            <OnboardingPageBody />
        </StepContext.Provider>
    );
};

export default OnboardingPage;
