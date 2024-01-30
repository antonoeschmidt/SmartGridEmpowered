// Use for automation scripts

const DSO = artifacts.require("./DSO.sol");
const Market = artifacts.require("./Market.sol");
const SmartMeter = artifacts.require("./SmartMeter.sol");

module.exports = async function (deployer, network, accounts) {
    const adminAccount = accounts[0];
    // Deploy DSO
    await deployer.deploy(DSO, { from: adminAccount });

    // deploy smartmeter
    await deployer.deploy(SmartMeter, { from : adminAccount});

    /**  Deploy Market
     * @param DSO.address: address
     **/
    await deployer.deploy(Market, DSO.address, SmartMeter.address, { from: adminAccount });
};
