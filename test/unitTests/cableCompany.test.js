const DSO = artifacts.require("DSO");

contract("DSO", (accounts) => {
    let dso;

    beforeEach(async () => {
        dso = await DSO.new();
    });

    it("should register and check a key", async () => {
        const isRegistered = async () =>
            await dso.isRegisteredKey(accounts[1], accounts[2]);

        assert.isFalse(await isRegistered(), "Key should not be registered");

        await dso.registerKey(accounts[1], accounts[2], {
            from: accounts[0],
        });

        assert.isTrue(await isRegistered(), "Key is not registered");
    });

    it("should not register an invalid key", async () => {
        await dso.registerKey(accounts[1], accounts[2], {
            from: accounts[0],
        });

        const isRegistered = await dso.isRegisteredKey(
            accounts[3],
            accounts[2]
        );
        assert.isFalse(isRegistered, "Invalid key incorrectly registered");
    });

    it("should remove a registered key", async () => {
        const isRegistered = async () =>
            await dso.isRegisteredKey(accounts[1], accounts[2]);

        await dso.registerKey(accounts[1], accounts[2], {
            from: accounts[0],
        });
        assert.isTrue(await isRegistered(), "Key not registered");

        await dso.removeRegisteredKey(accounts[1], {
            from: accounts[0],
        });

        assert.isFalse(await isRegistered(), "Key not removed as expected");
    });

    it("should get owner", async () => {
        const owner = await dso.getOwner();
        assert.equal(owner, accounts[0], "Incorrect owner");
    });

    it("Should set and get groupkey", async () => {
        const groupKey = "groupkey";
        await dso.setGroupKey(groupKey);
        const _groupKey = await dso.getGroupkey();

        assert.equal(groupKey, _groupKey, "They are not equal");
    });
});
