const Market = artifacts.require("Market");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeter");
const encodedSecretString = web3.eth.abi.encodeParameters(
    ["string"],
    ["test1"]
);
const hash = web3.utils.soliditySha3(encodedSecretString);

const url = "http://127.0.0.1:5000";
const apikey = "SuperSecretKey";

const getPastEvents = async(address, abi, eventName) => {
    const contract = new web3.eth.Contract(abi, address);
    
    return await contract.getPastEvents(eventName, {
        fromBlock: 0,
        toBlock: 'latest'
        //@ts-ignore
    }, function(error, events){return events})
    .then(events => events);
};

const addMember = async (name) => {
    const response = fetch(`${url}/add-member/${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json", // or the appropriate content type
            "x-api-key": apikey
            // Add any other headers if needed
        }
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
    if (response?.key && response?.message)
        return { key: response.key, message: response.message };
    return response;
};

const sign = async (message, key) => {
    try {
        const response = await fetch(`${url}/sign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message, key: key }),
        });
        const json = await response.json();

        if (json.signature) {
            return json.signature;
        } else {
            throw new Error("No signature");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const verify = async (signature, message) => {
    try {
        const response = await fetch(`${url}/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message, signature: signature }),
        });
        const json = await response.json();

        return json.valid;
    } catch (error) {
        console.error("Error:", error);
    }
};


contract("Add Offer", (accounts) => {
    let market;
    let cableCompany;
    let smartMeter;

    const admin = accounts[0];
    const sellerAddress = accounts[1];
    const smartMeterAddress = accounts[2];
    const buyerAddress = accounts[3];
    const sellerAddress2 = accounts[4];
    const smartMeterAddress2 = accounts[5];

    const createOffer = async(offer) => {
    
        const sellerSignature = await sign(JSON.stringify({
            amount: offer.amount,
            price: offer.price,
            nonce: offer.nonce,
        }),
            offer.sellerKey
        );

        await market.addOffer(
            offer.offerId,
            offer.amount,
            offer.price,
            offer.date,
            offer.smartMeterAddress,
            sellerSignature,
            offer.nonce,
            offer.sellerAddress,
            encodedSecretString,
            hash,
            {
                from: offer.sellerAddress,
            }
        );
        return sellerSignature;
}

        const buyOffer = async(offer, buyerId, marketInstance) => {
            const buyerKey = await addMember(buyerId);
                const buyerSignature = await sign(JSON.stringify({
                    amount: Number(offer.amount),
                    price: Number(offer.price),
                    sellerSignature: offer.sellerSignature,
                    nonce: Number(offer.nonce),
                }),
                    buyerKey.key
                );
                
                await market.buyOffer(offer.offerId, buyerSignature, { from: buyerAddress });
        }

    beforeEach(async () => {
        cableCompany = await CableCompany.new({ from: admin });

        smartMeter = await SmartMeter.new({ from: sellerAddress });

        market = await Market.new(cableCompany.address, smartMeter.address, { from: admin });
        
        await smartMeter.createSmartMeter(market.address, hash, {
            from: smartMeterAddress,
        });
        await smartMeter.createSmartMeter(market.address, hash, {
            from: smartMeterAddress2,
        });

        await cableCompany.registerKey(sellerAddress, smartMeterAddress, {
            from: admin,
        });

        await cableCompany.registerKey(sellerAddress2, smartMeterAddress2, {
            from: admin,
        });

        await smartMeter.createLog(10, 50, {
            from: smartMeterAddress,
        });

        await smartMeter.createLog(10, 50, {
            from: smartMeterAddress2,
        });

        const amount = 1;
        const price = 1;
        const date = Date.now() + 1000*60;
        
        const sellerKey = await addMember("seller");
        const offer1 = {sellerAddress: sellerAddress, sellerKey: sellerKey.key, smartMeterAddress: smartMeterAddress, nonce: Math.floor(Math.random() * 1000), offerId: "id1", amount: amount, price: price, date: date}
        const seller1signature = await createOffer(offer1);
        await buyOffer({...offer1, sellerSignature: seller1signature}, "buyer1", market);


        const sellerKey2 = await addMember("seller2");
        const offer2 = {sellerAddress: sellerAddress2, sellerKey: sellerKey2.key, smartMeterAddress: smartMeterAddress2, nonce: Math.floor(Math.random() * 1000), offerId: "id2", amount: amount, price: price, date: date}
        const seller2signature = await createOffer(offer2);
        await buyOffer({...offer2, sellerSignature: seller2signature}, "buyer2", market);

    });

    it("Validate both offers", async () => {
        const watcher = market.ApproveOffer();
        const pendingOffers = await market.getPendingOffers();

        assert.equal(pendingOffers.length, 2, "There is not 2 pending offers");

        const indicies = await Promise.all(pendingOffers.map(async (pendingOffer) => {

            const verifySellerSignature = await verify(pendingOffer.sellerSignature, JSON.stringify({
                amount: Number(pendingOffer.amount),
                price: Number(pendingOffer.price),
                nonce: Number(pendingOffer.nonce),
            }));
            
            if (!verifySellerSignature) return false;

            const verifyBuyerSignature = await verify(pendingOffer.buyerSignature, JSON.stringify({
                amount: Number(pendingOffer.amount),
                    price: Number(pendingOffer.price),
                    sellerSignature: pendingOffer.sellerSignature,
                    nonce: Number(pendingOffer.nonce),
            }));

            if (!verifyBuyerSignature) return false;


            return true;
        }));

        assert.equal(indicies[0] && indicies[1], true, "Both signatures weren't correctly")
        await market.validatePendingOffers(indicies, {from: admin});
        
        
        const emittedEvents = await getPastEvents(market.address, market.abi, "ApproveOffer");

        emittedEvents.forEach(event => {
            assert.equal(event.returnValues.buyerSignature == pendingOffers[0].buyerSignature || event.returnValues.buyerSignature == pendingOffers[1].buyerSignature, true, "Signatures didn't match");
        });
        
        

        const newPendingOffers = await market.getPendingOffers();

        assert.equal(newPendingOffers.length, 0, "There is still pending offers");

        const charge = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(charge), 39, "The battery charge was returned");


    });

    it("Should fail to validate so the smart meter charge should be returned", async () => {
        const pendingOffers = await market.getPendingOffers();

        const indicies = await Promise.all(pendingOffers.map(async (pendingOffer) => {
            const verifyBuyerSignature = await verify(pendingOffer.buyerSignature, JSON.stringify({
                amount: 0,
                price: 0,
                sellerSignature: "",
                nonce: 0,
            }));
            if (!verifyBuyerSignature) return false;

            const verifySellerSignature = await verify(pendingOffer.sellerSignature, JSON.stringify({
                amount: 0,
                price: 0,
                nonce: 0,
            }));
            
            if (!verifySellerSignature) return false;

            return true;
        }));

        await market.validatePendingOffers(indicies, {from: admin});

        const newPendingOffers = await market.getPendingOffers();

        assert.equal(newPendingOffers.length, 0, "There is still pending offers");

        const charge = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(charge), 40, "The battery charge was was not returned");
    });

    it("Should emit one event and return the battery charge to the other one", async () => {
        const indicies = [false, true];

        await market.validatePendingOffers(indicies, {from: admin});

        const newPendingOffers = await market.getPendingOffers();

        assert.equal(newPendingOffers.length, 0, "There is still pending offers");

        const charge = await smartMeter.getBatteryCharge(smartMeterAddress);
        assert.equal(Number(charge), 40, "The battery charge was was not returned");

    });

   
});
