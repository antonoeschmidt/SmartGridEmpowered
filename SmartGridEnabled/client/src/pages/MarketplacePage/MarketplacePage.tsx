import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import {
    buyOfferColumns,
    offerColumns,
    supplyContractColumns,
} from "../../models/dataGridColumns";
import { GridRowsProp } from "@mui/x-data-grid";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import AddOfferComponent from "../../components/AddOfferComponent/AddOfferComponent";
import { Offer } from "../../models/models";

const MarketplacePage = () => {
    const { ethereumInstance, currentMarket, currentAccount, offers, setOffers } = useContext(EthereumContext);
    
    const supplyContracts: GridRowsProp = [
        {
            id: 1,
            buyer: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            seller: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            amount: 1,
            price: "100",
            createdAt: "100",
        },
        {
            id: 2,
            buyer: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            seller: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            amount: 200,
            price: "100",
            createdAt: "100",
        },
        {
            id: 3,
            buyer: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            seller: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            amount: 5,
            price: "100",
            createdAt: "100",
        },
        {
            id: 4,
            buyer: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            seller: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            amount: 5,
            price: "100",
            createdAt: "100",
        },
        {
            id: 5,
            buyer: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            seller: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            amount: 5,
            price: "100",
            createdAt: "100",
        },
        {
            id: 6,
            buyer: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            seller: "0xCD077dC9892C3F153Ae9f182d73FfD8be448eD95",
            amount: 5,
            price: "100",
            createdAt: "100",
        },
    ];

    useEffect(() => {
        // if (offers) return
        if (!currentMarket) return;
        ethereumInstance.getOffers(currentMarket)
        .then((data) =>  {
            console.log("useEffectOffers", data) 
            setOffers(data)
        })
        .catch((err) => console.log(err))  
    }, [currentMarket, ethereumInstance])

    const buyOffer = (market: string, account: string) => (id: string) => {
        console.log("buy offer");
        ethereumInstance.buyOffer(market, id, account).then(res => console.log('res', res));
    }
    
    return (
        <div className={styles.container}>
            <h1>Marketplace</h1>
            <AddOfferComponent />
            <div className={styles.item}>
                <h3>Other offers</h3>
                    {offers && (<DataTable rows={offers.filter(offer => offer.owner != currentAccount)}  columns={buyOfferColumns(buyOffer(currentMarket, currentAccount))} />)} 
            </div>
            <div className={styles.item}>
                <h3>Own offers</h3>
                <DataTable
                    rows={offers.filter(offer => offer.owner === currentAccount)}
                    columns={offerColumns}
                />
            </div>
            <div className={styles.item}>
                <h3>Supply Contracts</h3>
                <DataTable
                    rows={supplyContracts}
                    columns={supplyContractColumns}
                />
            </div>
            
        </div>
    );
};

export default MarketplacePage;
