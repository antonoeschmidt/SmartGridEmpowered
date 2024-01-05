
const Market = artifacts.require("Market");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeter");
const web3 = require("web3");
const BN = require('bn.js');
const {
    createHash,
  } = require('node:crypto');

  const hash = createHash('sha256');

function numStringToBytes32(num) { 
    console.log("before")
    var bn = new BN(num, 16).toTwos(256);
    console.log("after bn")
    return padToBytes32(bn.toString(16));
 }
 
 function bytes32ToNumString(bytes32str) {
     bytes32str = bytes32str.replace(/^0x/, '');
     var bn = new BN(bytes32str, 16).fromTwos(256);
     return bn.toString();
 }
 
 function padToBytes32(n) {
     while (n.length < 64) {
         n = "0" + n;
     }
     return "0x" + n;
 }

 let blindingFactor = "12321312";
 hash.update(blindingFactor);
 const digest = hash.digest();

contract("Add Offer", (accounts) => {
    let market;
    let cableCompany;
    let smartMeter;

    const admin = accounts[0];
    const user = accounts[1];
    let blindingFactor = "12321312";
    // hash.update(blindingFactor);

    beforeEach(async () => {
        cableCompany = await CableCompany.new({ from: admin });
        market = await Market.new(cableCompany.address, { from: admin });
        let bytes32 = web3.eth.abi.encodeParameter('bytes32', digest);
        smartMeter = await SmartMeter.new((bytes32), { from: user });
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
        const encoder = new TextEncoder();
        const bytes = encoder.encode(blindingFactor);
        let byteEncondedBlind = web3.eth.abi.encodeParameter('bytes32', bytes);
        // hash.update("Should add an offer")
        await market.addOffer(
            offerId,
            amount,
            price,
            date,
            smartMeter.address,
            sellerSignature,
            nonce,
            user,
            byteEncondedBlind,
            byteEncondedBlind,
            {
                from: user,
            },
        );
        blindingFactor = "Should add an offer";

        const offer = await market.getOffer(offerId);

        assert.equal(offer.id, offerId);
        assert.equal(offer.price, 1);
        assert.equal(offer.amount, 1);
        assert.equal(offer.owner, user);
        assert.equal(offer.active, true);
        assert.equal(offer.nonce, nonce);
    });

    it("Should fail to make an offer", async () => {
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
                blindingFactor,
                "hashBytes",
                {
                    from: user,
                }
            );
        } catch (error) {
            errorMessage = error.data.stack;
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
                {
                    from: user,
                }
            );
        } catch (error) {
            errorMessage = error.data.stack;
        }

        assert.equal(
            errorMessage.includes("Offers lifespan is too long"),
            true,
            "Not the right error"
        );
    });

    it("Should allow to different nonces nonce", async () => {
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
                {
                    from: user,
                }
            );
        } catch (error) {
            errorMessage = error.data.stack ?? "";
        }

        assert.equal(
            errorMessage.includes("Nonce was used recently"),
            true,
            "Not the right error"
        );
    });
});
