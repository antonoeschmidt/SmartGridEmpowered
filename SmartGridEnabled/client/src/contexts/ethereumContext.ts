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
    setSupplyContracts: React.Dispatch<React.SetStateAction<string[]>>
    offers: OfferDTO[];
    setOffers: React.Dispatch<React.SetStateAction<OfferDTO[]>>
    cableCompanyAddress: string;
    setCableCompanyAddress: (account: string) => void;
    smartMeterAddress: string;
    setSmartMeterAddress: (account: string) => void;
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
    const [cableCompanyAddress, setCableCompanyAddress] = useState<string>()
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>()

    

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
        setOffers,
        cableCompanyAddress,
        setCableCompanyAddress,
        smartMeterAddress,
        setSmartMeterAddress
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
