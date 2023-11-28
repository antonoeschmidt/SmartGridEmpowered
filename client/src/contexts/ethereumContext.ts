import { createContext, useEffect, useState } from "react";
import { OfferDTO, SupplyContractDTO } from "../models/models";
import { cableCompanyApi } from "../apis/cableCompanyApi";
import { marketApi } from "../apis/marketApi";
import { smartMeterApi } from "../apis/smartMeterApi";
import { supplyContractApi } from "../apis/supplyContractApi";

export type EthereumContextType = {
    accounts: string[];
    setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
    currentAccount: string;
    setCurrentAccount: React.Dispatch<React.SetStateAction<string>>;
    adminAccount: string;
    setAdminAccount: (account: string) => void;
    currentMarket: string;
    setCurrentMarket: (address: string) => void;
    markets: string[];
    setMarkets: React.Dispatch<React.SetStateAction<string[]>>;
    supplyContractAddresses: string[];
    setSupplyContractAddresses: React.Dispatch<React.SetStateAction<string[]>>;
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
    const [currentAccount, setCurrentAccount] = useState<string>();
    const [adminAccount, setAdminAccount] = useState<string>();
    const [currentMarket, setCurrentMarket] = useState<string>();
    const [markets, setMarkets] = useState<string[]>([]);
    const [supplyContractAddresses, setSupplyContractAddresses] = useState<
        string[]
    >([]);
    const [offers, setOffers] = useState<OfferDTO[]>();
    const [cableCompanyAddress, setCableCompanyAddress] = useState<string>();
    const [smartMeterAddress, setSmartMeterAddress] = useState<string>();

    const deployAndRegisterSmartMeter = async (
        account: string,
        market: string,
        admin: string
    ) => {
        let currAccount = account ?? currentAccount;
        if (!currAccount) return;
        const deployedSmartMeterAddress = await deploySmartMeter(currAccount);
        setSmartMeterAddress(deployedSmartMeterAddress);
        if (!cableCompanyAddress) return;
        await setSmartMeterMarketAddress(
            deployedSmartMeterAddress,
            market,
            account
        );
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
        const smartMeterAddress = parsedJson.smartMeterAddress
            ? parsedJson.smartMeterAddress
            : "";
        return {
            market,
            smartMeterAddress,
            cableCompanyAddress: parsedJson?.cableCompanyAddress ?? "",
        };
    };

    // saves data to localstorage when the user changes a setting
    useEffect(() => {
        if (!currentAccount) return;
        const json = { currentMarket, smartMeterAddress, cableCompanyAddress };
        localStorage.setItem(currentAccount, JSON.stringify(json));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMarket, smartMeterAddress]);

    const changeUser = async (account: string) => {
        setCurrentAccount(account);
        if (!cableCompanyAddress) return;
        let admin = adminAccount;
        if (!admin) {
            if (accounts.length < 1) return;
            admin = [...accounts].pop();
            setAdminAccount(admin);
        }
        const loadedData = loadFromLocalStorage(account);
        if (loadedData?.cableCompanyAddress && cableCompanyAddress) {
            setCableCompanyAddress(loadedData.cableCompanyAddress);
        }
        let marketAddress = loadedData.market ?? markets[0];
        if (!marketAddress) {
            marketAddress = await deployMarket(
                loadedData?.cableCompanyAddress,
                admin
            );
        }
        setCurrentMarket(marketAddress);
        if (!loadedData.smartMeterAddress) {
            deployAndRegisterSmartMeter(account, marketAddress, admin);
        }
    };

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
        return await marketApi.deployMarket(
            admin ?? adminAccount,
            cableCompany ?? cableCompanyAddress
        );
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
        if (!currentAccount) {
            alert("No account selected");
            return;
        }
        return await marketApi.buyOffer(currentMarket, id, currentAccount);
    };

    // SmartMeterApi
    const deploySmartMeter = async (acc?: string) => {
        return await smartMeterApi.deploySmartMeter(acc ?? currentAccount);
    };

    const getBatteryCharge = async () => {
        if (!smartMeterAddress) {
            console.log("Get battery charge, No Smartmeter address");
            return;
        }
        return await smartMeterApi.getBatteryCharge(smartMeterAddress);
    };

    const setSmartMeterMarketAddress = async (
        parsedSmartMeterAddress?: string,
        market?: string,
        account?: string
    ) => {
        return await smartMeterApi.setCurrentMarketAddress(
            account ?? currentAccount,
            parsedSmartMeterAddress ?? smartMeterAddress,
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
            supplyContractAddresses,
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
        supplyContractAddresses,
        setSupplyContractAddresses,
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
