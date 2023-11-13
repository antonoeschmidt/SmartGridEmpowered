import { getWeb3 } from "./web3";
import SupplyContract from "../contracts/SupplyContract.json";
import { SupplyContractDTO } from "../models/models";
import { supplyContractParser } from "../utils/parsers";

export const supplyContractInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(SupplyContract.abi, address);
};

export const deploySupplyContract = async (
    sender: string,
    sc: SupplyContractDTO
) => {
    const web3 = getWeb3();
    let newContract = new web3.eth.Contract(SupplyContract.abi);
    let res = await newContract
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
    let scList: SupplyContractDTO[] = [];
    try {
        for (let i = 0; i < supplyContracts?.length; i++) {
            let sc = await getSupplyContractInfo(supplyContracts[i], sender);

            scList.push(sc);
        }
    } catch (error) {
        console.error(error);
    }

    return scList;
};

const getSupplyContractInfo = async (address: string, sender: string) => {
    const instance = supplyContractInstance(address);
    let res = await instance.methods.getInfo().call({ from: sender });
    return supplyContractParser({ ...res, id: address });
};

export const supplyContractApi = {
    deploySupplyContract,
    getSupplyContracts,
    getSupplyContractInfo,
};
