const Market = artifacts.require("Market");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeter");

contract("Buy Offer", (accounts) => {
    let market;
    let cableCompany;
    let smartMeter;

    const admin = accounts[0];
    const user = accounts[1];
    const validBuyer = accounts[2];
    const offerId = "id";
    const amount = 1;
    const price = 1;
    const date = Date.now();
    const sellerSignature = "signature1";
    const buyerSignature = "signature2";
    const nonce = Math.floor(Math.random() * 1000);

    beforeEach(async () => {
        cableCompany = await CableCompany.new({ from: admin });
        market = await Market.new(cableCompany.address, { from: admin });
        smartMeter = await SmartMeter.new({ from: user });
        await smartMeter.setCurrentMarketAddress(market.address, {
            from: user,
        });
        await cableCompany.registerKey(user, smartMeter.address, {
            from: admin,
        });
        await smartMeter.createLog(10, 50, {
            from: user,
        });
        await market.addOffer(
            offerId,
            amount,
            price,
            date,
            smartMeter.address,
            sellerSignature,
            nonce,
            user,
            {
                from: user,
            }
        );
    });

    it("Should fail to buy own offer", async () => {
        let errorMessage;
        const validErrorMessage = "Owner cannot buy own offer";
        try {
            await market.buyOffer(offerId, buyerSignature, { from: user });
        } catch (error) {
            errorMessage = error.reason;
        }

        assert.equal(errorMessage, validErrorMessage);
    });

    it("Should fail to buy expired offer", async () => {
        const expiredOfferId = "expiredId";
        const expiredDate = 1;
        const validErrorMessage = "Cannot buy expired offer";
        let errorMessage;

        await market.addOffer(
            expiredOfferId,
            amount,
            price,
            expiredDate,
            smartMeter.address,
            sellerSignature,
            nonce,
            user,
            {
                from: user,
            }
        );

        try {
            await market.buyOffer(expiredOfferId, buyerSignature, {
                from: user,
            });
        } catch (error) {
            errorMessage = error.reason;
        }

        assert.equal(errorMessage, validErrorMessage);
    });

    it("Should buy an offer", async () => {
        let offers = await market.getOfferIDs();
        assert.equal(offers.length, 1, "No offers found");

        await market.buyOffer(offerId, buyerSignature, { from: validBuyer });

        offers = await market.getOfferIDs();
        assert.equal(offers.length, 0, "Too many offers");
    });
});
