import Web3 from "web3";
import SuppleContract from "../contracts/SupplyContract.json"


export const getWeb3 = (): Web3 => {
    try {
        if (window.web3) {
            const web3 = new Web3(window.ethereum);
            console.log("Injected web3 detected.");
            return web3;
        } else {
            const provider = new Web3.providers.HttpProvider(
                process.env.REACT_APP_ETHEREUM_URL
            );
            const web3 = new Web3(provider);
            return web3;
        }
    } catch (error) {
        console.error("Error Getting Web3 Provider")
        console.error(error)
    }
};

export const getAccounts = async (web3: Web3): Promise<string[]> => {
    try {
        if (window.web3)
            return await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        else return await web3.eth.getAccounts();
    } catch (error) {
        console.error("Error Getting Web3 Accounts")
        console.error(error)        
    }
};


export const supplyContractInstance = (address, web3) => {
    if (!address || !web3) {
        return;
    }
    let contract = new web3.eth.Contract(SuppleContract.abi, address)

    return contract;
}