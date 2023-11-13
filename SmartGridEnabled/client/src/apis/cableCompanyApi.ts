import { getWeb3 } from "./web3";
import CableCompany from "../contracts/CableCompany.json";

export const cableCompanyInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(CableCompany.abi, address);
};

const deployCableCompany = async (sender: string) => {
    const web3 = getWeb3();
    let newContract = new web3.eth.Contract(CableCompany.abi);
    let contract = newContract.deploy({
        data: CableCompany.bytecode,
    });
    let res = await contract.send({
        from: sender,
        gas: "2500000",
        gasPrice: "30000000000",
    });

    return res.options.address;
};

const isRegisteredKey = async (
    cableCompanyAddress: string,
    smartMeterPubKey: string,
    smartMeterAddress: string
) => {
    try {
        const contract = cableCompanyInstance(cableCompanyAddress);
        let res = await contract.methods
            // @ts-ignore
            .isRegisteredKey(smartMeterPubKey, smartMeterAddress)
            .call();
        return res;
    } catch (error) {
        console.error(error);
    }
};

export const cableCompanyApi = {
    deployCableCompany,
    isRegisteredKey,
};
