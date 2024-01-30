const SmartMeter = artifacts.require("SmartMeter");
const { getSecrets } = require("../utils/hash");
const {encodedSecret, hash} = getSecrets("secret");

contract("SmartMeter", (accounts) => {
    let marketAddress = accounts[0];
    let account = accounts[1];
    const smartMeterAddress = accounts[2];
    const marketAddress2 = accounts[3];
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
        await smartMeter.createLog(100, 150, { from: smartMeterAddress });
        const batteryCharge2 = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(batteryCharge2, 50, "batteryCharge should be 50");
    });

    it("should subtract battery charge", async () => {
        await smartMeter.createLog(100, 150, { from: smartMeterAddress });
        const success = await smartMeter.subtractBatteryCharge(50, encodedSecret, hash, smartMeterAddress, {
            from: marketAddress,
        });
        assert.isTrue(success.receipt.status);
    });

    

    it("Should return battery charge", async () => {
        const batteryChargeBefore = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(batteryChargeBefore), 0, "The charge is not zero")
        await smartMeter.returnReservedBatteryCharge(10, smartMeterAddress, {from: marketAddress});

        const batteryChargeAfter = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(batteryChargeAfter), 10, "The charge was not returned");
    });

    it("Should set battery to 0 after log", async () => {
        await smartMeter.returnReservedBatteryCharge(50, smartMeterAddress, {from: marketAddress});

        await smartMeter.createLog(80, 25, { from: smartMeterAddress });
        const charge = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(charge), 0, "The charge was not set to 0");
    });

    it("Should subtract 25 charge after log", async () => {
        await smartMeter.returnReservedBatteryCharge(50, smartMeterAddress, {from: marketAddress});
        
        await smartMeter.createLog(50, 25, { from: smartMeterAddress });
        const charge = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(charge), 25, "The charge was not set to 25");
    });

    it("Should set market and return it", async () => {
        let errorMessage = "";
        await smartMeter.setMarketAddress(marketAddress2, {from: smartMeterAddress});
        try {
            const response1 = await smartMeter.subtractBatteryCharge(0, encodedSecret, hash, smartMeterAddress, {from: marketAddress});
            assert.isTrue(response1.receipt.status, false, "The charge was subtracted");
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }
        assert.equal(
            errorMessage.includes("Only registered market can substract energy"),
            true,
            "Not the right error"
        );
        
        const response2 = await smartMeter.subtractBatteryCharge(0, encodedSecret, hash, smartMeterAddress, {from: marketAddress2});
        assert.isTrue(response2.receipt.status, true, "The charge was not subtracted");
    });
});
