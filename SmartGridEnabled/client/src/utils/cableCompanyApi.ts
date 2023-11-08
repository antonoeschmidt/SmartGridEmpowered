import { getWeb3 } from "./web3";
import CableCompany from "../contracts/CableCompany.json";

const cableCompanyInstance = (address: string) => {
    let web3 = getWeb3();
    return new web3.eth.Contract(CableCompany.abi, address);
};

export const isRegisteredKey = async (
    cableCompanyAddress: string,
    smartMeterPubKey: string,
    smartMeterAddress: string
) => {
    try {
        // debugger
        const contract = cableCompanyInstance(cableCompanyAddress);
        let res = await contract.methods
        // @ts-ignore
        .isRegisteredKey(smartMeterPubKey, smartMeterAddress)
        .call()
        return res;
            
    } catch (error) {
        console.error(error);
    }
};
