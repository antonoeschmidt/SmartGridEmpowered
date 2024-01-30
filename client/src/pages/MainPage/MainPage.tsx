import { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import EthereumContext from "../../contexts/ethereumContext";
import { getAccounts, scanBlocksForContractCreations } from "../../apis/web3";
import PersistentDrawerLeft from "./PersistentDrawer";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
    const {
        setMarkets,
        markets,
        setDSOAddress,
        accounts,
        setAccounts,
        setSmartMeterAccounts,
        user,
        setUser
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
                        DSOAddresses,
                    }) => {
                        console.log("Scan completed.");
                        console.log("marketAddresses", marketAddresses);
                        console.log(
                            "DSOAddresses",
                            DSOAddresses
                        );
                        setMarkets(marketAddresses);
                        if (DSOAddresses.length > 0) {
                            setDSOAddress(DSOAddresses[0]);
                        }
                    }
                )
                .catch((error) => {
                    console.error("Error:", error);
                });
        };
        return () => getData();
    }, [user.market, setDSOAddress, setMarkets]);

    useEffect(() => {
        if (!user.market && markets) setUser(prev => ({...prev, market: markets[0]}));
    }, [user.market, markets, setUser]);

    useEffect(() => {
        if (accounts.length > 0) return;
        getAccounts().then((_accounts) => {
            if (_accounts.length > 0) {
                // Calculate the middle index
                const middleIndex: number = Math.floor(_accounts.length / 2);

                // Take the first half of the array
                const firstHalf = _accounts.slice(0, middleIndex);

                // Take the second half of the array
                const secondHalf = _accounts.slice(middleIndex);
                setAccounts(firstHalf);
                setSmartMeterAccounts(secondHalf);
                if (!user.accountAddress) {
                    setUser(prev => ({...prev, accountAddress: _accounts[0]}));
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
