const Market = artifacts.require("Market");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeter");

contract("Add Offer", (accounts) => {
    let market;
    let cableCompany;
    let smartMeter;

    const admin = accounts[0];
    const user = accounts[1];

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
    });

    it("Should add an offer", async () => {
        const offerId = "id";
        const amount = 1;
        const price = 1;
        const date = Date.now();
        const sellerSignature = "signature1";

        await market.addOffer(
            offerId,
            amount,
            price,
            date,
            smartMeter.address,
            sellerSignature,
            {
                from: user,
            }
        );

        const offer = await market.getOffer(offerId);
        const nonce = await (await market.getNonce()).toString();

        assert.equal(offer.id, offerId);
        assert.equal(offer.price, 1);
        assert.equal(offer.amount, 1);
        assert.equal(offer.owner, user);
        assert.equal(offer.active, true);
        assert.equal(offer.nonce, nonce - 1); // nonce is incremented after the offer is added
    });

    it("Should fail to make an offer", async () => {
        const offerId = "id";
        const amount = 100; // Too much energy
        const price = 1;
        const date = Date.now();
        let errorMessage;
        const sellerSignature = "signature1";

        try {
            await market.addOffer(
                offerId,
                amount,
                price,
                date,
                smartMeter.address,
                sellerSignature,
                {
                    from: user,
                }
            );
        } catch (error) {
            errorMessage = error.reason;
        }

        assert.equal(
            errorMessage,
            "Not enough stored energy",
            "Not the right error"
        );
    });
});
