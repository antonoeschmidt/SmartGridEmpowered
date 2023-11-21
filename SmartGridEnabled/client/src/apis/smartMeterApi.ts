import SmartMeter from "../contracts/SmartMeter.json";
import { getWeb3 } from "./web3";
import { cableCompanyInstance } from "./cableCompanyApi";

export const smartMeterInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(SmartMeter.abi, address);
};

const deploySmartMeter = async (sender: string) => {
    const web3 = getWeb3();
    let newContract = new web3.eth.Contract(SmartMeter.abi);
    let contract = newContract.deploy({
        data: SmartMeter.bytecode,
    });
    let res = await contract.send({
        from: sender,
        gas: "2500000",
        gasPrice: "30000000000",
    });

    return res.options.address;
};

const getBatteryCharge = async (address: string) => {
    return await smartMeterInstance(address).methods.getBatteryCharge().call();
};

const setCurrentMarketAddress = async (
    sender: string,
    smartMeterAddress: string,
    marketAddress: string
) => {
    const contract = smartMeterInstance(smartMeterAddress);
    try {
        let res = await contract.methods
            .setCurrentMarketAddress(
                // @ts-ignore
                marketAddress
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

const createLog = async (
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

const registerSmartMeter = async (
    sender: string,
    cableCompanyAddress: string,
    smartMeterPubKey: string,
    smartMeterAddress: string
) => {
    if (
        !sender ||
        !cableCompanyAddress ||
        !smartMeterPubKey ||
        !smartMeterAddress
    ) {
        alert("Register Smart Meter is missing arguments");
        return;
    }
    let contract = cableCompanyInstance(cableCompanyAddress);
    try {
        let res = await contract.methods
            .registerKey(
                // @ts-ignore
                smartMeterPubKey,
                smartMeterAddress
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

export const smartMeterApi = {
    deploySmartMeter,
    getBatteryCharge,
    setCurrentMarketAddress,
    createLog,
    registerSmartMeter,
};
