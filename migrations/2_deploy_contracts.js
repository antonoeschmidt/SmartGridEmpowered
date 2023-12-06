const CableCompany = artifacts.require("./CableCompany.sol");
const Market = artifacts.require("./Market.sol");
const SupplyContract = artifacts.require("./SupplyContract.sol");
const SmartMeter = artifacts.require("./SmartMeter.sol");

module.exports = async function (deployer, network, accounts) {
    //USE THIS TO AUTOMATE THINGS!! haha
    const adminAccount = accounts[0];

    // Deploy CableCompany
    await deployer.deploy(CableCompany, { from: adminAccount });

    /**  Deploy Market
     * @param cableCompanyAddress: address
     **/
    await deployer.deploy(Market, CableCompany.address, { from: adminAccount });

    // Deploy SmartMeter
    await deployer.deploy(SmartMeter);

    /** Deploy SupplyContract
     * @param buyer: address
     * @param seller: address
     * @param amount: uint (Wh)
     * @param price: uint (Euro Cents)
     *
     **/
    await deployer.deploy(SupplyContract, accounts[0], accounts[1], 1, 1);
};
