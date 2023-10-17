import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import {
    offerColumns,
    supplyContractColumns,
} from "../../models/dataGridColumns";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import AddOfferComponent from "../../components/AddOfferComponent/AddOfferComponent";
import { OfferDTO, SupplyContractDTO } from "../../models/models";

const MarketplacePage = () => {
    const { ethereumInstance, currentMarket, supplyContracts } =
        useContext(EthereumContext);
    const [offers, setOffers] = useState<OfferDTO[]>();
    const [supplyContractsDTO, setSupplyContractsDTO] = useState<SupplyContractDTO[]>();
    
    useEffect(() => {
        if (offers || !currentMarket) return;
        ethereumInstance
            .getOffers(currentMarket)
            .then((data) => {
                console.log(data);
                setOffers(data);
            })
            .catch((err) => console.log(err));

        ethereumInstance.getSupplyContracts(supplyContracts)
        .then((data) => {
            console.log(data);
            setSupplyContractsDTO(data)
        })
        .catch((err) => console.error(err))
    }, [currentMarket, ethereumInstance, offers, supplyContracts]);

    return (
        <div className={styles.container}>
            <h1>Marketplace</h1>
            {currentMarket ? (
                <>
                    <AddOfferComponent />
                    <div className={styles.item}>
                        <h3>Offers</h3>
                        {offers && (
                            <DataTable rows={offers} columns={offerColumns} />
                        )}
                    </div>
                    <div className={styles.item}>
                        <h3>Supply Contracts</h3>
                        {supplyContractsDTO && (<DataTable
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
