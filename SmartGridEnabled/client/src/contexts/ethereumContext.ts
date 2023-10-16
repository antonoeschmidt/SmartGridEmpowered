import { createContext, useState } from "react";
import { EthereumInstance } from "../models/ethereumInstance";

export type EthereumContextType = {
    ethereumInstance: EthereumInstance;
    setEthereumInstance: (d: any) => void;
    accounts: string[];
    setAccounts: (accounts: string[]) => void;
    currentAccount: string;
    setCurrentAccount: (account: string) => void;
    currentMarket: string;
    setCurrentMarket: (address: string) => void;
    markets: string[];
    setMarkets: (markets: string[]) => void;
    supplyContracts: string[];
    setSupplyContracts: (addresses: string[]) => void;
};

export const useEthereumContext = (): EthereumContextType => {
    const [accounts, setAccounts] = useState<string[]>();
    const [currentAccount, setCurrentAccount] = useState<string>("");
    const [currentMarket, setCurrentMarket] = useState<string>("");
    const [markets, setMarkets] = useState<string[]>();
    const [ethereumInstance, setEthereumInstance] = useState<EthereumInstance>(
        new EthereumInstance()
    );
    const [supplyContracts, setSupplyContracts] = useState<string[]>();

    return {
        ethereumInstance,
        setEthereumInstance,
        accounts,
        setAccounts,
        currentAccount,
        setCurrentAccount,
        currentMarket,
        setCurrentMarket,
        markets,
        setMarkets,
        supplyContracts,
        setSupplyContracts,
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
