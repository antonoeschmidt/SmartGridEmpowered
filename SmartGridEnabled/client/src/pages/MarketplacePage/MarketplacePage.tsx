import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../components/Shared/DataTable/DataTable";
import {
    buyOfferColumns,
    offerColumns,
    supplyContractColumns,
} from "../../models/dataGridColumns";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import AddOfferComponent from "../../components/Market/AddOfferComponent/AddOfferComponent";
import { SupplyContractDTO } from "../../models/models";
import SuggestedPriceComponent from "../../components/Market/SuggestedPriceComponent/SuggestedPriceComponent";

const MarketplacePage = () => {
    const {
        currentMarket,
        setSupplyContracts,
        currentAccount,
        offers,
        buyOffer,
        setOffers,
        getOffers,
        getSupplyContracts,
        getSupplyContractInfo,
    } = useContext(EthereumContext);
    const [supplyContractsDTO, setSupplyContractsDTO] =
        useState<SupplyContractDTO[]>();

    const [amount, setAmount] = useState<number>();
    const [price, setPrice] = useState<number>();
    const [suggestedPrice, setSuggestedPrice] = useState<string>();

    useEffect(() => {
        if (offers || !currentMarket) return;
        getOffers()
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    }, [currentMarket, getOffers, offers, setOffers]);

    useEffect(() => {
        getSupplyContracts()
            .then((data) => {
                console.log(data);
                setSupplyContractsDTO(data);
            })
            .catch((err) => console.error(err));
    }, [getSupplyContracts]);

    useEffect(() => {
        setSuggestedPrice(Math.random().toFixed(3));
    }, []);

    const handleBuyOffer = () => async (id: string) => {
        console.log("called handleBuyOffer");

        const address = await buyOffer(id);
        const newSC = await getSupplyContractInfo(address);
        setSupplyContracts((prevState) => [...prevState, address]);
        setSupplyContractsDTO((prevState) => [...prevState, newSC]);

        getOffers()
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className={styles.container}>
            <h1>Marketplace</h1>
            {currentMarket ? (
                <>
                    <div className={styles.row}>
                        <AddOfferComponent
                            amount={amount}
                            setAmount={setAmount}
                            price={price}
                            setPrice={setPrice}
                        />
                        <SuggestedPriceComponent
                            suggestedPrice={suggestedPrice}
                        />
                    </div>
                    <div className={styles.item}>
                        <h3>Own offers</h3>
                        {offers && (
                            <DataTable
                                rows={offers.filter(
                                    (offer) => offer.owner === currentAccount
                                )}
                                columns={offerColumns}
                            />
                        )}
                    </div>
                    <div className={styles.item}>
                        <h3>Other offers</h3>
                        {offers && (
                            <DataTable
                                rows={offers.filter(
                                    (offer) => offer.owner !== currentAccount
                                )}
                                columns={buyOfferColumns(handleBuyOffer())}
                            />
                        )}
                    </div>
                    <div className={styles.item}>
                        <h3>Supply Contracts</h3>
                        {supplyContractsDTO && (
                            <DataTable
                                rows={supplyContractsDTO}
                                columns={supplyContractColumns}
                            />
                        )}
                    </div>
                </>
            ) : (
                <> Please choose a Market to view the Marketplace</>
            )}
        </div>
    );
};

export default MarketplacePage;
