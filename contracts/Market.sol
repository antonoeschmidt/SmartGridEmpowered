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
    // string groupPublicKey;

    struct Offer {
        string id;
        uint256 price;
        uint256 amount;
        uint256 expiration;
        address owner;
        address smartMeterAddress;
        bool active;
        string sellerSignature;
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
        // groupPublicKey = _groupPublicKey;
    }

    function addOffer(
        string memory id,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        address smartMeterAddress,
        string memory sellerSignature
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

        offers[id] = Offer({
            id: id,
            amount: amount,
            price: price,
            expiration: expiration,
            owner: msg.sender,
            smartMeterAddress: smartMeterAddress, // are we using this?
            active: true,
            sellerSignature: sellerSignature
        });
        offerIds.push(id);

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

        require(expiration > block.timestamp, "Cannot buy expired offer");
        require(msg.sender != seller, "Owner cannot buy own offer");

        SupplyContract sc = new SupplyContract({
            _buyerSignature: buyerSignature,
            _sellerSignature: sellerSignature,
            _amount: amount,
            _price: price
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
    uint256 amount; // Wh
    uint256 price; // Euro cents
    uint256 timestamp; // Unix
    bool confirmed;
    // address dso;

    struct SupplyContractDTO {
        address scAddress;
        string buyerSignature;
        string sellerSignature;
        uint256 price;
        uint256 amount;
        uint256 timestamp;
        bool confirmed;
    }

    constructor(
        string memory _buyerSignature,
        string memory _sellerSignature,
        uint256 _amount,
        uint256 _price
    ) {
        buyerSignature = _buyerSignature;
        sellerSignature = _sellerSignature;
        amount = _amount;
        price = _price;
        timestamp = block.timestamp;
        confirmed = false;
    }

    function getBuyer() public view returns (string memory) {
        return buyerSignature;
    }

    function getSeller() public view returns (string memory) {
        return sellerSignature;
    }

    function getAmount() public view returns (uint256) {
        return amount;
    }

    function getPrice() public view returns (uint256) {
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
            confirmed: confirmed
        });

        return scDTO;
    }

    // function aproveContract() public {
    //     require(msg.sender == dso, "only the DSO can approve a contract");
    //     confirmed = true;
    // }
}
