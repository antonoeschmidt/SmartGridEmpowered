import { createContext, useEffect, useState } from "react";
import { OfferDTO, SupplyContractDTO } from "../models/models";
import { cableCompanyApi } from "../apis/cableCompanyApi";
import { marketApi } from "../apis/marketApi";
import { smartMeterApi } from "../apis/smartMeterApi";
import { supplyContractApi } from "../apis/supplyContractApi";
import { getAccounts } from "../apis/web3";

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
    setMarkets: (markets: string[]) => void;
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

    const deployAndRegisterSmartMeter = async () => {
        const deployedSmartMeterAddress = await deploySmartMeter(
            currentAccount
        );
        console.log('deployedSmartMeterAdress', deployedSmartMeterAddress);
        setSmartMeterAddress(deployedSmartMeterAddress);
        console.log("before cable company address");
        if (!cableCompanyAddress) return;
        console.log("after cable company address");
        await setSmartMeterMarketAddress(deployedSmartMeterAddress);
        await registerSmartMeter(deployedSmartMeterAddress, currentAccount);
    };

    // saves the new admin account to local storage
    useEffect(() => {
        if (!adminAccount) return;
        localStorage.setItem("adminAccount", adminAccount);
    }, [adminAccount]);
    // retrieves the admin account on first load.
    useEffect(() => {
        const storedAdminAccount = localStorage.getItem("adminAccount");
        setAdminAccount(storedAdminAccount);

        getAccounts().then((accounts) => {
            if (accounts) {
                setAccounts(accounts);
                if (!currentAccount) setCurrentAccount(accounts[0]);
            }
        });
    }, []);

    // triggers when the user changes account.
    useEffect(() => {
        if (!currentAccount) return;        
        const storedJsonString = localStorage.getItem(currentAccount);
        // by setting the smart meter to empty we initialize making a new one, but the other use effect only triggers if currentMarket is set.
        if (!storedJsonString) {
            setSmartMeterAddress("");
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
        parsedJson.smartMeterAddress ? setSmartMeterAddress(parsedJson.smartMeterAddress) : setSmartMeterAddress("");

        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAccount]);

    // saves data to localstorage when the user changes a setting
    useEffect(() => {
        if (!currentAccount) return;
        const json = { currentMarket, smartMeterAddress };
        localStorage.setItem(currentAccount, JSON.stringify(json));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMarket, smartMeterAddress]);

    useEffect(() => {
        if (smartMeterAddress || !currentMarket || !currentAccount) return;

        deployAndRegisterSmartMeter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMarket, currentAccount, smartMeterAddress]);

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
        if (!smartMeterAddress) {
            console.log("get battery charge, no smartmeter address");
            return;
        }
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
        console.log("setting smart meter address");
        console.log(smartMeterPubKey);
        console.log(smartMeterAddress);
        console.log(adminAccount);
        console.log(cableCompanyAddress);
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
