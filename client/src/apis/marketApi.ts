import { getWeb3 } from "./web3";
import Market from "../contracts/Market.json";
import { OfferDTO, PendingOfferDTO } from "../models/models";
import { offerParser, pendingOfferParser, supplyContractParser } from "../utils/parsers";
import {
    getSupplyContractInstance,
    deploySupplyContract,
} from "./supplyContractApi";

export const marketInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(Market.abi, address);
};

const deployMarket = async (sender: string, cableCompanyAddress: string, smartMeterContractAddress) => {
    const web3 = getWeb3();
    const newMarketContract = new web3.eth.Contract(Market.abi);
    const contract = newMarketContract.deploy({
        data: Market.bytecode,
        // @ts-ignore
        arguments: [cableCompanyAddress, smartMeterContractAddress],
    });
    const res = await contract.send({
        from: sender,
        gas: "4712388",
        gasPrice: "100000000000",
    });

    return res.options.address;
};

const addOffer = async (
    offer: OfferDTO,
    market: string,
    account: string,
    smartMeterAddress: string,
    currentSecret: string,
    nextSecretHash: string
) => {
    const marketContract = marketInstance(market);
    try {
        // generate next secret
        const array = new Uint32Array(16);
        crypto.getRandomValues(array);

        await marketContract.methods
            .addOffer(
                // @ts-ignore
                offer.id,
                offer.amount,
                offer.price,
                offer.expiration,
                smartMeterAddress,
                offer.sellerSignature,
                offer.nonce,
                account,
                currentSecret,
                nextSecretHash
            )
            .send({
                from: account,
                gas: "3000000",
                gasPrice: "30000000000",
            });

        return offer;
    } catch (error) {
        console.error("add offer error", error);
    }
};

const getOffers = async (market: string) => {
    const marketContract = marketInstance(market);
    try {
        const response = (await marketContract.methods
            .getOffers()
            .call()) as any[];

        console.log("getOffers", response);
        return response.map((d) => offerParser(d));
    } catch (error) {
        console.error(error);
    }
};

const buyOffer = async (
    market: string,
    id: string,
    account: string,
    buyerSignature: string
) => {
    const marketContract = marketInstance(market);
    try {
        await marketContract.methods
            // @ts-ignore
            .buyOffer(id, buyerSignature)
            .send({
                from: account,
                gas: "1500000",
                gasPrice: "30000000000",
            });
    } catch (error) {
        console.error("try catch err", error);
    }
};

const removeOffer = async (
    marketAddress: string,
    offerId: string,
    smartMeterAddress: string,
    currentAccount: string
) => {
    const marketContract = marketInstance(marketAddress);
    try {
        return await marketContract.methods
            // @ts-ignore
            .removeOffer(offerId, smartMeterAddress)
            .send({
                from: currentAccount,
                gas: "1500000",
                gasPrice: "30000000000",
            });
    } catch (err) {
        console.log("Remove offer err", err);
    }
};

const getPendingOffers = async (
    marketAddress: string,
    sender: string
): Promise<PendingOfferDTO[]> => {
    const marketContract = marketInstance(marketAddress);
    try {
        const response = await marketContract.methods
            // @ts-ignore
            .getPendingOffers()
            .call({
                from: sender
            }) as any[];
            return response.map((d) => pendingOfferParser(d));
    } catch (err) {
        console.log("Remove offer err", err);
    }
}

const approvePendingOffers = async(sender: string,  indicies: boolean[], marketAddress: string) => {
    const marketContract = marketInstance(marketAddress);
    try {
        return await marketContract.methods
        // @ts-ignore
        .validatePendingOffers(indicies)
        .send({
            from: sender,
            gas: "1500000",
            gasPrice: "30000000000",
        })
    } catch (err) {
        console.log("Approve pending offers error", err)
    }
}

export const marketApi = {
    deployMarket,
    addOffer,
    getOffers,
    buyOffer,
    removeOffer,
    getPendingOffers,
    approvePendingOffers
};
