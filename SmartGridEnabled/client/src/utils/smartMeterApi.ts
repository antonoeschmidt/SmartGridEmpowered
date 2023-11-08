import SmartMeter from "../contracts/SmartMeter.json";
import { getWeb3 } from "./web3";

export const smartMeterInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(SmartMeter.abi, address);
};

export const getBatteryCharge = async (address: string) => {
    return await smartMeterInstance(address).methods.getBatteryCharge().call();
};

export const createLog = async (
    sender: string,
    smartMeterAddress: string,
    intervalConsumption: number,
    intervalProduction: number
) => {
    const contract = smartMeterInstance(smartMeterAddress);
    try {
        let res = await contract.methods
            .createLog(
                // @ts-ignore
                intervalConsumption,
                intervalProduction
            )
            .send({
                from: sender,
                gas: "1500000",
                gasPrice: "30000000000",
            });

        return res;
    } catch (error) {
        console.error(error);
    }
};
