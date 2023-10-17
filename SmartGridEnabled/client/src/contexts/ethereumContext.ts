import { createContext, useEffect, useState } from "react";
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

    useEffect(() => {
        // if (markets) return;

        ethereumInstance
            .scanBlocksForContractCreations()
            .then(({marketAddresses, supplyContractAddresses}) => {
                console.log("Scan completed.");
                setMarkets(marketAddresses);
                setSupplyContracts(supplyContractAddresses);
                if (marketAddresses.length > 0) {
                    setCurrentMarket(marketAddresses[0]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [ethereumInstance, setMarkets, setSupplyContracts]);

    useEffect(() => {
        console.log("her", markets, currentAccount);
        if (markets.length < 1 && currentAccount) {
            console.log('deploy');
            ethereumInstance.deployMarket(currentAccount).then(market => setCurrentMarket(market));
        } else if (markets && !currentMarket) {
            setCurrentMarket(markets[0]);
        }
    }, [markets, currentAccount]);

    useEffect(() => {
        ethereumInstance.getAccounts().then((accounts) => {
            console.log(accounts);
            setAccounts(accounts);
            accounts.length > 0 && setCurrentAccount(accounts[0]);
        });
    }, [ethereumInstance, setAccounts]);

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
