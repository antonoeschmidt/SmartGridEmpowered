import { createContext, useEffect, useState } from "react";
import { OfferDTO, SupplyContractDTO } from "../models/models";
import { cableCompanyApi } from "../apis/cableCompanyApi";
import { marketApi } from "../apis/marketApi";
import { smartMeterApi } from "../apis/smartMeterApi";
import { supplyContractApi } from "../apis/supplyContractApi";

export type EthereumContextType = {
    accounts: string[];
    setAccounts: (accounts: string[]) => void;
    currentAccount: string;
    setCurrentAccount: (account: string) => void;
    adminAccount: string;
    setAdminAccount: (account: string) => void;
    currentMarket: string;
    setCurrentMarket: (address: string) => void;
    markets: string[];
    setMarkets: React.Dispatch<React.SetStateAction<string[]>>;
    supplyContracts: string[];
    setSupplyContracts: React.Dispatch<React.SetStateAction<string[]>>;
    offers: OfferDTO[];
    setOffers: React.Dispatch<React.SetStateAction<OfferDTO[]>>;
    cableCompanyAddress: string;
    setCableCompanyAddress: (account: string) => void;
    smartMeterAddress: string;
    setSmartMeterAddress: (account: string) => void;

    deployCableCompany: () => Promise<string>;
    isRegisteredKey: (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => Promise<void | [] | (unknown[] & [])>;
    deployMarket: () => Promise<string>;
    addOffer: (offer: OfferDTO) => Promise<OfferDTO>;
    getOffers: () => Promise<OfferDTO[]>;
    buyOffer: (id: string) => Promise<any>;
    deploySmartMeter: (id: string) => Promise<string>;
    getBatteryCharge: () => Promise<void | [] | (unknown[] & [])>;
    setSmartMeterMarketAddress: () => Promise<any>;
    createSmartMeterLog: (
        intervalConsumption: number,
        intervalProduction: number
    ) => Promise<any>;
    registerSmartMeter: (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => Promise<any>;
    getSupplyContracts: () => Promise<SupplyContractDTO[]>;
    getSupplyContractInfo: (
        supplyContractAddress: string
    ) => Promise<SupplyContractDTO>;
};

export const useEthereumContext = (): EthereumContextType => {
    const [accounts, setAccounts] = useState<string[]>();
    const [currentAccount, setCurrentAccount] = useState<string>("");
    const [adminAccount, setAdminAccount] = useState<string>("");
    const [currentMarket, setCurrentMarket] = useState<string>("");
    const [markets, setMarkets] = useState<string[]>([]);
    const [supplyContracts, setSupplyContracts] = useState<string[]>();
    const [offers, setOffers] = useState<OfferDTO[]>();
    const [cableCompanyAddress, setCableCompanyAddress] = useState<string>();
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>();

    // triggers when the user changes account.
    useEffect(() => {
        if (!currentAccount || !currentMarket) return;

        const deployAndRegisterSmartMeter = async () => {
            const deployedSmartMeterAddress = await deploySmartMeter(
                currentAccount
            );
            setSmartMeterAddress(deployedSmartMeterAddress);
            if (!cableCompanyAddress) return;

            await setSmartMeterMarketAddress(deployedSmartMeterAddress);
            await registerSmartMeter(deployedSmartMeterAddress, currentAccount);
        };
        // i need to define a function if I want it to be async.
        const storedJsonString = localStorage.getItem(currentAccount);
        // deploys a smart meter and registers it
        if (!storedJsonString) {
            deployAndRegisterSmartMeter();
            return;
        }
        const parsedJson = JSON.parse(storedJsonString);
        const market = parsedJson?.currentMarket
            ? parsedJson?.currentMarket
            : markets.length > 0
            ? markets[0]
            : "";
        setCurrentMarket(market);
        parsedJson?.cableCompanyAddress &&
            setCableCompanyAddress(parsedJson.cableCompanyAddress);
        if (!parsedJson.smartMeterAddress) {
            deployAndRegisterSmartMeter();
        } else {
            setSmartMeterAddress(parsedJson.smartMeterAddress);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAccount]);

    // saves data to localstorage when the user changes a setting
    useEffect(() => {
        if (!currentAccount) return;
        const json = { currentMarket, smartMeterAddress };
        localStorage.setItem(currentAccount, JSON.stringify(json));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMarket, smartMeterAddress]);

    // CableCompanyApi
    const deployCableCompany = async () => {
        return await cableCompanyApi.deployCableCompany(adminAccount);
    };

    const isRegisteredKey = async (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => {
        return await cableCompanyApi.isRegisteredKey(
            cableCompanyAddress,
            smartMeterPubKey,
            smartMeterAddress
        );
    };

    // MarketApi
    const deployMarket = async () => {
        return await marketApi.deployMarket(adminAccount, cableCompanyAddress);
    };

    const addOffer = async (offer: OfferDTO) => {
        return await marketApi.addOffer(
            offer,
            currentMarket,
            currentAccount,
            smartMeterAddress
        );
    };

    const getOffers = async () => {
        return await marketApi.getOffers(currentMarket);
    };

    const buyOffer = async (id: string) => {
        return await marketApi.buyOffer(currentMarket, id, currentAccount);
    };

    // SmartMeterApi
    const deploySmartMeter = async (id: string) => {
        return await smartMeterApi.deploySmartMeter(currentAccount);
    };

    const getBatteryCharge = async () => {
        return await smartMeterApi.getBatteryCharge(smartMeterAddress);
    };

    const setSmartMeterMarketAddress = async (
        parsedSmartMeterAddress?: string
    ) => {
        return await smartMeterApi.setCurrentMarketAddress(
            currentAccount,
            parsedSmartMeterAddress
                ? parsedSmartMeterAddress
                : smartMeterAddress,
            currentMarket
        );
    };

    const createSmartMeterLog = async (
        intervalConsumption: number,
        intervalProduction: number
    ) => {
        return await smartMeterApi.createLog(
            currentAccount,
            smartMeterAddress,
            intervalConsumption,
            intervalProduction
        );
    };

    const registerSmartMeter = async (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => {
        return await smartMeterApi.registerSmartMeter(
            adminAccount,
            cableCompanyAddress,
            smartMeterPubKey,
            smartMeterAddress
        );
    };

    // SupplyContractApi
    const getSupplyContracts = async () => {
        return await supplyContractApi.getSupplyContracts(
            supplyContracts,
            currentAccount
        );
    };

    const getSupplyContractInfo = async (supplyContractAddress: string) => {
        return await supplyContractApi.getSupplyContractInfo(
            supplyContractAddress,
            currentAccount
        );
    };

    return {
        accounts,
        setAccounts,
        currentAccount,
        setCurrentAccount,
        adminAccount,
        setAdminAccount,
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

        setSmartMeterAddress,
        deployCableCompany,
        isRegisteredKey,

        deployMarket,
        addOffer,
        getOffers,
        buyOffer,

        deploySmartMeter,
        getBatteryCharge,
        setSmartMeterMarketAddress,
        createSmartMeterLog,
        registerSmartMeter,

        getSupplyContracts,
        getSupplyContractInfo,
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
