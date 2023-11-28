import SmartMeter from "../contracts/SmartMeter.json";
import { getWeb3 } from "./web3";
import { cableCompanyInstance } from "./cableCompanyApi";

export const smartMeterInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(SmartMeter.abi, address);
};

const deploySmartMeter = async (sender: string) => {
    const web3 = getWeb3();
    const newSmartMeterContract = new web3.eth.Contract(SmartMeter.abi);
    const deployedSmartMeterContract = newSmartMeterContract.deploy({
        data: SmartMeter.bytecode,
    });
    const res = await deployedSmartMeterContract.send({
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
    adminAccount: string,
    smartMeterAddress: string,
    marketAddress: string
) => {
    const smartMeterContract = smartMeterInstance(smartMeterAddress);
    try {
        const res = await smartMeterContract.methods
            .setCurrentMarketAddress(
                // @ts-ignore
                marketAddress
            )
            .send({
                from: adminAccount,
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
    const smartMeterContract = smartMeterInstance(smartMeterAddress);
    try {
        let res = await smartMeterContract.methods
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
    adminAccount: string,
    cableCompanyAddress: string,
    smartMeterPubKey: string,
    smartMeterAddress: string
) => {
    if (
        !adminAccount ||
        !cableCompanyAddress ||
        !smartMeterPubKey ||
        !smartMeterAddress
    ) {
        return;
    }
    
    let cableCompanyContract = cableCompanyInstance(cableCompanyAddress);
    try {
        const res = await cableCompanyContract.methods
            .registerKey(
                // @ts-ignore
                smartMeterPubKey,
                smartMeterAddress
            )
            .send({
                from: adminAccount,
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
