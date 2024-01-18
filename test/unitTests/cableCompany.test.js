const DSO = artifacts.require("DSO");

contract("DSO", (accounts) => {
    let DSO;

    beforeEach(async () => {
        DSO = await DSO.new();
    });

    it("should register and check a key", async () => {
        const isRegistered = async () =>
            await DSO.isRegisteredKey(accounts[1], accounts[2]);

        assert.isFalse(await isRegistered(), "Key should not be registered");

        await DSO.registerKey(accounts[1], accounts[2], {
            from: accounts[0],
        });

        assert.isTrue(await isRegistered(), "Key is not registered");
    });

    it("should not register an invalid key", async () => {
        await DSO.registerKey(accounts[1], accounts[2], {
            from: accounts[0],
        });

        const isRegistered = await DSO.isRegisteredKey(
            accounts[3],
            accounts[2]
        );
        assert.isFalse(isRegistered, "Invalid key incorrectly registered");
    });

    it("should remove a registered key", async () => {
        const isRegistered = async () =>
            await DSO.isRegisteredKey(accounts[1], accounts[2]);

        await DSO.registerKey(accounts[1], accounts[2], {
            from: accounts[0],
        });
        assert.isTrue(await isRegistered(), "Key not registered");

        await DSO.removeRegisteredKey(accounts[1], {
            from: accounts[0],
        });

        assert.isFalse(await isRegistered(), "Key not removed as expected");
    });

    it("should get owner", async () => {
        const owner = await DSO.getOwner();
        assert.equal(owner, accounts[0], "Incorrect owner");
    });
});
