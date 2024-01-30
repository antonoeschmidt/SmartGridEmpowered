import { getWeb3 } from "./web3";
import DSO from "../contracts/DSO.json";

export const DSOInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(DSO.abi, address);
};

const deployDSO = async (sender: string) => {
    const web3 = getWeb3();
    const newContract = new web3.eth.Contract(DSO.abi);
    const contract = newContract.deploy({
        data: DSO.bytecode,
    }); 
    const res = await contract.send({
        from: sender,
        gas: "2500000",
        gasPrice: "30000000000",
    });

    return res.options.address;
};

const isRegisteredKey = async (
    DSOAddress: string,
    smartMeterPubKey: string,
    smartMeterAddress: string
) => {
    try {
        const contract = DSOInstance(DSOAddress);
        let res = await contract.methods
            // @ts-ignore
            .isRegisteredKey(smartMeterPubKey, smartMeterAddress)
            .call();
        return res;
    } catch (error) {
        console.error(error);
    }
};

export const DSOApi = {
    deployDSO,
    isRegisteredKey,
};
