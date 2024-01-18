const Market = artifacts.require("Market");
const DSO = artifacts.require("DSO");
const SmartMeter = artifacts.require("SmartMeter");
const { getSecrets } = require("../utils/hash");
const {encodedSecret, hash} = getSecrets("secret");


contract("Add Offer", (accounts) => {
    let market;
    let dso;
    let smartMeter;

    const admin = accounts[0];
    const user = accounts[1];
    const smartMeterAddress = accounts[2];

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
    });

    it("Should add an offer", async () => {
        const offerId = "id";
        const amount = 1;
        const price = 1;
        const date = Date.now();
        const sellerSignature = "signature1";
        const nonce = Math.floor(Math.random() * 1000);
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

        const offer = await market.getOffer(offerId);

        assert.equal(offer.id, offerId);
        assert.equal(offer.price, 1);
        assert.equal(offer.amount, 1);
        assert.equal(offer.owner, user);
        assert.equal(offer.active, true);
        assert.equal(offer.nonce, nonce);
    });

    it("Should fail to make an offer because the amount is too high", async () => {
        const offerId = "id";
        const amount = 100; // Too much energy
        const price = 1;
        const date = Date.now();
        let errorMessage = "";
        const sellerSignature = "signature1";
        const nonce = Math.floor(Math.random() * 1000);

        try {
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
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            errorMessage.includes("Not enough stored energy"),
            true,
            "Not the right error"
        );
    });

    it("Should fail to make an offer because of lifespan", async () => {
        const offerId = "id";
        const amount = 100; // Too much energy
        const price = 1;
        const date = Date.now() + 1000 * 60 * 60 * 24 * 14;
        let errorMessage = "";
        const sellerSignature = "signature1";
        const nonce = Math.floor(Math.random() * 1000);

        try {
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
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            errorMessage.includes("Offers lifespan is too long"),
            true,
            "Not the right error"
        );
    });

    it("Should allow two different nonces", async () => {
        const offerId = "id";
        const amount = 1; // Too much energy
        const price = 1;
        const date = Date.now();
        const sellerSignature = "signature1";
        const nonce = Math.floor(Math.random() * 1000);
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
        const newNonce = Math.floor(Math.random() * 1000);
        await market.addOffer(
            offerId,
            amount,
            price,
            date,
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

        const offer = await market.getOffer(offerId);
        assert.equal(offer.nonce, newNonce);
    });

    it("Should fail to reuse nonce", async () => {
        const offerId = "id";
        const amount = 1; // Too much energy
        const price = 1;
        const date = Date.now();
        let errorMessage = "";
        const sellerSignature = "signature1";
        const nonce = Math.floor(Math.random() * 1000);
        try {
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
        } catch (error) {
            errorMessage = error.data.stack;
            if (!errorMessage) {
                errorMessage = error.reason;
            }
        }

        assert.equal(
            errorMessage.includes("Nonce was used recently"),
            true,
            "Not the right error"
        );
    });

    it("Should fail because hash is updated", async () => {
        const offerId = "id";
        const amount = 1; // Too much energy
        const price = 1;
        const date = Date.now();
        let errorMessage = "";
        const sellerSignature = "signature1";

        const { hash: newHash} = getSecrets("test2");

        try {
            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeterAddress,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecret,
                newHash,
                {
                    from: user,
                }
            );

            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeterAddress,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecret,
                hash,
                {
                    from: user,
                }
            );
        } catch (error) {
            errorMessage = error?.data?.stack;
            console.log('errorMessage', errorMessage)
            if (!errorMessage) {
                console.log("!errormessage", error);
                errorMessage = error.reason;
            }
        }

        assert.equal(
            errorMessage.includes("The blinding factor was not correct"),
            true,
            "Not the right error"
        );
    });

    it("Should be successfull with the new hash", async () => {
        const offerId = "id";
        const amount = 1; // Too much energy
        const price = 1;
        const date = Date.now();
        let errorMessage = "";
        const sellerSignature = "signature1";

        const {encodedSecret: encodedSecret2, hash: newHash} = getSecrets("test2");
        try {
            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeterAddress,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecret,
                newHash,
                {
                    from: user,
                }
            );
            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeterAddress,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecret2,
                hash,
                {
                    from: user,
                }
            );
            // if no error is raised we get here
            assert.equal(true, true, "");
        } catch (error) {
            errorMessage = error?.data?.stack ?? "";
        }
    });

    it("Should remove added offer", async () => {
        const offerId = "id";
        const amount = 1;
        const price = 1;
        const date = Date.now();
        const sellerSignature = "signature1";
        const nonce = Math.floor(Math.random() * 1000);
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

        const offers = await market.getOffers();
        assert.equal(offers.length, 1);

        await market.removeOffer(offerId, {
            from: user,
        });
    });
});
