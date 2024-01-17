import SmartMeter from "../contracts/SmartMeter.json";
import { getWeb3 } from "./web3";
import { cableCompanyInstance } from "./DSOApi";

export const smartMeterInstance = (address: string) => {
    const web3 = getWeb3();
    return new web3.eth.Contract(SmartMeter.abi, address);
};

const createSmartMeter = async (marketAddress: string, smartMeterAddress: string, currentAccount: string, smartMeterContractAddress: string, nextSecretHash: string) => {
    console.log('{marketAddress, smartMeterAddress, currentAccount, SmartmeterContractAddress, nextSecretHash}', {marketAddress, smartMeterAddress, currentAccount, smartMeterContractAddress, nextSecretHash})
    return await smartMeterInstance(smartMeterContractAddress).methods.createSmartMeter(
        // @ts-ignore
        marketAddress,
        nextSecretHash
    )
    .send({
        from: smartMeterAddress,
        gas: "2500000",
        gasPrice: "30000000000",
    });
};

const deploySmartMeter = async (sender: string) => {
    const web3 = getWeb3();
    const newSmartMeterContract = new web3.eth.Contract(SmartMeter.abi);

    const deployedSmartMeterContract = newSmartMeterContract.deploy({
        data: SmartMeter.bytecode
    });
    const res = await deployedSmartMeterContract.send({
        from: sender,
        gas: "2500000",
        gasPrice: "30000000000",
    });

    return res.options.address;
};

const getBatteryCharge = async (smartMeterContractAddress, address: string) => {
    return await smartMeterInstance(smartMeterContractAddress).methods.getBatteryCharge(
        // @ts-ignore
        address
        ).call({from: address});
};

const setMarketAddress = async (
    smartMeterAddress: string,
    smartMeterContractAddress: string,
    newMarketAddress: string
) => {
    const smartMeterContract = smartMeterInstance(smartMeterContractAddress);
    try {
        const res = await smartMeterContract.methods
            .setMarketAddress(
                // @ts-ignore
                newMarketAddress
            )
            .send({
                from: smartMeterAddress,
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
    smartMeterContractAddress: string,
    intervalConsumption: number,
    intervalProduction: number
) => {
    const smartMeterContract = smartMeterInstance(smartMeterContractAddress);
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
    createSmartMeter,
    getBatteryCharge,
    setMarketAddress,
    createLog,
    registerSmartMeter,
    deploySmartMeter
};
