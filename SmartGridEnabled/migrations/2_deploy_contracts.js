const Market = artifacts.require("./Market.sol");
const SmartMeter = artifacts.require("./SmartMeter.sol");
const SupplyContract = artifacts.require("./SupplyContract.sol");

module.exports = function (deployer, network, accounts) {
    // Deploy Market
    deployer.deploy(Market);

    // Deploy SmartMeter
    deployer.deploy(SmartMeter);

    /** Deploy SupplyContract
     * @param buyer: address
     * @param seller: address
     * @param amount: uint (Wh)
     * @param price: uint (Euro Cents)
     *
     **/
    deployer.deploy(SupplyContract, accounts[0], accounts[1], 1, 1);
};
