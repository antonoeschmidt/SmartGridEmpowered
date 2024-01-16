import React, { useContext, useEffect, useState, FC } from "react";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import { ApprovedContractDTO, OfferDTO, PendingOfferDTO } from "../../models/models";
import { OfferModal } from "../../components/Market/OfferModal/OfferModal";
import MarketplacePageBody from "./MarketplacePage.body";
import SupplyContractInfoModal from "../../components/Market/SupplyContractInfoModal/SupplyContractInfoModal";
import { verify, openSignature } from "../../apis/groupSignature";

const MarketplacePage: FC = () => {
    const {
        offers,
        buyOffer,
        setOffers,
        getOffers,
        loading,
        setLoading,
        removeOffer,
        user,
        pendingOffers,
        approvedContracts
    } = useContext(EthereumContext);

    const roundToDecimalPlaces = (number, decimalPlaces) => {
        const factor = 10 ** decimalPlaces;
        return Math.round(number * factor) / factor;
    };

    const [suggestedPrice, setSuggestedPrice] = useState<number>(
        roundToDecimalPlaces(Math.random(), 3)
    );

    useEffect(() => {
        if (offers || !user.market) return;
        getOffers()
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    }, [user.market, getOffers, offers, setOffers]);

    useEffect(() => {
        const changeSuggestedPrice = () => {
            const change = (Math.random() - 0.5) * 0.05;
            setSuggestedPrice((prevPrice) =>
                roundToDecimalPlaces(prevPrice + change, 3)
            );
        };
        const intervalId = setInterval(changeSuggestedPrice, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleBuyOffer = () => async (id: string, offer: OfferDTO) => {
        await buyOffer(id, offer);

        getOffers()
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    };

    const handleRemoveOffer = async (id: string) => {
        await removeOffer(id);
        setOffers((prev) => [...prev.filter((offer) => offer.id !== id)]);
    };

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [openSupplyContractInfoModal, setOpenSupplyContractInfoModal] =
        useState(false);

    const handleCloseSupplyContractInfoModal = () => {
        setOpenSupplyContractInfoModal(false);
    };

    const [currentItem, setCurrentItem] =
        useState<PendingOfferDTO | ApprovedContractDTO>();

    if (!user.market) {
        return (
            <div className={styles.container}>
                Please choose a Market to view the Marketplace
            </div>
        );
    }

    const verifyPendingOffer = async (pendingOffer: PendingOfferDTO) => {
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
        let buyerSignatureVerified = await verify(
            pendingOffer.buyerSignature,
            buyerMessage
        );
        let sellerSignatureVerified = await verify(
            pendingOffer.sellerSignature,
            sellerMessage
        );
        console.log("Verify sellerMessage");
        console.log(
            JSON.stringify({
                message: sellerMessage,
                signature: pendingOffer.sellerSignature,
            })
        );
        console.log("Verify buyerMessage");
        console.log(
            JSON.stringify({
                message: buyerMessage,
                signature: pendingOffer.buyerSignature,
            })
        );
        console.log("buyerSignatureVerified", buyerSignatureVerified);
        console.log("sellerSignatureVerified", sellerSignatureVerified);

        if (buyerSignatureVerified && sellerSignatureVerified) {
            alert("Supply Contract is verified!");
        } else {
            alert("Supply Contract is not verified!");
        }
    };

    const revealIdentities = async (approvedContract: ApprovedContractDTO) => {
        const sellerIdentity = await openSignature(
            approvedContract.sellerSignature
        );
        const buyerIdentity = await openSignature(
            approvedContract.buyerSignature
        );

        console.log("sellerIdentity", sellerIdentity);
        console.log(
            JSON.stringify({ signature: approvedContract.sellerSignature })
        );
        console.log("buyerIdentity", buyerIdentity);
        console.log(
            JSON.stringify({ signature: approvedContract.buyerSignature })
        );

        alert(
            `Seller identity: ${sellerIdentity}\nBuyer identity: ${buyerIdentity}`
        );
    };

    

    return (
        <div className={styles.container}>
            <MarketplacePageBody
                offers={offers}
                currentAccount={user.accountAddress}
                pendingOffers={pendingOffers}
                approvedContracts={approvedContracts}
                setOpen={setOpen}
                handleBuyOffer={handleBuyOffer}
                removeOffer={handleRemoveOffer}
                loading={loading}
                setLoading={setLoading}
                suggestedPrice={suggestedPrice}
                setOpenSupplyContractInfoModal={setOpenSupplyContractInfoModal}
                setCurrentItem={setCurrentItem}
            />
            <OfferModal open={open} handleClose={handleClose} />
            <SupplyContractInfoModal
                open={openSupplyContractInfoModal}
                handleClose={handleCloseSupplyContractInfoModal}
                currentItem={currentItem}
                verifyPendingOffer={verifyPendingOffer}
                revealIdentities={revealIdentities}
            />
        </div>
    );
};

export default MarketplacePage;
