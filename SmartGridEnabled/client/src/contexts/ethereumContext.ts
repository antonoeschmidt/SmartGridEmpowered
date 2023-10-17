import { createContext, useState } from "react";
import { EthereumInstance } from "../models/ethereumInstance";
import { OfferDTO } from "../models/models";

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
    offers: OfferDTO[];
    setOffers: (addresses: OfferDTO[]) => void;
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
    const [offers, setOffers] = useState<OfferDTO[]>();

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
