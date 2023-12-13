import React, { useEffect } from "react";
import styles from "./MarketplacePage.module.css";
import DataTable from "../../components/Shared/DataTable/DataTable";
import { supplyContractColumns } from "../../models/dataGridColumns";
// import SuggestedPriceComponent from "../../components/Market/SuggestedPriceComponent/SuggestedPriceComponent";
import { AddButton } from "../../components/common/AddButton";
import OfferComponent from "../../components/Market/OfferComponent/OfferComponent";
import { OfferDTO, SupplyContractDTO } from "../../models/models";
import { CircularProgress } from "@mui/material";
import SupplyContractComponent from "../../components/Market/SupplyContractComponent/SupplyContractComponent";

type MarketplacePageBodyProps = {
    offers: OfferDTO[];
    currentAccount: string;
    supplyContractsDTO: SupplyContractDTO[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleBuyOffer: () => (id: string) => Promise<void>;
    removeOffer: (id: string) => Promise<void>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MarketplacePageBody = ({
    offers,
    currentAccount,
    supplyContractsDTO,
    setOpen,
    handleBuyOffer,
    removeOffer,
    loading,
    setLoading,
}: MarketplacePageBodyProps) => {
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [setLoading]);


    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress size={"5em"} />
                <h3>Fetching data..</h3>
            </div>
        );
    }

    return (
        <>
            <div className={styles.pageTop}>
                <h1>Marketplace</h1>
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        marginLeft: "auto",
                    }}
                >
                    <AddButton onClick={() => setOpen(true)} />
                </div>
            </div>

            <div className={styles.row}>
                {/* <SuggestedPriceComponent //TODO: fix
                    suggestedPrice={String(Math.random().toFixed(3))}
                /> */}
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
                                    onClickButton={() => removeOffer(offer.id)}
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
            {supplyContractsDTO && (
                <>
                    <h3>Supply Contracts</h3>
                    <div className={styles.row}>
                        {supplyContractsDTO.map((supplyContract, index) => (
                            <SupplyContractComponent
                                key={index}
                                supplyContract={supplyContract}
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
        </>
    );
};

export default MarketplacePageBody;
