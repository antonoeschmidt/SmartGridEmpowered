import { createContext, useEffect, useMemo, useState } from "react";
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
    const [accounts, setAccounts] = useState<string[]>([]);
    const [currentAccount, setCurrentAccount] = useState<string>("");
    const [adminAccount, setAdminAccount] = useState<string>("");
    const [currentMarket, setCurrentMarket] = useState<string>("");
    const [markets, setMarkets] = useState<string[]>([]);
    const [supplyContracts, setSupplyContracts] = useState<string[]>();
    const [offers, setOffers] = useState<OfferDTO[]>();
    const [cableCompanyAddress, setCableCompanyAddress] = useState<string>();
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>();

    const deployAndRegisterSmartMeter = async (account: string, market: string, admin: string) => {
        let currAccount = account ?? currentAccount;
        if (!currAccount) return;
        console.log('currAccount', currAccount)
        const deployedSmartMeterAddress = await deploySmartMeter(
            currAccount
        );
        console.log('deployedSmartMeterAdress', deployedSmartMeterAddress);
        setSmartMeterAddress(deployedSmartMeterAddress);
        console.log("before cable company address");
        if (!cableCompanyAddress) return;
        console.log("after cable company address");
        await setSmartMeterMarketAddress(deployedSmartMeterAddress, market);
        await registerSmartMeter(currAccount, deployedSmartMeterAddress);
    };

    // saves the new admin account to local storage
    useEffect(() => {
        if (!adminAccount) return;
        localStorage.setItem("adminAccount", adminAccount);
    }, [adminAccount]);

    // retrieves the admin account on first load.
    useEffect(() => {
        const storedAdminAccount = localStorage.getItem("adminAccount");
        if (!storedAdminAccount) return;
        setAdminAccount(storedAdminAccount);
    }, []);


    const loadFromLocalStorage: any = (account: string) => {
        const storedJsonString = localStorage.getItem(account);
        // by setting the smart meter to empty we initialize making a new one, but the other use effect only triggers if currentMarket is set.
        if (!storedJsonString) {
            setSmartMeterAddress("");
            return {};
        }
        const parsedJson = JSON.parse(storedJsonString);
        const market = parsedJson?.currentMarket
            ? parsedJson?.currentMarket
            : markets.length > 0
            ? markets[0]
            : "";
        console.log('parsedJson.smartMeterAddress', parsedJson.smartMeterAddress)
        const smartMeterAddress =  parsedJson.smartMeterAddress ? parsedJson.smartMeterAddress : "";
        return { market, smartMeterAddress, cableCompanyAddress: parsedJson?.cableCompanyAddress ?? "" }
    }

    // saves data to localstorage when the user changes a setting
    useEffect(() => {
        if (!currentAccount) return;
        const json = { currentMarket, smartMeterAddress, cableCompanyAddress };
        localStorage.setItem(currentAccount, JSON.stringify(json));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMarket, smartMeterAddress]);

    const changeUser = async(account: string) => {
        if (!cableCompanyAddress) return;
        let admin = adminAccount;
        if (!admin) {
            if (accounts.length < 1) return;
            setAdminAccount(account[accounts.length - 1]);
            admin = accounts[accounts.length - 1];
        }

        setCurrentAccount(account);
        const loadedData = loadFromLocalStorage(account);
        if (loadedData?.cableCompanyAddress && cableCompanyAddress) {
            setCableCompanyAddress(loadedData.cableCompanyAddress);
        }
        let marketAddress = loadedData.market;
        if (!marketAddress) {
            marketAddress = await deployMarket(loadedData?.cableCompanyAddress, admin);
        }
        setCurrentMarket(marketAddress);
        if (!loadedData.smartMeterAddress) {
            deployAndRegisterSmartMeter(account, marketAddress, admin);
        }
    }

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
    const deployMarket = async (cableCompany?: string, admin?: string) => {
        return await marketApi.deployMarket(admin ?? adminAccount, cableCompany ?? cableCompanyAddress);
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
    const deploySmartMeter = async (acc?: string) => {
        return await smartMeterApi.deploySmartMeter(acc ?? currentAccount);
    };

    const getBatteryCharge = async () => {
        if (!smartMeterAddress) {
            console.log("get battery charge, no smartmeter address");
            return;
        }
        return await smartMeterApi.getBatteryCharge(smartMeterAddress);
    };

    const setSmartMeterMarketAddress = async (
        parsedSmartMeterAddress?: string,
        market?: string
    ) => {
        return await smartMeterApi.setCurrentMarketAddress(
            currentAccount,
            parsedSmartMeterAddress
                ?? smartMeterAddress,
            market ?? currentMarket
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
        smartMeterAddress: string,
    ) => {

        console.log("register smart meter: ", adminAccount,
         cableCompanyAddress,
        smartMeterPubKey,
        smartMeterAddress);
        return await smartMeterApi.registerSmartMeter(
            adminAccount,
            cableCompanyAddress,
            smartMeterPubKey,
            smartMeterAddress
        );
    };

    // SupplyContractApi
    const getSupplyContracts = async() => {
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
        setCurrentAccount: changeUser,
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
