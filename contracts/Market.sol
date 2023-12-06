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

    struct Offer {
        string id;
        uint256 price;
        uint256 amount;
        uint256 expiration;
        address owner;
        address smartMeterAddress;
        bool active;
    }

    mapping(string => Offer) private offers;
    string[] public offerIds;
    address public lastestSupplyChainAddress;

    constructor(address _cableCompanyAddress) payable {
        owner = msg.sender;
        cableCompany = ICableCompany(_cableCompanyAddress);
    }

    function addOffer(
        string memory id,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        address smartMeterAddress
    ) public returns (bool) {
        require(
            cableCompany.isRegisteredKey(msg.sender, smartMeterAddress),
            "Smart Meter not registered by Cable Company"
        );

        ISmartMeter smartMeter = ISmartMeter(smartMeterAddress); // maybe here
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
            smartMeterAddress: smartMeterAddress,
            active: true
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

    function buyOffer(string memory id) public returns (address) {
        Offer memory offer = offers[id];
        address buyer = msg.sender;
        address seller = offer.owner;
        uint amount = offer.amount;
        uint price = offer.price;
        uint expiration = offer.expiration;

        require(expiration > block.timestamp, "Cannot buy expired offer");
        require(msg.sender != seller, "Owner cannot buy own offer");

        SupplyContract sc = new SupplyContract({
            _buyer: buyer,
            _seller: seller,
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
}

contract SupplyContract {
    address public buyer;
    address public seller;
    uint256 private amount; // Wh
    uint256 private price; // Euro cents
    uint256 timestamp; // Unix

    struct SupplyContractDTO {
        address scAddress;
        address buyer;
        address seller;
        uint256 price;
        uint256 amount;
        uint256 timestamp;
    }

    constructor(
        address _buyer,
        address _seller,
        uint256 _amount,
        uint256 _price
    ) {
        buyer = _buyer;
        seller = _seller;
        amount = _amount;
        price = _price;
        timestamp = block.timestamp;
    }

    function getBuyer() public view returns (address) {
        return buyer;
    }

    function getSeller() public view returns (address) {
        return seller;
    }

    function getAmount() public view returns (uint256) {
        require((msg.sender == buyer) || (msg.sender == seller));
        return amount;
    }

    function getPrice() public view returns (uint256) {
        require((msg.sender == buyer) || (msg.sender == seller));
        return price;
    }

    function getInfo() public view returns (SupplyContractDTO memory) {
        uint256 priceDTO = 0;
        uint256 amountDTO = 0;

        if (msg.sender == buyer) {
            priceDTO = price;
            amountDTO = amount;
        }
        if (msg.sender == seller) {
            priceDTO = price;
            amountDTO = amount;
        }

        SupplyContractDTO memory scDTO = SupplyContractDTO({
            scAddress: address(this),
            buyer: buyer,
            seller: seller,
            price: priceDTO,
            amount: amountDTO,
            timestamp: timestamp
        });

        return scDTO;
    }
}
