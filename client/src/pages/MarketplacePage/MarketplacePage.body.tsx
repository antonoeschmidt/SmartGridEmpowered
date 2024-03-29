import React, { useContext, useEffect } from "react";
import styles from "./MarketplacePage.module.css";
import { AddButton } from "../../components/common/AddButton";
import OfferComponent from "../../components/Market/OfferComponent/OfferComponent";
import {
    OfferDTO,
    PendingSupplyContractDTO,
    ApprovedSupplyContractDTO,
} from "../../models/models";
import { CircularProgress } from "@mui/material";
import SupplyContractComponent from "../../components/Market/SupplyContractComponent/SupplyContractComponent";
import SuggestedPriceComponent from "../../components/Market/SuggestedPriceComponent/SuggestedPriceComponent";
import { verify } from "../../apis/groupSignature";
import EthereumContext from "../../contexts/ethereumContext";
import Button from "../../components/Shared/Button/Button";

type MarketplacePageBodyProps = {
    offers: OfferDTO[];
    currentAccount: string;
    pendingOffers: PendingSupplyContractDTO[];
    approvedContracts: ApprovedSupplyContractDTO[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleBuyOffer: () => (id: string, offer: OfferDTO) => Promise<void>;
    removeOffer: (id: string) => Promise<void>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    suggestedPrice: number;
    setOpenSupplyContractInfoModal: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    setCurrentItem: React.Dispatch<
        React.SetStateAction<PendingSupplyContractDTO | ApprovedSupplyContractDTO>
    >;
};

const MarketplacePageBody = ({
    offers,
    currentAccount,
    pendingOffers,
    setOpen,
    handleBuyOffer,
    removeOffer,
    loading,
    setLoading,
    suggestedPrice,
    setOpenSupplyContractInfoModal,
    setCurrentItem,
    approvedContracts,
}: MarketplacePageBodyProps) => {
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [setLoading]);

    const {
        approvePendingSupplyContracts,
        getApprovedSupplyContracts,
        getPendingOffers,
        getOffers,
    } = useContext(EthereumContext);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress size={"5em"} />
                <h3>Fetching data..</h3>
            </div>
        );
    }

    const refresh = () => {
        getApprovedSupplyContracts();
        getPendingOffers();
        getOffers();
    };

    const approvePendingOffers = async () => {
        const indicies = await Promise.all(
            pendingOffers.map(async (pendingOffer) => {
                const buyerMessage = JSON.stringify({
                    amount: pendingOffer.amount,
                    price: pendingOffer.price,
                    sellerSignature: pendingOffer.sellerSignature,
                    nonce: Number(pendingOffer.nonce),
                });
                const sellerMessage = JSON.stringify({
                    amount: pendingOffer.amount,
                    price: pendingOffer.price,
                    nonce: Number(pendingOffer.nonce),
                });
                const buyerSignatureVerified = await verify(
                    pendingOffer.buyerSignature,
                    buyerMessage
                );
                const sellerSignatureVerified = await verify(
                    pendingOffer.sellerSignature,
                    sellerMessage
                );
                console.log("buyerSignatureVerified", buyerSignatureVerified);
                console.log("sellerSignatureVerified", sellerSignatureVerified);

                return buyerSignatureVerified && sellerSignatureVerified;
            })
        );
        await approvePendingSupplyContracts(indicies);
        setTimeout(() => {
            refresh();
        }, 1000);
    };

   

    return (
        <>
            <div className={styles.pageTop}>
                <h1>Marketplace</h1>
                <div className={styles.topButtons}>
                    <AddButton onClick={() => setOpen(true)} />
                    <Button
                        onClick={() => approvePendingOffers()}
                        text="Approve offers"
                    />
                    <Button onClick={() => refresh()} text="Refresh" />
                </div>
            </div>

            <div className={styles.row}>
                <SuggestedPriceComponent suggestedPrice={suggestedPrice} />
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
            {pendingOffers && (
                <>
                    <h3>Pending supply contracts</h3>
                    <div className={styles.row}>
                        {pendingOffers.map((pendingOffer, index) => (
                            <SupplyContractComponent
                                key={index}
                                item={pendingOffer}
                                handleShowClick={() => {
                                    setCurrentItem(pendingOffer);
                                    setOpenSupplyContractInfoModal(true);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
            {approvedContracts && (
                <>
                    <h3>Confirmed contracts</h3>
                    <div className={styles.row}>
                        {approvedContracts.map((approvedContract, index) => (
                            <SupplyContractComponent
                                key={index}
                                item={approvedContract}
                                handleShowClick={() => {
                                    setCurrentItem(approvedContract);
                                    setOpenSupplyContractInfoModal(true);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default MarketplacePageBody;
