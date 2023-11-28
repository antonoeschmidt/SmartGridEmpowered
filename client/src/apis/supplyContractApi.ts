import { getWeb3 } from "./web3";
import SupplyContract from "../contracts/SupplyContract.json";
import { SupplyContractDTO } from "../models/models";
import { supplyContractParser } from "../utils/parsers";

export const getSupplyContractInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(SupplyContract.abi, address);
};

export const deploySupplyContract = async (
    sender: string,
    sc: SupplyContractDTO
) => {
    const web3 = getWeb3();
    const supplyContract = new web3.eth.Contract(SupplyContract.abi);
    const res = await supplyContract
        .deploy({
            data: SupplyContract.bytecode,
            // @ts-ignore
            arguments: [sc.buyer, sc.seller, sc.amount, sc.price],
        })
        .send({
            from: sender,
            gas: "1500000",
            gasPrice: "30000000000",
        });
    return res.options.address;
};

const getSupplyContracts = async (
    supplyContracts: string[],
    sender: string
) => {
    const supplyContractList: SupplyContractDTO[] = [];
    try {
        for (let i = 0; i < supplyContracts?.length; i++) {
            const supplyContract = await getSupplyContractInfo(
                supplyContracts[i],
                sender
            );

            supplyContractList.push(supplyContract);
        }
    } catch (error) {
        console.error(error);
    }

    return supplyContractList;
};

const getSupplyContractInfo = async (address: string, sender: string) => {
    const supplyContractInstance = getSupplyContractInstance(address);
    if (!supplyContractInstance) return;
    const res = await supplyContractInstance.methods
        .getInfo()
        .call({ from: sender });
    return supplyContractParser({ ...res, id: address });
};

export const supplyContractApi = {
    deploySupplyContract,
    getSupplyContracts,
    getSupplyContractInfo,
};
