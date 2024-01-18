const SupplyContract = artifacts.require("SupplyContract");

contract("SupplyContract", (accounts) => {
    let supplyContract;
    let buyerSignature = "signature1";
    let sellerSignature = "signature2";
    let nonce = 1;

    beforeEach(async () => {
        supplyContract = await SupplyContract.new(
            buyerSignature,
            sellerSignature,
            100,
            10,
            nonce,
            { from: accounts[0] }
        );
    });

    it("should get buyer and seller signatures", async () => {
        const buyer = await supplyContract.getBuyer();
        assert.equal(buyer, buyerSignature, "Incorrect buyer");

        const seller = await supplyContract.getSeller();
        assert.equal(seller, sellerSignature, "Incorrect seller");
    });

    it("should get supply contract information", async () => {
        const info = await supplyContract.getInfo({ from: accounts[1] });
        assert.equal(
            info.buyerSignature,
            buyerSignature,
            "Incorrect buyer in info"
        );
        assert.equal(
            info.sellerSignature,
            sellerSignature,
            "Incorrect seller in info"
        );
        assert.equal(info.amount, 100, "Incorrect amount in info");
        assert.equal(info.price, 10, "Incorrect price in info");
    });

    it("should get amount and price", async () => {
        const amount = await supplyContract.getAmount();
        assert.equal(amount, 100, "Incorrect amount");

        const price = await supplyContract.getPrice();
        assert.equal(price, 10, "Incorrect price");
    });
});
