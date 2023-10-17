import { createContext, useState } from "react";
import { EthereumInstance } from "../models/ethereumInstance";
import { Offer } from "../models/models";

export type EthereumContextType = {
    ethereumInstance: EthereumInstance;
    setEthereumInstance: React.Dispatch<React.SetStateAction<any>>
    accounts: string[];
    setAccounts: React.Dispatch<React.SetStateAction<string[]>>
    currentAccount: string;
    setCurrentAccount: React.Dispatch<React.SetStateAction<string>>
    currentMarket: string;
    setCurrentMarket: React.Dispatch<React.SetStateAction<string>>
    markets: string[];
    setMarkets: React.Dispatch<React.SetStateAction<string[]>>
    supplyContracts: string[];
    setSupplyContracts: React.Dispatch<React.SetStateAction<string[]>>
    offers: Offer[];
    setOffers: React.Dispatch<React.SetStateAction<Offer[]>>
};

export const useEthereumContext = (): EthereumContextType => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [currentAccount, setCurrentAccount] = useState<string>("");
    const [currentMarket, setCurrentMarket] = useState<string>("");
    const [markets, setMarkets] = useState<string[]>([]);
    const [offers, setOffers] = useState<Offer[]>([])
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
        offers,
        setOffers
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
