import Web3 from "web3";
import SupplyContract from "../contracts/SupplyContract.json";
// import Market from "../contracts/Market.json";
import CableCompany from "../contracts/CableCompany.json";
import SmartMeter from "../contracts/SmartMeter.json";
import { OfferDTO, SupplyContractDTO } from "./models";
import { supplyContractParser, offerParser } from "../utils/parsers";

export class EthereumInstance {
    web3: Web3;

    // constructor() {
    //     this.web3 = this.initWeb3();
    // }

    // initWeb3 = (): Web3 => {
    //     try {
    //         if (window.web3) {
    //             // MetaMask
    //             const web3 = new Web3(window.ethereum);
    //             console.log("Injected web3 detected.");
    //             return web3;
    //         } else {
    //             const provider = new Web3.providers.HttpProvider(
    //                 process.env.REACT_APP_ETHEREUM_URL
    //             );
    //             const web3 = new Web3(provider);
    //             return web3;
    //         }
    //     } catch (error) {
    //         console.error("Error Getting Web3 Provider");
    //         console.error(error);
    //     }
    // };

    // getAccounts = async (): Promise<string[]> => {
    //     try {
    //         if (window.web3) {
    //             // MetaMask
    //             console.log("MetaMask detected");
    //             return await window.ethereum.request({
    //                 method: "eth_requestAccounts",
    //             });
    //         } else {
    //             return await this.web3.eth.getAccounts();
    //         }
    //     } catch (error) {
    //         console.error("Error Getting Web3 Accounts");
    //         console.error(error);
    //     }
    // };
}
