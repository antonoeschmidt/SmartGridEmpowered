import { useContext, useEffect } from "react";
import StepContext, { useStepContextValue } from "../../contexts/stepContext";
import OnboardingPageBody from "./OnboardingPage.body";
import EthereumContext from "../../contexts/ethereumContext";
import { getAccounts } from "../../apis/web3";

const OnboardingPage = () => {
    const stepContextValue = useStepContextValue();
    const { accounts, setAccounts } = useContext(EthereumContext);

    useEffect(() => {
        if (accounts.length > 0) return;
        getAccounts().then((accounts) => {
            if (accounts) {
                setAccounts(accounts);
            }
        });
    }, [accounts.length, setAccounts]);

    return (
        <StepContext.Provider value={stepContextValue}>
            <OnboardingPageBody />
        </StepContext.Provider>
    );
};

export default OnboardingPage;
