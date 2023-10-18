import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import {
    buyOfferColumns,
    offerColumns,
    supplyContractColumns,
} from "../../models/dataGridColumns";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import AddOfferComponent from "../../components/AddOfferComponent/AddOfferComponent";
import { SupplyContractDTO } from "../../models/models";

const MarketplacePage = () => {
    const {
        ethereumInstance,
        currentMarket,
        supplyContracts,
        setSupplyContracts,
        currentAccount,
        offers,
        setOffers,
    } = useContext(EthereumContext);
    const [supplyContractsDTO, setSupplyContractsDTO] =
        useState<SupplyContractDTO[]>();

    useEffect(() => {
        if (offers || !currentMarket) return;
        ethereumInstance
            .getOffers(currentMarket)
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    }, [currentMarket, ethereumInstance, offers, setOffers]);

    useEffect(() => {
        ethereumInstance
            .getSupplyContracts(supplyContracts)
            .then((data) => {
                console.log(data);
                setSupplyContractsDTO(data);
            })
            .catch((err) => console.error(err));
    }, [ethereumInstance, supplyContracts]);

    const buyOffer = (market: string, account: string) => async (id: string) => {
        const address = await ethereumInstance.buyOffer(market, id, account);
        const newSC = await ethereumInstance.getSupplyContractInfo(address)
        setSupplyContracts(prevState => [...prevState, address])
        setSupplyContractsDTO(prevState => [...prevState, newSC])
    };

    return (
        <div className={styles.container}>
            <h1>Marketplace</h1>
            {currentMarket ? (
                <>
                    <AddOfferComponent />
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
                                columns={buyOfferColumns(
                                    buyOffer(currentMarket, currentAccount)
                                )}
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
