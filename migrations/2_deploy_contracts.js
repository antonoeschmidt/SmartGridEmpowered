// Use for automation scripts

const CableCompany = artifacts.require("./CableCompany.sol");
const Market = artifacts.require("./Market.sol");
const SupplyContract = artifacts.require("./SupplyContract.sol");
const SmartMeter = artifacts.require("./SmartMeter.sol");

module.exports = async function (deployer, network, accounts) {
    const adminAccount = accounts[0];
    const userAccount = accounts[1];

    // Deploy CableCompany
    await deployer.deploy(CableCompany, { from: adminAccount });

    /**  Deploy Market
     * @param cableCompanyAddress: address
     **/
    await deployer.deploy(Market, CableCompany.address, { from: adminAccount });

    /** Deploy SmartMeter
     * @param otsHash: bytes32
     * */
    const encodedSecretString = web3.eth.abi.encodeParameters(
        ["string"],
        ["test1"]
    );
    const hash = web3.utils.soliditySha3(encodedSecretString);
    await deployer.deploy(SmartMeter, hash, { from: userAccount });

    /** Deploy SupplyContract
     * @param sellerSignature: string
     * @param buyerSignature: string
     * @param amount: uint (Wh)
     * @param price: uint (Euro Cents)
     * @param nonce: uint
     **/

    const sellerSignature = "signature1";
    const buyerSignature = "signature2";
    const nonce = 1;
    const amount = 1;
    const price = 1;
    await deployer.deploy(
        SupplyContract,
        sellerSignature,
        buyerSignature,
        amount,
        price,
        nonce
    );
};
