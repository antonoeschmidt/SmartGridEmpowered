import React, { useContext, useEffect, useState, FC } from "react";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import { OfferDTO, SupplyContractDTO } from "../../models/models";
import { OfferModal } from "../../components/Market/OfferModal/OfferModal";
import MarketplacePageBody from "./MarketplacePage.body";
import SupplyContractInfoModal from "../../components/Market/SupplyContractInfoModal/SupplyContractInfoModal";
import { verify, openSignature } from "../../apis/groupSignature";

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
        loading,
        setLoading,
        removeOffer,
        getUserLogs
    } = useContext(EthereumContext);

    const roundToDecimalPlaces = (number, decimalPlaces) => {
        const factor = 10 ** decimalPlaces;
        return Math.round(number * factor) / factor;
    };

    const [supplyContractsDTO, setSupplyContractsDTO] =
        useState<SupplyContractDTO[]>();

    const [suggestedPrice, setSuggestedPrice] = useState<number>(
        roundToDecimalPlaces(Math.random(), 3)
    );

    useEffect(() => {
        if (offers || !currentMarket) return;
        getOffers()
            .then((data) => {
                setOffers(data);
            })
            .catch((err) => console.log(err));
    }, [currentMarket, getOffers, offers, setOffers]);

    useEffect(() => {
        if (!currentAccount) return;
        getSupplyContracts()
            .then((data) => {
                setSupplyContractsDTO(data);
            })
            .catch((err) => console.error(err));
    }, [currentAccount, getSupplyContracts]);

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
        const supplyContractAddress = await buyOffer(id, offer);
        if (!supplyContractAddress) {
            alert("Buy offer didn't return an address");
            return;
        }
        const newSupplyContract = await getSupplyContractInfo(
            supplyContractAddress
        );
        setSupplyContractAddresses((prevState) => [
            ...prevState,
            supplyContractAddress,
        ]);
        setSupplyContractsDTO((prevState) => [...prevState, newSupplyContract]);

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

    const [currentSupplyContract, setCurrentSupplyContract] =
        useState<SupplyContractDTO>();

    if (!currentMarket) {
        return (
            <div className={styles.container}>
                Please choose a Market to view the Marketplace
            </div>
        );
    }

    const verifySupplyContract = async (supplyContract: SupplyContractDTO) => {
        const buyerMessage = JSON.stringify({
            amount: supplyContract.amount,
            price: supplyContract.price,
            sellerSignature: supplyContract.sellerSignature,
            nonce: Number(supplyContract.nonce),
        });
        const sellerMessage = JSON.stringify({
            amount: supplyContract.amount,
            price: supplyContract.price,
            nonce: Number(supplyContract.nonce),
        });
        let buyerSignatureVerified = await verify(
            supplyContract.buyerSignature,
            buyerMessage
        );
        let sellerSignatureVerified = await verify(
            supplyContract.sellerSignature,
            sellerMessage
        );
        console.log("Verify sellerMessage");
        console.log(
            JSON.stringify({
                message: sellerMessage,
                signature: supplyContract.sellerSignature,
            })
        );
        console.log("Verify buyerMessage");
        console.log(
            JSON.stringify({
                message: buyerMessage,
                signature: supplyContract.buyerSignature,
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

    const revealIdentities = async (supplyContract: SupplyContractDTO) => {
        const sellerIdentity = await openSignature(
            supplyContract.sellerSignature
        );
        const buyerIdentity = await openSignature(
            supplyContract.buyerSignature
        );

        console.log("sellerIdentity", sellerIdentity);
        console.log(
            JSON.stringify({ signature: supplyContract.sellerSignature })
        );
        console.log("buyerIdentity", buyerIdentity);
        console.log(
            JSON.stringify({ signature: supplyContract.buyerSignature })
        );

        alert(
            `Seller identity: ${sellerIdentity}\nBuyer identity: ${buyerIdentity}`
        );
    };

    

    return (
        <div className={styles.container}>
            <MarketplacePageBody
                offers={offers}
                currentAccount={currentAccount}
                supplyContractsDTO={supplyContractsDTO}
                setOpen={setOpen}
                handleBuyOffer={handleBuyOffer}
                removeOffer={handleRemoveOffer}
                loading={loading}
                setLoading={setLoading}
                suggestedPrice={suggestedPrice}
                setOpenSupplyContractInfoModal={setOpenSupplyContractInfoModal}
                setCurrentSupplyContract={setCurrentSupplyContract}
                logsTable={}
            />
            <OfferModal open={open} handleClose={handleClose} />
            <SupplyContractInfoModal
                open={openSupplyContractInfoModal}
                handleClose={handleCloseSupplyContractInfoModal}
                supplyContract={currentSupplyContract}
                verifySupplyContract={verifySupplyContract}
                revealIdentities={revealIdentities}
            />
        </div>
    );
};

export default MarketplacePage;
