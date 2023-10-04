const SupplyContract = artifacts.require("./SupplyContract.sol");


contract("Supply Contract", (accounts) => {
    const buyer = accounts[0];
    const seller = accounts[1];

    // TESTING AMOUNT
    it("Should get the amount (Wh)", async () => {
        let supplyContract = await SupplyContract.deployed();
        let amount = await supplyContract.getAmount({from: buyer});
        assert.equal(amount, 1, "The amount is incorrect");
    })

    it("Should try and the get amount and fail", async () => {
        /* Only the seller and buy should be able to view the amount
        therefore, another account, should not be able to get the amount
        */

        let supplyContract = await SupplyContract.deployed();
        let amount;
        try {
            amount = await supplyContract.getAmount({from: accounts[2]});
        } catch (error) {
            amount = "N/A"
        }
        assert.equal(amount, "N/A", "The amount should not be defined");
    })

    // TESTING PRICE
    it("Should get the price (Euro cents)", async () => {
        let supplyContract = await SupplyContract.deployed();
        let price = await supplyContract.getPrice({from: buyer});
        assert.equal(price, 1, "The price is incorrect");
    })

    it("Should try and the get price and fail", async () => {
        /* Only the seller and buy should be able to view the price
        therefore, another account, should not be able to get the price
        */

        let supplyContract = await SupplyContract.deployed();
        let price;
        try {
            price = await supplyContract.getPrice({from: accounts[2]});
        } catch (error) {
            price = "N/A"
        }
        assert.equal(price, "N/A", "The price should not be defined");
    })

    // TESTING BUYER
    it("Should get the buyer's address", async () => {
        let supplyContract = await SupplyContract.deployed();
        let buyerAddress = await supplyContract.getBuyer({from: buyer});
        assert.equal(buyerAddress, buyer, "Address is not correct");
    })

    // TESTING SELLER
    it("Should get the seller's address", async () => {
        let supplyContract = await SupplyContract.deployed();
        let sellerAddress = await supplyContract.getSeller({from: buyer});
        assert.equal(sellerAddress, seller, "Address is not correct");
    })
    
});
