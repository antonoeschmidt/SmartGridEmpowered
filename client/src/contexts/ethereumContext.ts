import { createContext, useEffect, useState } from "react";
import { OfferDTO, SupplyContractDTO } from "../models/models";
import { cableCompanyApi } from "../apis/cableCompanyApi";
import { marketApi } from "../apis/marketApi";
import { smartMeterApi } from "../apis/smartMeterApi";
import { supplyContractApi } from "../apis/supplyContractApi";
import { sign } from "../apis/groupSignature";
import { loadFromLocalStorage } from "../utils/localstorage";

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
    buyOffer: (id: string, offer: OfferDTO) => Promise<any>;
    deploySmartMeter: (id: string) => Promise<string>;
    getBatteryCharge: () => Promise<void | [] | (unknown[] & [])>;
    setSmartMeterMarketAddress: (
        account?: string,
        parsedSmartMeterAddress?: string,
        market?: string
    ) => Promise<any>;
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
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    removeOffer: (offerId: string) => any;
    currentAccountSignature: string;
    setCurrentAccountSignature: React.Dispatch<React.SetStateAction<string>>;

    newSignatureDialog: () => string;
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
    const [loading, setLoading] = useState(false);
    const [currentAccountSignature, setCurrentAccountSignature] =
        useState<string>();

    const deployAndRegisterSmartMeter = async (account: string) => {
        if (!account) {
            console.error(
                "Could not deploy and register smart meter. No current account"
            );
            return;
        }
        const deployedSmartMeterAddress = await deploySmartMeter(account);
        setSmartMeterAddress(deployedSmartMeterAddress);
        if (!cableCompanyAddress) {
            console.error(
                "No cable company address found. Cannot set smartMeterAddress and register the market on it"
            );
            return;
        }

        let res = await setSmartMeterMarketAddress(
            account,
            deployedSmartMeterAddress,
            currentMarket
        );
        console.log("setSmartMeterMarketAddress", res);

        res = await registerSmartMeter(account, deployedSmartMeterAddress);
        console.log("registerSmartMeter", res);
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

    useEffect(() => {
        const storedCableCompanyAddress = localStorage.getItem("cableCompany");
        if (!storedCableCompanyAddress) return;
        setCableCompanyAddress(storedCableCompanyAddress);
    }, []);


    // saves data to localstorage when the user changes a setting
    useEffect(() => {
        if (!currentAccount) return;
        const json = { smartMeterAddress, signature: currentAccountSignature };
        localStorage.setItem(currentAccount, JSON.stringify(json));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartMeterAddress]);

    useEffect(() => {
        console.log("Current account changed");
        const changeUser = async () => {
            if (!currentAccount) return;
            let _cableCompanyAddress =
                cableCompanyAddress && localStorage.getItem("cableCompany");
            if (!_cableCompanyAddress) {
                console.error("Cannot change user. No cable company address");
                return;
            }

            const loadedData = loadFromLocalStorage(currentAccount);
            setCurrentAccountSignature(loadedData.signature);
            if (!loadedData.smartMeterAddress) {
                console.log(
                    "No SmartMeter found for current user. Deploying new one."
                );
                deployAndRegisterSmartMeter(currentAccount);
            } else {
                setSmartMeterAddress(loadedData.smartMeterAddress);
            }
        };

        changeUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAccount]);

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

    const buyOffer = async (id: string, offer: OfferDTO) => {
        if (!currentAccount) {
            alert("No account selected");
            return;
        }
        let signature = currentAccountSignature;
        if (!signature) {
            signature = newSignatureDialog();
            if (!signature) {
                return;
            }
        }

        const buyerSignature = await sign(
            JSON.stringify({
                amount: offer.amount,
                price: offer.price,
                sellerSignature: offer.sellerSignature,
                nonce: Number(offer.nonce),
            }),
            signature
        );

        return await marketApi.buyOffer(
            currentMarket,
            id,
            currentAccount,
            buyerSignature
        );
    };

    const newSignatureDialog = () => {
        // eslint-disable-next-line no-restricted-globals
        const con = confirm(
            "No group signature provided for current user. You want to add it?"
        );
        if (!con) {
            return;
        }
        const signature = prompt("Please enter your group signature");

        // check formatting is base64

        if (!signature) {
            return;
        }
        setCurrentAccountSignature(signature);
        return signature;
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
        _account?: string,
        _smartMeterAddress?: string,
        _market?: string
    ) => {
        return await smartMeterApi.setCurrentMarketAddress(
            _account ?? currentAccount,
            _smartMeterAddress ?? smartMeterAddress,
            _market ?? currentMarket
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

    const removeOffer = async (offerId: string) => {
        const res = await marketApi.removeOffer(
            currentMarket,
            offerId,
            smartMeterAddress,
            currentAccount
        );
        return res;
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
        removeOffer,

        deploySmartMeter,
        getBatteryCharge,
        setSmartMeterMarketAddress,
        createSmartMeterLog,
        registerSmartMeter,

        getSupplyContracts,
        getSupplyContractInfo,

        loading,
        setLoading,
        currentAccountSignature,
        setCurrentAccountSignature,

        newSignatureDialog,
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
