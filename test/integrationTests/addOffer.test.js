const Market = artifacts.require("Market");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeter");
const encodedSecretString = web3.eth.abi.encodeParameters(
    ["string"],
    ["test1"]
);
const hash = web3.utils.soliditySha3(encodedSecretString);

contract("Add Offer", (accounts) => {
    let market;
    let cableCompany;
    let smartMeter;

    const admin = accounts[0];
    const user = accounts[1];
    const smartMeterAddress = accounts[2];

    beforeEach(async () => {
        cableCompany = await CableCompany.new({ from: admin });
        market = await Market.new(cableCompany.address, { from: admin });
        smartMeter = await SmartMeter.new({ from: user });
        await smartMeter.createSmartMeter(market.address, hash, {
            from: smartMeterAddress,
        });
        await smartMeter.setCurrentMarketAddress(market.address, {
            from: user,
        });
        await cableCompany.registerKey(user, smartMeter.address, {
            from: admin,
        });
        await smartMeter.createLog(10, 50, {
            from: user,
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
            smartMeter.address,
            sellerSignature,
            nonce,
            user,
            encodedSecretString,
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
                smartMeter.address,
                sellerSignature,
                nonce,
                user,
                encodedSecretString,
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
                smartMeter.address,
                sellerSignature,
                nonce,
                user,
                encodedSecretString,
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

    it("Should allow to different nonces", async () => {
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
            smartMeter.address,
            sellerSignature,
            nonce,
            user,
            encodedSecretString,
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
            smartMeter.address,
            sellerSignature,
            newNonce,
            user,
            encodedSecretString,
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
                smartMeter.address,
                sellerSignature,
                nonce,
                user,
                encodedSecretString,
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
                smartMeter.address,
                sellerSignature,
                nonce,
                user,
                encodedSecretString,
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

    it("Should fail to because hash is updated", async () => {
        const offerId = "id";
        const amount = 1; // Too much energy
        const price = 1;
        const date = Date.now();
        let errorMessage = "";
        const sellerSignature = "signature1";
        const encodedSecretString = web3.eth.abi.encodeParameters(
            ["string"],
            ["test1"]
        );
        const encodedSecretString2 = web3.eth.abi.encodeParameters(
            ["string"],
            ["test2"]
        );

        const newHash = web3.utils.soliditySha3(encodedSecretString2);
        try {
            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeter.address,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecretString,
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
                smartMeter.address,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecretString,
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
        const nonce = Math.floor(Math.random() * 1000);
        const encodedSecretString = web3.eth.abi.encodeParameters(
            ["string"],
            ["test1"]
        );
        const encodedSecretString2 = web3.eth.abi.encodeParameters(
            ["string"],
            ["test2"]
        );

        const newHash = web3.utils.soliditySha3(encodedSecretString2);
        try {
            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeter.address,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecretString,
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
                smartMeter.address,
                sellerSignature,
                Math.floor(Math.random() * 1000),
                user,
                encodedSecretString2,
                hash,
                {
                    from: user,
                }
            );
            // if no error is raised we get here
            assert.equal(true, true, "");
        } catch (error) {
            errorMessage = error.data.stack ?? "";
        }
    });
});
