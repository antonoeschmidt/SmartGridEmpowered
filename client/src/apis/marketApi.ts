import { getWeb3 } from "./web3";
import Market from "../contracts/Market.json";
import { OfferDTO } from "../models/models";
import { offerParser, supplyContractParser } from "../utils/parsers";
import {
    getSupplyContractInstance,
    deploySupplyContract,
} from "./supplyContractApi";

export const marketInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(Market.abi, address);
};

const deployMarket = async (sender: string, cableCompanyAddress: string) => {
    const web3 = getWeb3();
    const newMarketContract = new web3.eth.Contract(Market.abi);
    const contract = newMarketContract.deploy({
        data: Market.bytecode,
        // @ts-ignore
        arguments: [cableCompanyAddress],
    });
    const res = await contract.send({
        from: sender,
        gas: "3000000",
        gasPrice: "30000000000",
    });

    return res.options.address;
};

const addOffer = async (
    offer: OfferDTO,
    market: string,
    account: string,
    smartMeterAddress: string
) => {
    const marketContract = marketInstance(market);
    try {
        await marketContract.methods
            .addOffer(
                // @ts-ignore
                offer.id,
                offer.amount,
                offer.price,
                offer.expiration,
                smartMeterAddress
            )
            .send({
                from: account,
                gas: "3000000",
                gasPrice: "30000000000",
            });

        return offer;
    } catch (error) {
        console.error(error);
    }
};

const getOffers = async (market: string) => {
    const marketContract = marketInstance(market);
    try {
        const response = (await marketContract.methods.getOffers().call()) as any[];

        return response.map((d) => offerParser(d));
    } catch (error) {
        console.error(error);
    }
};

const buyOffer = async (market: string, id: string, account: string) => {
    const marketContract = marketInstance(market);
    try {
        await marketContract.methods
            // @ts-ignore
            .buyOffer(id)
            .send({
                from: account,
                gas: "1500000",
                gasPrice: "30000000000",
            });
        const supplyContractAddress = (await marketContract.methods
            .getLatestSupplyContract()
            .call()) as unknown as string;
        const supplyContractInstance = getSupplyContractInstance(supplyContractAddress);
        const supplyContractInfo = supplyContractParser(
            await supplyContractInstance.methods.getInfo().call({from: account})
        );


        return await deploySupplyContract(account, supplyContractInfo);
    } catch (error) {
        console.error("try catch err", error);
    }
};

export const marketApi = {
    deployMarket,
    addOffer,
    getOffers,
    buyOffer,
};
