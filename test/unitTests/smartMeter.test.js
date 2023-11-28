const SmartMeter = artifacts.require("SmartMeter");

contract("SmartMeter", (accounts) => {
    let marketAddress = accounts[0];
    let account = accounts[1];
    let smartMeter;

    beforeEach(async () => {
        smartMeter = await SmartMeter.new({ from: account });
        await smartMeter.setCurrentMarketAddress(marketAddress, {
            from: account,
        });
    });

    it("should create a log", async () => {
        const result = await smartMeter.createLog(100, 50, {
            from: account,
        });

        // Assuming you emit the Log event, you can check the event details
        assert.equal(result.logs.length, 1, "Log event not emitted");
        const logEvent = result.logs[0];
        assert.equal(logEvent.event, "Log", "Incorrect event emitted");
        assert.equal(logEvent.args.sender, account, "Incorrect sender");
        assert.equal(
            logEvent.args.pd.intervalConsumption,
            100,
            "Incorrect intervalConsumption"
        );
        assert.equal(
            logEvent.args.pd.intervalProduction,
            50,
            "Incorrect intervalProduction"
        );
    });

    it("should get battery charge", async () => {
        const batteryCharge = await smartMeter.getBatteryCharge();
        assert.equal(batteryCharge, 0, "Initial batteryCharge should be 0");
    });

    it("should subtract battery charge", async () => {
        await smartMeter.createLog(100, 150, { from: account });
        const success = await smartMeter.subtractBatteryCharge(50, {
            from: marketAddress,
        });
        assert.isTrue(success.receipt.status);
    });
});
