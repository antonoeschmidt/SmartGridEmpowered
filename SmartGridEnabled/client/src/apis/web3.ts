import Web3 from "web3";
import { marketInstance } from "./marketApi";
import { supplyContractInstance } from "./supplyContractApi";
import { cableCompanyInstance } from "./cableCompanyApi";

export const getWeb3 = (): Web3 => {
    try {
        if (window.web3) {
            // MetaMask
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
        console.error("Error Getting Web3 Provider");
        console.error(error);
    }
};

export const getAccounts = async (): Promise<string[]> => {
    const web3 = getWeb3();
    try {
        if (window.web3)
            // MetaMask
            return await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        else return await web3.eth.getAccounts();
    } catch (error) {
        console.error("Error Getting Web3 Accounts");
        console.error(error);
    }
};

export const scanBlocksForContractCreations = async () => {
    const web3 = getWeb3();
    let marketAddresses: string[] = [];
    let supplyContractAddresses: string[] = [];
    let cableCompanyAddresses: string[] = [];
    const latestBlockNumber = await web3.eth.getBlockNumber();

    for (let i = 0; i <= latestBlockNumber; i++) {
        const block = await web3.eth.getBlock(i, true); // Get block details
        if (block && block.transactions) {
            for (let j = 0; j < block.transactions.length; j++) {
                let tx = block.transactions[j] as any;
                let receipt = await web3.eth.getTransactionReceipt(tx.hash);

                if (receipt.contractAddress) {
                    let mInstance = marketInstance(receipt.contractAddress);
                    let scInstance = supplyContractInstance(
                        receipt.contractAddress
                    );

                    let ccInstance = cableCompanyInstance(
                        receipt.contractAddress
                    );

                    try {
                        // Checks if this call fails. If it doesn't, its a Market SC
                        await mInstance.methods.getOfferIDs().call();
                        marketAddresses.push(receipt.contractAddress);
                        continue;
                    } catch {}

                    try {
                        // Checks if this call fails. If it doesn't, its a SupplyContract SC
                        await scInstance.methods.getBuyer().call();
                        supplyContractAddresses.push(receipt.contractAddress);
                        continue;
                    } catch {}

                    try {
                        // Checks if this call fails. If it doesn't, its a CableCompany SC
                        await ccInstance.methods.getOwner().call();
                        cableCompanyAddresses.push(receipt.contractAddress);
                        continue;
                    } catch {}
                }
            }
        }
    }
    return {
        marketAddresses,
        supplyContractAddresses,
        cableCompanyAddresses,
    };
};
