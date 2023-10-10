import { createContext, useState } from "react";

export type EthereumContextType = {
    accounts: string[];
    setAccounts: (accounts: string[]) => void;
    currentAccount: string;
    setCurrentAccount: (account: string) => void;
};

export const useEthereumContext = (): EthereumContextType => {
    const [accounts, setAccounts] = useState<string[]>();
    const [currentAccount, setCurrentAccount] = useState<string>("");

    return {
        accounts,
        setAccounts,
        currentAccount,
        setCurrentAccount
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
