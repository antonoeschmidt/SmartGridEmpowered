import { getWeb3 } from "./web3";
import Market from "../contracts/Market.json";
import { OfferDTO } from "../models/models";
import { offerParser, supplyContractParser } from "../utils/parsers";
import {
    supplyContractInstance,
    deploySupplyContract,
} from "./supplyContractApi";

export const marketInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(Market.abi, address);
};

const deployMarket = async (sender: string, cableCompanyAddress: string) => {
    const web3 = getWeb3();
    let newContract = new web3.eth.Contract(Market.abi);
    let contract = newContract.deploy({
        data: Market.bytecode,
        // @ts-ignore
        arguments: [cableCompanyAddress],
    });
    let res = await contract.send({
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
    const contract = marketInstance(market);
    try {
        await contract.methods
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
    const contract = marketInstance(market);
    try {
        let res = (await contract.methods.getOffers().call()) as any[];

        return res.map((d) => offerParser(d));
    } catch (error) {
        console.error(error);
    }
};

const buyOffer = async (market: string, id: string, account: string) => {
    const contract = marketInstance(market);
    try {
        await contract.methods
            // @ts-ignore
            .buyOffer(id)
            .send({
                from: account,
                gas: "1500000",
                gasPrice: "30000000000",
            });

        let address = (await contract.methods
            .getLatestSupplyContract()
            .call()) as unknown as string;

        let scInstance = supplyContractInstance(address);
        let supplyContractInfo = supplyContractParser(
            await scInstance.methods.getInfo().call()
        );

        return await deploySupplyContract(account, supplyContractInfo);
    } catch (error) {
        console.error(error);
    }
};

export const marketApi = {
    deployMarket,
    addOffer,
    getOffers,
    buyOffer,
};
