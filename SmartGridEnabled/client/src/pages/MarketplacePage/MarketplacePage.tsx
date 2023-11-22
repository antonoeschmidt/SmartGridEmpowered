import React, { useContext, useEffect, useState, FC } from "react";
import DataTable from "../../components/Shared/DataTable/DataTable";
import {
    buyOfferColumns,
    offerColumns,
    supplyContractColumns,
} from "../../models/dataGridColumns";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import { SupplyContractDTO } from "../../models/models";
import SuggestedPriceComponent from "../../components/Market/SuggestedPriceComponent/SuggestedPriceComponent";
import { AddButton } from "../../components/common/AddButton";
import { OfferModal } from "../../components/Market/OfferModal/OfferModal";
import { Box } from "@mui/material";

const MarketplacePage: FC = () => {
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

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={styles.container}>
            <Box sx={{ justifyContent: 'space-between', display: 'flex'}}>            
            <h1>Marketplace</h1>
                {currentMarket && 
                <Box width="80px" height="80px" marginLeft={"auto"}>
                <AddButton  onClick={() => handleClickOpen()} />
                </Box>
                }
            </Box>
            {currentMarket ? (
                <>
                    <div className={styles.row}>

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
                    <OfferModal open={open} handleClose={handleClose} />
                </>
            ) : (
                <> Please choose a Market to view the Marketplace</>
            )}
        </div>
    );
};

export default MarketplacePage;
