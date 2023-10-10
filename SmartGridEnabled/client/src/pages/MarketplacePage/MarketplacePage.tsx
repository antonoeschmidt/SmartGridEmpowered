import React from "react";
import DataTable from "../../components/DataTable/DataTable";
import { supplyContractColumns } from "../../models/dataGridColumns";
import { GridRowsProp } from "@mui/x-data-grid";
import styles from "./MarketplacePage.module.css";

const MarketplacePage = () => {
    const rows: GridRowsProp = [
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

    

    return (
        <div className={styles.container}>
            <h1>Marketplace</h1>
            <div className={styles.item}>
                <h3>Supply Contracts</h3>
                <DataTable rows={rows} columns={supplyContractColumns} />
            </div>
            <div className={styles.item}>
                <h3>Offers</h3>
                <DataTable rows={rows} columns={supplyContractColumns} />
            </div>
        </div>
    );
};

export default MarketplacePage;
