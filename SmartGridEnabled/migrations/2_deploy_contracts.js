const CableCompany = artifacts.require("./CableCompany.sol");
const Market = artifacts.require("./Market.sol");
const SupplyContract = artifacts.require("./SupplyContract.sol");
const SmartMeter = artifacts.require("./SmartMeter.sol");

module.exports = function (deployer, network, accounts) {
    
    // Deploy Market
    deployer.deploy(Market, accounts[0])
    
    // Deploy CableCompany
    deployer.deploy(CableCompany);

    // // Deploy SmartMeter
    deployer.deploy(SmartMeter);

    // /** Deploy SupplyContract
    //  * @param buyer: address
    //  * @param seller: address
    //  * @param amount: uint (Wh)
    //  * @param price: uint (Euro Cents)
    //  *
    //  **/
    deployer.deploy(SupplyContract, accounts[0], accounts[1], 1, 1);
};
