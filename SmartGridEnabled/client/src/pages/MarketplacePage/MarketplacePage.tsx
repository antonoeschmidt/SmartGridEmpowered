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
import { OfferDTO, SupplyContractDTO } from "../../models/models";
import { Button } from "@mui/material";

const MarketplacePage = () => {
    const { ethereumInstance, currentMarket, supplyContracts, currentAccount } =
        useContext(EthereumContext);
    const [offers, setOffers] = useState<OfferDTO[]>();
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

        ethereumInstance
            .getSupplyContracts(supplyContracts)
            .then((data) => {
                console.log(data);
                setSupplyContractsDTO(data);
            })
            .catch((err) => console.error(err));
    }, [currentMarket, ethereumInstance, offers, supplyContracts]);

    const buyOffer = (market: string, account: string) => (id: string) => {
        ethereumInstance
            .buyOffer(market, id, account)
            .then((res) => console.log("res", res));
    };

    const handleClick = () => {
        ethereumInstance.deploySupplyContract(currentAccount)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => console.error(err));

    }

    return (
        <div className={styles.container}>
            <Button variant="outlined" onClick={() => handleClick()}>Deploy</Button>
            <h1>Marketplace</h1>
            {currentMarket ? (
                <>
                    <AddOfferComponent />
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
                        <h3>Own offers</h3>
                        {offers && (
                        <DataTable
                            rows={offers.filter(
                                (offer) => offer.owner === currentAccount
                            )}
                            columns={offerColumns}
                        />)}
                    </div>
                    <div className={styles.item}>
                        <h3>Supply Contracts</h3>
                    {supplyContractsDTO && (
                        <DataTable
                            rows={supplyContractsDTO}
                            columns={supplyContractColumns}
                        />)}
                    </div>
                </>
            ) : (
                <> Please choose a Market to view the Marketplace</>
            )}
        </div>
    );
};

export default MarketplacePage;
