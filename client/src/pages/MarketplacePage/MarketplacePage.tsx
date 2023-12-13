import React, { useContext, useEffect, useState, FC } from "react";
import styles from "./MarketplacePage.module.css";
import EthereumContext from "../../contexts/ethereumContext";
import { SupplyContractDTO } from "../../models/models";
import { OfferModal } from "../../components/Market/OfferModal/OfferModal";
import MarketplacePageBody from "./MarketplacePage.body";

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

    const handleBuyOffer = () => async (id: string) => {
        const supplyContractAddress = await buyOffer(id);
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

    if (!currentMarket) {
        return (
            <div className={styles.container}>
                Please choose a Market to view the Marketplace
            </div>
        );
    }

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
            />
            <OfferModal open={open} handleClose={handleClose} />
        </div>
    );
};

export default MarketplacePage;
