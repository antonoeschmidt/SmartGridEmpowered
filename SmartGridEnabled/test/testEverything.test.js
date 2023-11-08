const Market = artifacts.require("Market");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeter");
const SupplyContract = artifacts.require("SupplyContract")

contract("Market", (accounts) => {

    let marketInstance;
    let cableCompanyInstance;
    let smartMeterInstance;
    let supplyContractInstance;

    before(async () => {
        Market.defaults({from: accounts[0]});
        cableCompanyInstance = await CableCompany.deployed();
        marketInstance = await Market.new(cableCompanyInstance.address);
        smartMeterInstance = await SmartMeter.deployed();
        supplyContractInstance = await SupplyContract.deployed();
    });

    it("Should just work lmao", async () => {
        // register key
        await cableCompanyInstance.registerKey(accounts[0], smartMeterInstance.address);
        const isRegisteredTrue = await cableCompanyInstance.isRegisteredKey(accounts[0], smartMeterInstance.address);
        assert.equal(isRegisteredTrue, true, "is registered true");
        const isRegisteredFalse = await cableCompanyInstance.isRegisteredKey(accounts[1], smartMeterInstance.address);
        assert.equal(isRegisteredFalse, false, "is registered false");
        // set market
        await smartMeterInstance.setCurrentMarketAddress(marketInstance.address);
        // add charge
        await smartMeterInstance.createLog(0, 5);
        // add offer
        console.log("accounts[0", accounts[0]);
        const response = await marketInstance.addOffer("1", 1, 1, 1, smartMeterInstance.address, {from: accounts[0]});
        
        //assert.equal(isRegistered, true, "Is registered");
    });

})