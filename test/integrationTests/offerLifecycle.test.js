const Market = artifacts.require("MarketRevised");
const CableCompany = artifacts.require("CableCompany");
const SmartMeter = artifacts.require("SmartMeterRevised");
const encodedSecretString = web3.eth.abi.encodeParameters(
    ["string"],
    ["test1"]
);
const hash = web3.utils.soliditySha3(encodedSecretString);

const url = "http://127.0.0.1:5000";
const apikey = "SuperSecretKey";


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

    beforeEach(async () => {
        cableCompany = await CableCompany.new({ from: admin });

        smartMeter = await SmartMeter.new(hash, { from: sellerAddress });

        market = await Market.new(cableCompany.address, smartMeter.address, { from: admin });
        
        await smartMeter.createSmartMeter(market.address, hash, {
            from: smartMeterAddress,
        });

        await cableCompany.registerKey(sellerAddress, smartMeterAddress, {
            from: admin,
        });
        await smartMeter.createLog(10, 50, {
            from: smartMeterAddress,
        });
    });

    it("Should add an offer, then buy, then validate", async () => {
        const offerId = "id";
        const amount = 1;
        const price = 1;
        const date = Date.now();
        const nonce = Math.floor(Math.random() * 1000);
        
        const sellerKey = await addMember("seller");
        const sellerSignature = await sign(JSON.stringify({
            amount: amount,
            price: price,
            nonce: nonce,
        }),
            sellerKey.key
        );
        
        await market.addOffer(
            offerId,
            amount,
            price,
            date,
            smartMeterAddress,
            sellerSignature,
            nonce,
            sellerAddress,
            encodedSecretString,
            hash,
            {
                from: sellerAddress,
            }
        );

        const offer = await market.getOffer(offerId);

        const buyerKey = await addMember("buyer");
        const buyerSignature = await sign(JSON.stringify({
            amount: offer.amount,
            price: offer.price,
            sellerSignature: offer.sellerSignature,
            nonce: Number(offer.nonce),
        }),
            buyerKey.key
        );
        
        await market.buyOffer(offerId, buyerSignature, { from: buyerAddress });

        const pendingOffers = await market.getPendingOffers();

        const validIndicies = [];
        await pendingOffers.forEach(async (pendingOffer, index) => {
            const verifyBuyerSignature = await verify(pendingOffer.buyerSignature, JSON.stringify({
                amount: pendingOffer.amount,
                price: pendingOffer.price,
                sellerSignature: pendingOffer.sellerSignature,
                nonce: Number(pendingOffer.nonce),
            }));
            if (!verifyBuyerSignature) return;

            const verifySellerSignature = await verify(pendingOffer.sellerSignature, JSON.stringify({
                amount: Number(pendingOffer.amount),
                price: Number(pendingOffer.price),
                nonce: Number(pendingOffer.nonce),
            }));
            
            if (!verifySellerSignature) return;

            validIndicies.push(index);
            console.log('validIndicies', validIndicies)
        });
        await market.validatePendingOffers(validIndicies, pendingOffers.length - 1, {from: admin});
    });

   
});
