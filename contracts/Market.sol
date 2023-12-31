// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

interface ICableCompany {
    function registerKey(
        address smartMeterPubKey,
        address smartMeterAddress
    ) external;

    function isRegisteredKey(
        address smartMeterPubKey,
        address smartMeterAddress
    ) external view returns (bool);

    function removeRegisteredKey(address smartMeterPubKey) external;
}

interface ISmartMeter {
    function returnReservedBatteryCharge(uint amount) external returns (bool);

    function subtractBatteryCharge(
        uint amount,
        bytes memory ots,
        bytes32 nextOtsHash
    ) external returns (bool);
}

contract Market {
    address owner;
    ICableCompany cableCompany; // Maybe change the name of CableCompany to something else, like DSO
    uint maxOfferLivespan = 1000 * 60 * 60 * 24 * 7;

    struct Offer {
        string id;
        uint price;
        uint amount;
        uint expiration;
        address owner;
        address smartMeterAddress;
        bool active;
        string sellerSignature;
        uint nonce;
    }

    mapping(string => Offer) private offers;
    mapping(string => Offer) private pendingConfirmation;

    string[] public offerIds;
    address public lastestSupplyChainAddress;

    // mapping is nonce to the timestamp it was used at.
    mapping(uint => uint) private usedNonces;

    modifier nonceGuard(uint nonce) {
        uint timestamp = usedNonces[nonce];
        // nonce was used within the last two weeks.
        if (timestamp + maxOfferLivespan * 2 > block.timestamp * 1000) {
            revert("Nonce was used recently");
        }
        _;
    }

    constructor(address _cableCompanyAddress) payable {
        owner = msg.sender;
        cableCompany = ICableCompany(_cableCompanyAddress);
    }

    function addOffer(
        string memory id,
        uint amount,
        uint price,
        uint expiration,
        address smartMeterAddress,
        string memory sellerSignature,
        uint nonce,
        address sellerAddress,
        bytes memory ots,
        bytes32 nextOtsHash
    ) public nonceGuard(nonce) returns (bool) {
        // Require conditions
        require(
            cableCompany.isRegisteredKey(msg.sender, smartMeterAddress),
            "Smart Meter not registered by Cable Company"
        );
        require(
            block.timestamp * 1000 + maxOfferLivespan > expiration,
            "Offers lifespan is too long"
        );
        require(sellerAddress == msg.sender, "Only owner can add offer");

        ISmartMeter smartMeter = ISmartMeter(smartMeterAddress);
        require(
            smartMeter.subtractBatteryCharge(amount, ots, nextOtsHash),
            "Not enough stored energy"
        );

        // Adding offer
        usedNonces[nonce] = block.timestamp * 1000;
        offers[id] = Offer({
            id: id,
            amount: amount,
            price: price,
            expiration: expiration,
            owner: msg.sender,
            smartMeterAddress: smartMeterAddress,
            active: true,
            sellerSignature: sellerSignature,
            nonce: nonce
        });
        offerIds.push(id);

        return true;
    }

    function removeOffer(
        string memory id,
        address smartMeterAddress
    ) public returns (bool) {
        // Initialization
        Offer memory offer = offers[id];
        ISmartMeter smartMeter = ISmartMeter(smartMeterAddress);

        // Require conditions
        require(msg.sender == offer.owner, "Only owner can remove offer");

        // Removing offer
        smartMeter.returnReservedBatteryCharge(offer.amount);
        delete offers[id];

        return true;
    }

    function buyOffer(
        string memory id,
        string memory buyerSignature
    ) public returns (address) {
        // Initialization
        Offer memory offer = offers[id];

        // Require conditions
        require(
            keccak256(bytes(offer.id)) == keccak256(bytes(id)),
            "No offer found"
        );
        string memory sellerSignature = offer.sellerSignature;
        address seller = offer.owner;
        uint amount = offer.amount;
        uint price = offer.price;
        uint expiration = offer.expiration;
        uint offerNonce = offer.nonce;
        require(expiration > block.timestamp, "Cannot buy expired offer");
        require(msg.sender != seller, "Owner cannot buy own offer");

        // Buying offer and creating SupplyContract
        SupplyContract sc = new SupplyContract({
            _buyerSignature: buyerSignature,
            _sellerSignature: sellerSignature,
            _amount: amount,
            _price: price,
            _nonce: offerNonce
        });
        lastestSupplyChainAddress = address(sc);
        delete offers[id];

        for (uint i = 0; i < offerIds.length; i++) {
            // String comparison to remove purchased offer
            if (keccak256(bytes(offerIds[i])) == keccak256(bytes(id))) {
                offerIds[i] = offerIds[offerIds.length - 1];
                offerIds.pop();
            }
        }

        return address(sc);
    }

    function getOffer(string memory id) public view returns (Offer memory) {
        return offers[id];
    }

    function getOffers() public view returns (Offer[] memory) {
        Offer[] memory offersReturn = new Offer[](offerIds.length);
        for (uint i = 0; i < offerIds.length; i++) {
            string storage offerId = offerIds[i];
            Offer storage offer = offers[offerId];

            offersReturn[i] = offer;
        }
        return offersReturn;
    }

    function getOfferIDs() public view returns (string[] memory) {
        return offerIds;
    }

    function getLatestSupplyContract() public view returns (address) {
        return lastestSupplyChainAddress;
    }

    function getPendingOffers() public view returns (address) {
        return lastestSupplyChainAddress;
    }
}

contract SupplyContract {
    string buyerSignature;
    string sellerSignature;
    uint amount; // Wh
    uint price; // Euro cents
    uint timestamp; // Unix
    bool confirmed;
    uint nonce;

    struct SupplyContractDTO {
        address scAddress;
        string buyerSignature;
        string sellerSignature;
        uint price;
        uint amount;
        uint timestamp;
        bool confirmed;
        uint nonce;
    }

    constructor(
        string memory _buyerSignature,
        string memory _sellerSignature,
        uint _amount,
        uint _price,
        uint _nonce
    ) {
        buyerSignature = _buyerSignature;
        sellerSignature = _sellerSignature;
        amount = _amount;
        price = _price;
        timestamp = block.timestamp;
        confirmed = false;
        nonce = _nonce;
    }

    function getBuyer() public view returns (string memory) {
        return buyerSignature;
    }

    function getSeller() public view returns (string memory) {
        return sellerSignature;
    }

    function getAmount() public view returns (uint) {
        return amount;
    }

    function getPrice() public view returns (uint) {
        return price;
    }

    function getInfo() public view returns (SupplyContractDTO memory) {
        SupplyContractDTO memory scDTO = SupplyContractDTO({
            scAddress: address(this),
            buyerSignature: buyerSignature,
            sellerSignature: sellerSignature,
            price: price,
            amount: amount,
            timestamp: timestamp,
            confirmed: confirmed,
            nonce: nonce
        });

        return scDTO;
    }
}
