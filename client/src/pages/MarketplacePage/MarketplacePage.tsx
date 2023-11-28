import React, { useContext, useEffect, useState, FC } from "react";
import DataTable from "../../components/Shared/DataTable/DataTable";
import { supplyContractColumns } from "../../models/dataGridColumns";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import { SupplyContractDTO } from "../../models/models";
import SuggestedPriceComponent from "../../components/Market/SuggestedPriceComponent/SuggestedPriceComponent";
import { AddButton } from "../../components/common/AddButton";
import { OfferModal } from "../../components/Market/OfferModal/OfferModal";
import OfferComponent from "../../components/Market/OfferComponent/OfferComponent";
import { getAccounts, scanBlocksForContractCreations } from "../../apis/web3";

const MarketplacePage: FC = () => {
    const {
        currentMarket,
        setSupplyContractAddresses,
        currentAccount,
        offers,
        buyOffer,
        setOffers,
        getOffers,
        getSupplyContracts,
        getSupplyContractInfo,
        supplyContractAddresses: supplyContracts
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
                console.log("getSupply contracts", data);
                setSupplyContractsDTO(data);
            })
            .catch((err) => console.error(err));
    }, [getSupplyContracts, setSupplyContractAddresses, supplyContracts.length, currentAccount]);

    const handleBuyOffer = () => async (id: string) => {
        console.log("called handleBuyOffer");

        const address = await buyOffer(id);
        console.log('sc address', address);
        if (!address) {
            alert("Buy offer didn't return an address");
            return;
        }
        const newSC = await getSupplyContractInfo(address);
        console.log('newSC', newSC)
        setSupplyContractAddresses((prevState) => [...prevState, address]);
        setSupplyContractsDTO((prevState) => [...prevState, newSC]);

        getOffers()
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    };
    const removeOffer = () => async (id: string) => {
        console.log("called remove offer");

        alert("Not implemented yet");
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!currentMarket) {
        return (
            <div className={styles.container}>
                Please choose a Market to view the Marketplace
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageTop}>
                <h1>Marketplace</h1>
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        marginLeft: "auto",
                    }}
                >
                    <AddButton onClick={() => handleClickOpen()} />
                </div>
            </div>

            <div className={styles.row}>
                <SuggestedPriceComponent suggestedPrice={String(Math.random().toFixed(3))} />
            </div>
            {offers && (
                <>
                    <h3>Your offers</h3>
                    <div className={styles.row}>
                        {offers
                            .filter((offer) => offer.owner === currentAccount)
                            .map((offer, index) => (
                                <OfferComponent
                                    key={index}
                                    offer={offer}
                                    ownOffer={true}
                                    onClickButton={removeOffer()}
                                />
                            ))}
                    </div>
                </>
            )}
            {offers && (
                <>
                    <h3>Market offers</h3>
                    <div className={styles.row}>
                        {offers
                            .filter((offer) => offer.owner !== currentAccount)
                            .map((offer, index) => (
                                <OfferComponent
                                    key={index}
                                    offer={offer}
                                    onClickButton={handleBuyOffer()}
                                />
                            ))}
                    </div>
                </>
            )}
            <div className={styles.item} style={{ maxWidth: "100vh" }}>
                <h3>Supply Contracts</h3>
                {supplyContractsDTO && (
                    <DataTable
                        rows={supplyContractsDTO}
                        columns={supplyContractColumns}
                    />
                )}
            </div>
            <OfferModal open={open} handleClose={handleClose} />
        </div>
    );
};

export default MarketplacePage;
