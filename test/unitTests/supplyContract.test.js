const SupplyContract = artifacts.require("SupplyContract");

contract("SupplyContract", (accounts) => {
    let supplyContract;

    beforeEach(async () => {
        supplyContract = await SupplyContract.new(
            accounts[1],
            accounts[2],
            100,
            10,
            { from: accounts[0] }
        );
    });

    it("should get buyer and seller", async () => {
        const buyer = await supplyContract.getBuyer();
        assert.equal(buyer, accounts[1], "Incorrect buyer");

        const seller = await supplyContract.getSeller();
        assert.equal(seller, accounts[2], "Incorrect seller");
    });

    it("should get supply contract information", async () => {
        const info = await supplyContract.getInfo({ from: accounts[1] });
        assert.equal(info.buyer, accounts[1], "Incorrect buyer in info");
        assert.equal(info.seller, accounts[2], "Incorrect seller in info");
        assert.equal(info.amount, 100, "Incorrect amount in info");
        assert.equal(info.price, 10, "Incorrect price in info");
    });

    it("should not get supply contract price and amount", async () => {
        const info = await supplyContract.getInfo({ from: accounts[0] });
        assert.equal(info.buyer, accounts[1], "Incorrect buyer in info");
        assert.equal(info.seller, accounts[2], "Incorrect seller in info");
        assert.equal(info.amount, 0, "Incorrect amount in info");
        assert.equal(info.price, 0, "Incorrect price in info");
    });
});
