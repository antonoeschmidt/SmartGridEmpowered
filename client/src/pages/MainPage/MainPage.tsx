import { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import EthereumContext from "../../contexts/ethereumContext";
import { getAccounts, scanBlocksForContractCreations } from "../../apis/web3";
import PersistentDrawerLeft from "./PersistentDrawer";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
    const {
        setMarkets,
        setSupplyContractAddresses: setSupplyContracts,
        setCurrentMarket,
        currentMarket,
        markets,
        setCableCompanyAddress,
        accounts,
        setAccounts,
        currentAccount,
        setCurrentAccount,
    } = useContext(EthereumContext);

    const navigate = useNavigate();
    // a little bit lazy but it massively reduces the amount of calls.
    const fetchedContracts = useRef<boolean>(false);

    useEffect(() => {
        const getData = () => {
            if (fetchedContracts.current) return;
            fetchedContracts.current = true;
            scanBlocksForContractCreations()
                .then(
                    ({
                        marketAddresses,
                        supplyContractAddresses,
                        cableCompanyAddresses,
                    }) => {
                        console.log("Scan completed.");
                        console.log("marketAddresses", marketAddresses);
                        console.log(
                            "supplyContractAddresses",
                            supplyContractAddresses
                        );
                        console.log(
                            "cableCompanyAddresses",
                            cableCompanyAddresses
                        );
                        setMarkets(marketAddresses);
                        setSupplyContracts(supplyContractAddresses);
                        if (cableCompanyAddresses.length > 0) {
                            setCableCompanyAddress(cableCompanyAddresses[0]);
                        }
                    }
                )
                .catch((error) => {
                    console.error("Error:", error);
                });
        };
        return () => getData();
    }, [currentMarket, setCableCompanyAddress, setMarkets, setSupplyContracts]);

    useEffect(() => {
        if (!currentMarket && markets) setCurrentMarket(markets[0]);
    }, [currentMarket, markets, setCurrentMarket]);

    useEffect(() => {
        if (accounts.length > 0) return;
        getAccounts().then((_accounts) => {
            if (_accounts.length > 0) {
                setAccounts(_accounts);
                if (!currentAccount) {
                    setCurrentAccount(_accounts[0]);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (localStorage.getItem("onboarded") !== "true") {
        navigate("/onboarding");
    }

    return <PersistentDrawerLeft children={<Outlet />} />;
};

export default MainPage;
