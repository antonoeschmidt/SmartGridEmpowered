
const Market = artifacts.require("Market");

contract("Market", (accounts) => {
  let marketInstance;

  before(async () => {
    marketInstance = await Market.deployed();
  });

  it("should add an offer", async () => {
    let offerIds;
    const offerId = "offer1";
    const price = 100;
    const exp = 100000;
    const kWh = 50;

    offerIds = await marketInstance.getOfferIDs();
    assert.equal(offerIds.length === 0, true, "Offer list not empty");
    
    const result = await marketInstance.addOffer(offerId, price, exp, kWh, {
      from: accounts[0],
    });

    offerIds = await marketInstance.getOfferIDs();
    assert.equal(offerIds.length === 1, true, "Offer list not 1");
    assert.equal(offerIds[0] === offerId, true, "Offer ID is not correct")
  });

  it("should remove an offer", async () => {
    let offers;
    let offer;
    const offerId = "offer1";

    offers = await marketInstance.getOffers();
    offer = offers[0];

    assert.equal(offer.id, offerId, "Offer does not exist")

    const result = await marketInstance.removeOffer(offerId, {
      from: accounts[0],
    });

    offers = await marketInstance.getOffers();
    offer = offers[0];

    assert.notEqual(offer?.id, offerId, "Offer was not removed")
});

  it("should not allow buying own offer", async () => {
    const offerId = "offer2";

    await marketInstance.addOffer(offerId, 100, 100000, 50, {
      from: accounts[0],
    });

    try {
      await marketInstance.buyOffer(offerId, { from: accounts[0] });
      assert.fail("Expected an exception");
    } catch (error) {
      assert.include(
        error.message,
        "Owner cannot buy own offer",
        "Expected 'Owner cannot buy own offer' error"
      );
    }
  });

  it("should get an offer by ID", async () => {
    const offerId = "offer4";

    await marketInstance.addOffer(offerId, 100, 100000, 50, {
      from: accounts[1],
    });

    const offer = await marketInstance.getOffer(offerId);

    assert.equal(offer.owner, accounts[1]);
  });

  it("should get a list of offer IDs", async () => {
    const offerIds = await marketInstance.getOfferIDs();
    assert.isArray(offerIds);
  });

});
