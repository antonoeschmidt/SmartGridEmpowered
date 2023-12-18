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

    function subtractBatteryCharge(uint amount) external returns (bool);
}

contract Market {
    address owner;
    ICableCompany cableCompany;
    // uint nonce;
    // string groupPublicKey;

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

    constructor(
        address _cableCompanyAddress // string memory _groupPublicKey
    ) payable {
        owner = msg.sender;
        cableCompany = ICableCompany(_cableCompanyAddress);
        // nonce = 1;
        // groupPublicKey = _groupPublicKey;
    }

    function addOffer(
        string memory id,
        uint amount,
        uint price,
        uint expiration,
        address smartMeterAddress,
        string memory sellerSignature,
        uint nonce,
        address sellerAddress
    ) public returns (bool) {
        require(
            cableCompany.isRegisteredKey(msg.sender, smartMeterAddress),
            "Smart Meter not registered by Cable Company"
        );

        ISmartMeter smartMeter = ISmartMeter(smartMeterAddress);
        require(
            smartMeter.subtractBatteryCharge(amount),
            "Not enough stored energy"
        );

        require(sellerAddress == msg.sender, "Only owner can add offer");

        offers[id] = Offer({
            id: id,
            amount: amount,
            price: price,
            expiration: expiration,
            owner: msg.sender,
            smartMeterAddress: smartMeterAddress, // are we using this?
            active: true,
            sellerSignature: sellerSignature,
            nonce: nonce
        });
        offerIds.push(id);

        // Increment nonce
        nonce += 1;

        return true;
    }

    function removeOffer(
        string memory id,
        address smartMeterAddress
    ) public returns (bool) {
        Offer memory offer = offers[id];
        require(msg.sender == offer.owner, "Only owner can remove offer");
        ISmartMeter smartMeter = ISmartMeter(smartMeterAddress);
        smartMeter.returnReservedBatteryCharge(offer.amount);
        delete offers[id];
        return true;
    }

    function buyOffer(
        string memory id,
        string memory buyerSignature
    ) public returns (address) {
        Offer memory offer = offers[id];
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
            // String comparison
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

    // function getNonce() public view returns (uint) {
    //     return nonce;
    // }

    // function getGroupPublicKey() public view returns (string memory) {
    //     return groupPublicKey;
    // }

    // function setGroupPublicKey(string memory _groupPublicKey) public {
    //     require(
    //         msg.sender == address(cableCompany),
    //         "Only cable compnay can change the group key"
    //     );
    //     groupPublicKey = _groupPublicKey;
    // }
}

contract SupplyContract {
    string buyerSignature;
    string sellerSignature;
    uint amount; // Wh
    uint price; // Euro cents
    uint timestamp; // Unix
    bool confirmed;
    uint nonce;
    // address dso;

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

    // function aproveContract() public {
    //     require(msg.sender == dso, "only the DSO can approve a contract");
    //     confirmed = true;
    // }
}
