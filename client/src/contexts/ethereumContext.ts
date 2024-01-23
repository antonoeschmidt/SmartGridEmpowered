import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { ApprovedContractDTO, OfferDTO, PendingOfferDTO } from "../models/models";
import { DSOApi } from "../apis/DSOApi";
import { marketApi } from "../apis/marketApi";
import { smartMeterApi } from "../apis/smartMeterApi";
import { sign } from "../apis/groupSignature";
import { getSmartMeterSecrets, loadFromLocalStorage } from "../utils/localstorage";
import { getPastEvents } from "../apis/web3";
import Market from "../contracts/Market.json";
import { approvedContractParser } from "../utils/parsers";

export type User = {
    smartMeterAddress: string;
    accountAddress: string;
    groupSecretKey: string;
    market: string;
    sellerSignatures: string[];
    buyerSignatures: string[];
    secret: string;
}

export type EthereumContextType = {
    accounts: string[];
    setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
    adminAccount: string;
    setAdminAccount: (account: string) => void;
    markets: string[];
    setMarkets: React.Dispatch<React.SetStateAction<string[]>>;
    offers: OfferDTO[];
    setOffers: React.Dispatch<React.SetStateAction<OfferDTO[]>>;
    DSOAddress: string;
    setDSOAddress: React.Dispatch<React.SetStateAction<String>>;

    deployDSO: () => Promise<string>;
    isRegisteredKey: (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => Promise<void | [] | (unknown[] & [])>;
    deployMarket: (DSO?: string, admin?: string, smartMeterContract?: string) => Promise<string>;
    addOffer: (offer: OfferDTO) => Promise<OfferDTO>;
    getOffers: () => Promise<OfferDTO[]>;
    buyOffer: (id: string, offer: OfferDTO) => Promise<any>;
    createSmartMeter: (smartMeterAddress: string, acc?: string, market?: string) => Promise<any>;
    getBatteryCharge: () => Promise<void | [] | (unknown[] & [])>;
    setSmartMeterMarketAddress: (
        smartMeterAddress?: string,
        newMarketAddress?: string
    ) => Promise<any>;
    createSmartMeterLog: (
        intervalConsumption: number,
        intervalProduction: number
    ) => Promise<any>;
    registerSmartMeter: (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => Promise<any>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    removeOffer: (offerId: string) => any;
    newKeyDialog: () => string;
    deploySmartMeter: () => Promise<string>;
    smartMeterContractAddress: React.MutableRefObject<string>
    smartMeterAccounts: string[];
    setSmartMeterAccounts: React.Dispatch<React.SetStateAction<string[]>>;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    user: User;
    changeUser: (address: string) => void;
    approvePendingOffers: (offerIndicies: boolean[]) => Promise<any>;
    getPendingOffers: () => void;
    getApprovedContracts: () => void;

    pendingOffers: PendingOfferDTO[];
    setPendingOffers: React.Dispatch<React.SetStateAction<PendingOfferDTO[]>>;

    approvedContracts: ApprovedContractDTO[];
    setApprovedContracts: React.Dispatch<React.SetStateAction<ApprovedContractDTO[]>>;
};

export const useEthereumContext = (): EthereumContextType => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [adminAccount, setAdminAccount] = useState<string>();
    const [markets, setMarkets] = useState<string[]>([]);
    const [offers, setOffers] = useState<OfferDTO[]>();
    const [DSOAddress, setDSOAddress] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [pendingOffers, setPendingOffers] = useState<PendingOfferDTO[]>([]);
    const [approvedContracts, setApprovedContracts] = useState<ApprovedContractDTO[]>([]);

    const [user, setUser] = useState<User>({
        smartMeterAddress: "",
        accountAddress: "",
        groupSecretKey: "",
        market: "",
        sellerSignatures: [],
        buyerSignatures: [],
        secret: ""
    });

    const [smartMeterAccounts, setSmartMeterAccounts] = useState<string[]>([]);
    // const [smartMeterContractAddress, setSmartMeterContractAddress] = useState<string>("");
    const smartMeterContractAddress = useRef<string>("");

    // saves the new admin account to local storage
    useEffect(() => {
        if (!adminAccount) return;
        localStorage.setItem("adminAccount", adminAccount);
    }, [adminAccount]);


    // saves data to localstorage when the user changes a setting
    useEffect(() => {
        if (!user.accountAddress) return;
        localStorage.setItem(user.accountAddress, JSON.stringify(user));
    }, [user]);

    const registerSmartMeter = useCallback(async (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => {
        return await smartMeterApi.registerSmartMeter(
            adminAccount,
            DSOAddress,
            smartMeterPubKey,
            smartMeterAddress
        );
    }, [DSOAddress, adminAccount]);

    const changeUser = useCallback(async (address: string) => {
        if (!address) return;
        const loadedData = loadFromLocalStorage(address);
            let smartMeterAddress: string = loadedData?.smartMeterAddress;
            let secret: string = loadedData?.secret;
            if (!smartMeterAddress) {
                const addressIndex = accounts.indexOf(address);
                smartMeterAddress = smartMeterAccounts[addressIndex];
                const { nextSecret, nextSecretHash } = getSmartMeterSecrets(user.accountAddress);
                secret = nextSecret;
                console.log('user.market', user.market);
                await smartMeterApi.createSmartMeter(user.market, smartMeterAddress, address, smartMeterContractAddress.current, nextSecretHash);
                await registerSmartMeter(address, smartMeterAddress);
            }
            localStorage.setItem("currentUser", address);
            setUser({
                accountAddress: address,
                smartMeterAddress: smartMeterAddress,
                groupSecretKey: loadedData?.groupSecretKey ?? "",
                secret: secret,
                sellerSignatures: loadedData?.sellerSignatures ?? [],
                buyerSignatures: loadedData?.buyerSignatures ?? [],
                market: user.market
            });
    }, [accounts, registerSmartMeter, smartMeterAccounts, user.accountAddress, user.market]);

    // retrieves the admin account on first load.
    useEffect(() => {
        const storedAdminAccount = localStorage.getItem("adminAccount");
        if (storedAdminAccount) setAdminAccount(storedAdminAccount);
        const storedDSOAddress = localStorage.getItem("DSO");
        if (storedDSOAddress) setDSOAddress(storedDSOAddress);
        const storedSmartMeterContractAddress = localStorage.getItem("smartMeterContractAddress");
        if (storedSmartMeterContractAddress) smartMeterContractAddress.current = storedSmartMeterContractAddress;
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) changeUser(currentUser);
    }, [changeUser]);


    // DSOApi
    const deployDSO = async () => {
        console.log('adminAccount deploy', adminAccount);
        return await DSOApi.deployDSO(adminAccount);
    };

    const isRegisteredKey = async (
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => {
        return await DSOApi.isRegisteredKey(
            DSOAddress,
            smartMeterPubKey,
            smartMeterAddress
        );
    };

    // MarketApi
    const deployMarket = async (_DSOAddress?: string, admin?: string, smartMeterContract?: string) => {
        return await marketApi.deployMarket(
            admin ?? adminAccount,
            _DSOAddress ?? DSOAddress,
            smartMeterContract ?? smartMeterContractAddress.current
        );
    };

    const addOffer = async (offer: OfferDTO) => {
        const {currentSecretEncoded, nextSecret, nextSecretHash} = getSmartMeterSecrets(user.accountAddress);
        setUser(prev => {
            const signatures = prev.sellerSignatures;
            signatures.push(offer.sellerSignature);
            return {...prev, secret: nextSecret, sellerSignatures: signatures};
        });
        return await marketApi.addOffer(
            offer,
            user.market,
            user.accountAddress,
            user.smartMeterAddress,
            currentSecretEncoded,
            nextSecretHash,
        );
    };

    const getOffers = async () => {
        return await marketApi.getOffers(user.market);
    };

    const buyOffer = async (id: string, offer: OfferDTO) => {
        if (!user.accountAddress) {
            alert("No account selected");
            return;
        }
        let signature = user.groupSecretKey;
        if (!signature) {
            signature = newKeyDialog();
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

        setUser(prev => {
            const buyerSignatures = prev.buyerSignatures;
            buyerSignatures.push(buyerSignature);
            return {...prev, buyerSignatures};
        });

        return await marketApi.buyOffer(
            user.market,
            id,
            user.accountAddress,
            buyerSignature
        );
    };

    const newKeyDialog = () => {
        // eslint-disable-next-line no-restricted-globals
        const con = confirm(
            "No group key provided for current user. You want to add it?"
        );
        if (!con) {
            return;
        }
        const key = prompt("Please enter your group secret key");

        // check formatting is base64

        if (!key) {
            return;
        }
        setUser(prev => ({...prev, groupSecretKey: key}));
        return key;
    };

    // SmartMeterApi
    const createSmartMeter = async (smartMeterAddress: string, sender?: string, market?: string) => {
        const { nextSecret, nextSecretHash } = getSmartMeterSecrets(user.accountAddress);
        console.log('nextSecret', nextSecret);
        setUser(prev => ({...prev, secret: nextSecret}));
        return await smartMeterApi.createSmartMeter(market ?? user.market, smartMeterAddress, sender ?? user.accountAddress, smartMeterContractAddress.current, nextSecretHash);
    };

    const getBatteryCharge = async () => {
        if (!user.smartMeterAddress) {
            console.log("Get battery charge, No Smartmeter address");
            return;
        }
        return await smartMeterApi.getBatteryCharge(smartMeterContractAddress.current, user.smartMeterAddress);
    };

    const setSmartMeterMarketAddress = async (
        _smartMeterAddress?: string,
        _market?: string
    ) => {
        return await smartMeterApi.setMarketAddress(
            _smartMeterAddress ?? user.smartMeterAddress,
            smartMeterContractAddress.current,
            _market ?? user.market
        );
    };

    const createSmartMeterLog = async (
        intervalConsumption: number,
        intervalProduction: number
    ) => {
        return await smartMeterApi.createLog(
            user.smartMeterAddress,
            smartMeterContractAddress.current,
            intervalConsumption,
            intervalProduction
        );
    };

    


    const removeOffer = async (offerId: string) => {
        const res = await marketApi.removeOffer(
            user.market,
            offerId,
            user.accountAddress
        );
        return res;
    };

    const deploySmartMeter = async() => {
        const address = await smartMeterApi.deploySmartMeter(adminAccount);
        // setSmartMeterContractAddress(address);
        return address;
    }

    const getPendingOffers = async() => {
        const pendingOffersResponse = await marketApi.getPendingOffers(user.market, user.accountAddress);
        console.log('pendingOffersResponse', pendingOffersResponse)
        setPendingOffers(pendingOffersResponse);
    }

    const approvePendingOffers = async(offerIndicies: boolean[]) => {
        console.log('{adminAccount, offerIndicies, user.market}', {adminAccount, offerIndicies, market: user.market})
        return await marketApi.approvePendingOffers(adminAccount, offerIndicies, user.market)
    }

    const getApprovedContracts = async() => {
        const approvedContractsResponse =  await getPastEvents(user.market, Market.abi, "SupplyContract");
        console.log('approvedContractsResponse', approvedContractsResponse)
        if (!approvedContractsResponse) return;
        const parsedContracts = approvedContractsResponse.map(contract => approvedContractParser(contract));
        console.log('parsedContracts', parsedContracts);
        setApprovedContracts(parsedContracts);
    }

    return {
        accounts,
        setAccounts,
        adminAccount,
        setAdminAccount,
        markets,
        setMarkets,
        offers,
        setOffers,
        DSOAddress,
        setDSOAddress,
        deployDSO,
        isRegisteredKey,

        deployMarket,
        addOffer,
        getOffers,
        buyOffer,
        removeOffer,

        createSmartMeter,
        getBatteryCharge,
        setSmartMeterMarketAddress,
        createSmartMeterLog,
        registerSmartMeter,

        loading,
        setLoading,

        newKeyDialog,
        deploySmartMeter,
        smartMeterContractAddress,
        smartMeterAccounts,
        setSmartMeterAccounts,

        user,
        setUser,
        changeUser,
        approvePendingOffers,

        getPendingOffers,
        setPendingOffers,
        pendingOffers,

        getApprovedContracts,
        approvedContracts,
        setApprovedContracts,        
    };
};

const EthereumContext = createContext<EthereumContextType>(null);

export default EthereumContext;
