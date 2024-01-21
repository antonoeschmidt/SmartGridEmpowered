const DSO = artifacts.require("DSO");

contract("DSO", (accounts) => {
    let dso;
    const userAddress = accounts[0]
    const adminAddress = accounts[1];
    const smartMeterAddress = accounts[2];
    const userAddress2 = accounts[3];
    const smartMeterAddress2 = accounts[4];

    beforeEach(async () => {
        dso = await DSO.new({from: adminAddress});
    });

    it("should register and validate registered", async () => {
        const isRegistered = async () =>
            await dso.isRegisteredKey(userAddress, smartMeterAddress);

        assert.isFalse(await isRegistered(), "Key should not be registered");

        await dso.registerKey(userAddress, smartMeterAddress, {
            from: adminAddress,
        });

        assert.isTrue(await isRegistered(), "Key is not registered");
    });

    it("should fail to register a key", async () => {
        let errorMessage;
        try {
            await dso.registerKey(userAddress, smartMeterAddress, {
                from: userAddress,
            });
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            true,
            errorMessage.includes("Only owner can change key map")
        );
    });

    it("should return false when key not registered", async () => {

        const isRegistered = await dso.isRegisteredKey(
            userAddress,
            smartMeterAddress
        );
        assert.isFalse(isRegistered, "Returned true on not registered key");
    });

    it("should remove a registered key", async () => {
        const isRegistered = async () => await dso.isRegisteredKey(userAddress, smartMeterAddress);

        await dso.registerKey(userAddress, smartMeterAddress, {
            from: adminAddress,
        });
        assert.isTrue(await isRegistered(), "Key not registered");

        await dso.removeRegisteredKey(userAddress, {
            from: adminAddress,
        });

        assert.isFalse(await isRegistered(), "Key not removed as expected");
    });

    it("should fail to remove registered key", async () => {
        const isRegistered = async () => await dso.isRegisteredKey(userAddress, smartMeterAddress);

        await dso.registerKey(userAddress, smartMeterAddress, {
            from: adminAddress,
        });
        assert.isTrue(await isRegistered(), "Key not registered");
        let errorMessage = "";

       
        try {
            await dso.removeRegisteredKey(userAddress, {
                from: userAddress,
            });
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }
        assert.equal(
            true,
            errorMessage.includes("Only owner can change key map")
        );

        assert.isTrue(await isRegistered(), "Key not removed as expected");

    });

    it("should get owner", async () => {
        const owner = await dso.getOwner();
        assert.equal(owner, adminAddress, "Incorrect owner");
    });

    
});
