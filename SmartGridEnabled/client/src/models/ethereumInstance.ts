import Web3 from "web3";
import SupplyContract from "../contracts/SupplyContract.json";
import Market from "../contracts/Market.json";
import { Offer } from "./models";
import { offerParser } from "../utils/parsers";

export class EthereumInstance {
    web3: Web3;

    constructor() {
        this.web3 = this.initWeb3();
    }

    initWeb3 = (): Web3 => {
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

    getAccounts = async (): Promise<string[]> => {
        try {
            if (window.web3) {
                // MetaMask
                return await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
            } else {
                return await this.web3.eth.getAccounts();
            }
        } catch (error) {
            console.error("Error Getting Web3 Accounts");
            console.error(error);
        }
    };

    supplyContractInstance = (address: string) => {
        return new this.web3.eth.Contract(SupplyContract.abi, address);
    };

    marketInstance = (address: string) => {
        return new this.web3.eth.Contract(Market.abi, address);
    };

    deploySupplyContract = async (sender: string) => {
        let newContract = new this.web3.eth.Contract(SupplyContract.abi);
        let res = await newContract
            .deploy({
                data: SupplyContract.bytecode,
                // @ts-ignore
                arguments: [
                    "0x9E0F9eFA6Be40005e33dce6e1440DDBD125CfAB1",
                    "0x9E0F9eFA6Be40005e33dce6e1440DDBD125CfAB1",
                    1,
                    1,
                ],
            })
            .send({
                from: sender,
                gas: "1500000",
                gasPrice: "30000000000",
            });
        return res.options.address;
    };

    deployMarket = async (sender: string) => {
        let newContract = new this.web3.eth.Contract(Market.abi);
        let contract = newContract.deploy({
            data: Market.bytecode,
        });
        let res = await contract.send({
            from: sender,
            gas: "2500000",
            gasPrice: "30000000000",
        });

        return res.options.address;
    };

    scanBlocksForContractCreations = async () => {
        let marketAddresses: string[] = [];
        let supplyContractAddresses: string[] = [];
        const latestBlockNumber = await this.web3.eth.getBlockNumber();

        for (let i = 0; i <= latestBlockNumber; i++) {
            const block = await this.web3.eth.getBlock(i, true); // Get block details
            if (block && block.transactions) {
                for (let j = 0; j < block.transactions.length; j++) {
                    let tx = block.transactions[j];
                    let receipt = await this.web3.eth.getTransactionReceipt(
                        // @ts-ignore
                        tx.hash
                    );

                    if (receipt.contractAddress) {
                        let marketInstance = this.marketInstance(
                            receipt.contractAddress
                        );
                        let supplyContractInstance =
                            this.supplyContractInstance(
                                receipt.contractAddress
                            );
                        try {
                            // Checks if this call fails. If it doesn't, its a Market SC
                            await marketInstance.methods.getOfferIDs().call();
                            marketAddresses.push(receipt.contractAddress);
                            continue;
                        } catch {}

                        try {
                            // Checks if this call fails. If it doesn't, its a SupplyContract SC
                            await supplyContractInstance.methods
                                .getBuyer()
                                .call();
                            supplyContractAddresses.push(
                                receipt.contractAddress
                            );
                            continue;
                        } catch {}
                    }
                }
            }
        }
        return { marketAddresses, supplyContractAddresses };
    };

    addOffer = async (offer: Offer, market: string, account: string) => {
        let marketInstance = this.marketInstance(market);
        try {
            let res = await marketInstance.methods
            .addOffer(
                    // @ts-ignore
                    offer.id,
                    offer.price,
                    offer.expriration,
                    offer.amount
                )
                .send({ from: account,
                    gas: "1500000",
                    gasPrice: "30000000000" });
            
            console.log(res)
        } catch (error) {
            console.error(error);
        }
    };

    getOffers = async (market: string) => {
        let marketInstance = this.marketInstance(market);
        try {
            let res = await marketInstance.methods.getOffers().call() as any[]
            return res.map((d) => offerParser(d))
        } catch (error) {
            console.error(error);
        }
    };
}
