import { useContext, useEffect } from "react";
import StepContext, { useStepContextValue } from "../../contexts/stepContext";
import OnboardingPageBody from "./OnboardingPage.body";
import EthereumContext from "../../contexts/ethereumContext";
import { getAccounts } from "../../apis/web3";

const OnboardingPage = () => {
    const stepContextValue = useStepContextValue();
    const { setUser, accounts, setAccounts, setSmartMeterAccounts, user } = useContext(EthereumContext);


    useEffect(() => {
        if (accounts.length > 0) return;
        getAccounts().then((_accounts) => {
            if (_accounts.length > 0) {
                // Calculate the middle index
                const middleIndex: number = Math.floor(_accounts.length / 2);

                // Take the first half of the array
                const firstHalf = _accounts.slice(0, middleIndex);

                // Take the second half of the array
                const secondHalf = _accounts.slice(middleIndex);
                setAccounts(firstHalf);
                setSmartMeterAccounts(secondHalf);
                if (!user.accountAddress) {
                    // changeUser(_accounts[0]);
                    setUser(prev => ({...prev, accountAddress: _accounts[0]}))
                }
            }
        });
    }, [accounts.length, setAccounts, user, setUser, setSmartMeterAccounts]);

    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <StepContext.Provider value={stepContextValue}>
            <OnboardingPageBody />
        </StepContext.Provider>
    );
};

export default OnboardingPage;
