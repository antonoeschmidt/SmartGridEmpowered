const SmartMeter = artifacts.require("SmartMeter");
const { assert } = require("console");
const { getSecrets } = require("../utils/hash");
const {encodedSecret, hash} = getSecrets("secret");

contract("SmartMeter", (accounts) => {
    let marketAddress = accounts[0];
    let account = accounts[1];
    const smartMeterAddress = accounts[2];
    let smartMeter;

    beforeEach(async () => {
        smartMeter = await SmartMeter.new({ from: account });
        await smartMeter.createSmartMeter(marketAddress, hash, {
            from: smartMeterAddress,
        });
    });

    it("should create a log", async () => {
        const result = await smartMeter.createLog(100, 50, {
            from: smartMeterAddress,
        });

        // Assuming you emit the Log event, you can check the event details
        assert.equal(result.logs.length, 1, "Log event not emitted");
        const logEvent = result.logs[0];
        assert.equal(logEvent.event, "Log", "Incorrect event emitted");
        assert.equal(
            logEvent.args.c,
            100,
            "Incorrect intervalConsumption"
        );
        assert.equal(
            logEvent.args.p,
            50,
            "Incorrect intervalProduction"
        );
    });

    it("should get battery charge", async () => {
        const batteryCharge = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(batteryCharge, 0, "Initial batteryCharge should be 0");
    });

    it("should subtract battery charge", async () => {
        await smartMeter.createLog(100, 150, { from: smartMeterAddress });
        const success = await smartMeter.subtractBatteryCharge(50, encodedSecret, hash, smartMeterAddress, {
            from: marketAddress,
        });
        assert.isTrue(success.receipt.status);
    });
});
