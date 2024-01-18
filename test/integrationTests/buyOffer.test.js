const { getSecrets } = require("../utils/hash");
const Market = artifacts.require("Market");
const DSO = artifacts.require("DSO");
const SmartMeter = artifacts.require("SmartMeter");
const {encodedSecret, hash} = getSecrets("test1");

contract("Buy Offer", (accounts) => {
    let market;
    let dso;
    let smartMeter;

    const admin = accounts[0];
    const user = accounts[1];
    const validBuyer = accounts[2];
    const smartMeterAddress = accounts[3];
    const offerId = "id";
    const amount = 1;
    const price = 1;
    const date = Date.now();
    const sellerSignature = "signature1";
    const buyerSignature = "signature2";
    const nonce = Math.floor(Math.random() * 1000);

    beforeEach(async () => {
        dso = await DSO.new({ from: admin });
        smartMeter = await SmartMeter.new({ from: user });
        market = await Market.new(dso.address, smartMeter.address, { from: admin });

        await smartMeter.createSmartMeter(market.address, hash, {
            from: smartMeterAddress,
        });
        
        await dso.registerKey(user, smartMeterAddress, {
            from: admin,
        });
        await smartMeter.createLog(10, 50, {
            from: smartMeterAddress,
        });
        await market.addOffer(
            offerId,
            amount,
            price,
            date,
            smartMeterAddress,
            sellerSignature,
            nonce,
            user,
            encodedSecret,
            hash,
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
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            true,
            errorMessage.includes(validErrorMessage),
            "Wrong error message"
        );
    });

    it("Should fail to buy expired offer", async () => {
        const expiredOfferId = "expiredId";
        const expiredDate = 1;
        const validErrorMessage = "Cannot buy expired offer";
        const newNonce = Math.floor(Math.random() * 1000);
        let errorMessage;

        await market.addOffer(
            expiredOfferId,
            amount,
            price,
            expiredDate,
            smartMeterAddress,
            sellerSignature,
            newNonce,
            user,
            encodedSecret,
            hash,
            {
                from: user,
            }
        );

        try {
            await market.buyOffer(expiredOfferId, buyerSignature, {
                from: user,
            });
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            true,
            errorMessage.includes(validErrorMessage),
            "Wrong error message"
        );
    });

    it("Should buy an offer", async () => {
        let offers = await market.getOfferIDs();
        assert.equal(offers.length, 1, "No offers found");

        await market.buyOffer(offerId, buyerSignature, { from: validBuyer });

        offers = await market.getOfferIDs();
        assert.equal(offers.length, 0, "Too many offers");
    });
});
