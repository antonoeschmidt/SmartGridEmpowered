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
    } = useContext(EthereumContext);

    const [supplyContractsDTO, setSupplyContractsDTO] =
        useState<SupplyContractDTO[]>();

    useEffect(() => {
        if (offers || !currentMarket) return;
        console.log("true here");

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

    const handleBuyOffer = () => async (id: string) => {
        const address = await buyOffer(id);
        if (!address) {
            alert("Buy offer didn't return an address");
            return;
        }
        const newSC = await getSupplyContractInfo(address);
        console.log("newSC", newSC);
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
                removeOffer={removeOffer}
            />
            <OfferModal open={open} handleClose={handleClose} />
        </div>
    );
};

export default MarketplacePage;
