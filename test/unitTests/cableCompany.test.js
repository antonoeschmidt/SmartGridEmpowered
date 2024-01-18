const CableCompany = artifacts.require("CableCompany");

contract("CableCompany", (accounts) => {
    let cableCompany;
    const smartMeterAddress = accounts[9];

    beforeEach(async () => {
        cableCompany = await CableCompany.new();
    });

    it("should register and check a key", async () => {
        const isRegistered = async () =>
            await cableCompany.isRegisteredKey(accounts[1], smartMeterAddress);

        assert.isFalse(await isRegistered(), "Key should not be registered");

        await cableCompany.registerKey(accounts[1], smartMeterAddress, {
            from: accounts[0],
        });

        assert.isTrue(await isRegistered(), "Key is not registered");
    });

    it("should fail to register a key", async () => {
        const nonAdmin = accounts[1];
        let errorMessage;
        try {
            await cableCompany.registerKey(accounts[1], smartMeterAddress, {
                from: nonAdmin,
            });
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            true,
            errorMessage.includes("Only owner can register new keys")
        );
    });

    it("should return false when another user claims the registration", async () => {
        await cableCompany.registerKey(accounts[1], smartMeterAddress, {
            from: accounts[0],
        });

        const isRegistered = await cableCompany.isRegisteredKey(
            accounts[3],
            smartMeterAddress
        );
        assert.isFalse(isRegistered, "Invalid key incorrectly registered");
    });

    it("should remove a registered key", async () => {
        const isRegistered = async () =>
            await cableCompany.isRegisteredKey(accounts[1], smartMeterAddress);

        await cableCompany.registerKey(accounts[1], smartMeterAddress, {
            from: accounts[0],
        });
        assert.isTrue(await isRegistered(), "Key not registered");

        await cableCompany.removeRegisteredKey(accounts[1], {
            from: accounts[0],
        });

        assert.isFalse(await isRegistered(), "Key not removed as expected");
    });

    it("should remove a registered key and fail", async () => {
        const nonAdmin = accounts[1];
        let errorMessage;
        try {
            await cableCompany.registerKey(accounts[1], smartMeterAddress, {
                from: nonAdmin,
            });
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            true,
            errorMessage.includes("Only owner can register new keys")
        );
    });

    it("should get owner", async () => {
        const owner = await cableCompany.getOwner();
        assert.equal(owner, accounts[0], "Incorrect owner");
    });
});
