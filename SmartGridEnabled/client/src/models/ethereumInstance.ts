import Web3 from "web3";
import SupplyContract from "../contracts/SupplyContract.json";
import Market from "../contracts/Market.json";
import CableCompany from "../contracts/CableCompany.json";
import SmartMeter from "../contracts/SmartMeter.json";
import { OfferDTO, SupplyContractDTO } from "./models";
import { supplyContractParser, offerParser } from "../utils/parsers";

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
                console.log("MetaMask detected");
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

    cableCompanyInstance = (address: string) => {
        return new this.web3.eth.Contract(CableCompany.abi, address);
    };

    deploySupplyContract = async (sender: string, sc: SupplyContractDTO) => {
        let newContract = new this.web3.eth.Contract(SupplyContract.abi);
        let res = await newContract
            .deploy({
                data: SupplyContract.bytecode,
                // @ts-ignore
                arguments: [sc.buyer, sc.seller, sc.amount, sc.price],
            })
            .send({
                from: sender,
                gas: "1500000",
                gasPrice: "30000000000",
            });
        return res.options.address;
    };

    deployMarket = async (sender: string, cableCompanyAddress: string) => {
        let newContract = new this.web3.eth.Contract(Market.abi);
        let contract = newContract.deploy({
            data: Market.bytecode,
            // @ts-ignore
            arguments: [cableCompanyAddress],
        });
        let res = await contract.send({
            from: sender,
            gas: "3000000",
            gasPrice: "30000000000",
        });

        return res.options.address;
    };

    deployCableCompany = async (sender: string) => {
        let newContract = new this.web3.eth.Contract(CableCompany.abi);
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

    deploySmartMeter = async (sender: string) => {
        let newContract = new this.web3.eth.Contract(SmartMeter.abi);
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

    registerSmartMeter = async (
        sender: string,
        cableCompanyAddress: string,
        smartMeterPubKey: string,
        smartMeterAddress: string
    ) => {
        let cableCompanyInstance =
            this.cableCompanyInstance(cableCompanyAddress);
        try {
            let res = await cableCompanyInstance.methods
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

    scanBlocksForContractCreations = async () => {
        let marketAddresses: string[] = [];
        let supplyContractAddresses: string[] = [];
        let cableCompanyAddresses: string[] = [];
        const latestBlockNumber = await this.web3.eth.getBlockNumber();

        for (let i = 0; i <= latestBlockNumber; i++) {
            const block = await this.web3.eth.getBlock(i, true); // Get block details
            if (block && block.transactions) {
                for (let j = 0; j < block.transactions.length; j++) {
                    let tx = block.transactions[j] as any;
                    let receipt = await this.web3.eth.getTransactionReceipt(
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

                        let cableCompanyInstance = this.cableCompanyInstance(
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

                        try {
                            // Checks if this call fails. If it doesn't, its a CableCompany SC
                            await cableCompanyInstance.methods
                                .getOwner()
                                .call();
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

    addOffer = async (
        offer: OfferDTO,
        market: string,
        account: string,
        smartMeterAddress: string
    ) => {
        let marketInstance = this.marketInstance(market);
        try {
            await marketInstance.methods
                .addOffer(
                    // @ts-ignore
                    offer.id,
                    offer.amount,
                    offer.price,
                    offer.expiration,
                    smartMeterAddress
                )
                .send({
                    from: account,
                    gas: "3000000",
                    gasPrice: "30000000000",
                });

            return offer;
        } catch (error) {
            console.error(error);
        }
    };

    getOffers = async (market: string) => {
        let marketInstance = this.marketInstance(market);
        try {
            let res = (await marketInstance.methods
                .getOffers()
                .call()) as any[];

            return res.map((d) => offerParser(d));
        } catch (error) {
            console.error(error);
        }
    };

    getSupplyContracts = async (supplyContracts: string[], sender: string) => {
        let scList: SupplyContractDTO[] = [];
        try {
            for (let i = 0; i < supplyContracts?.length; i++) {
                let sc = await this.getSupplyContractInfo(
                    supplyContracts[i],
                    sender
                );

                scList.push(sc);
            }
        } catch (error) {
            console.error(error);
        }

        return scList;
    };
    buyOffer = async (market: string, id: string, account: string) => {
        const marketInstance = this.marketInstance(market);
        try {
            await marketInstance.methods
                // @ts-ignore
                .buyOffer(id)
                .send({
                    from: account,
                    gas: "1500000",
                    gasPrice: "30000000000",
                });

            let address = (await marketInstance.methods
                .getLatestSupplyContract()
                .call()) as unknown as string;

            let supplyContractInstance = this.supplyContractInstance(address);
            let supplyContractInfo = supplyContractParser(
                await supplyContractInstance.methods.getInfo().call()
            );

            return await this.deploySupplyContract(account, supplyContractInfo);
        } catch (error) {
            console.error(error);
        }
    };

    getSupplyContractInfo = async (address: string, sender: string) => {
        const supplyContractInstance = this.supplyContractInstance(address);
        let res = await supplyContractInstance.methods
            .getInfo()
            .call({ from: sender });
        return supplyContractParser({ ...res, id: address });
    };
}
