// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract Market {
    struct Offer {
        string id;
        uint256 price;
        uint256 expirationTime;
        uint256 kWh;
        address owner;
        bool active;
    }

    mapping(string => Offer) private offers;
    string[] public offerIds;
    address public lastestSupplyChainAddress;
    
    constructor() payable {}

    function addOffer(
        string memory id,
        uint256 price,
        uint256 exp,
        uint256 kWh
    ) public returns (bool) {
        offers[id] = Offer({
            id: id,
            price: price,
            expirationTime: exp,
            kWh: kWh,
            owner: msg.sender,
            active: true
        });
        offerIds.push(id);
        return true;
    }

    function removeOffer(string memory id) public returns (bool) {
        Offer memory offer = offers[id];
        require(msg.sender == offer.owner);
        delete offers[id];
        return true;
    }

    function buyOffer(string memory id) public returns (address) {
        Offer memory offer = offers[id];
        require(msg.sender != offer.owner, "Owner cannot buy own offer");
        
        address buyer = msg.sender;
        address seller = offer.owner;
        uint amount = offer.kWh;
        uint price = offer.price;

        SupplyContract sc = new SupplyContract({
            _buyer: buyer,
            _seller: seller,
            _amount: amount,
            _price: price
        });
        lastestSupplyChainAddress = address(sc);

        offer.active = false;
        offers[id] = offer;

        return address(sc);
    }

    function getOffer(string memory id) public view returns (Offer memory) {
        return offers[id];
    }

    function getOffers() public returns (Offer[] memory) {
        Offer[] memory offersReturn = new Offer[](offerIds.length);
        for (uint i = 0; i < offerIds.length; i++) {
            string storage offerId = offerIds[i];
            Offer storage offer = offers[offerId];

            if (offer.expirationTime < block.timestamp) {
                offer.active = false;
            }

            offersReturn[i] = offer;
        }
        return offersReturn;
    }

    function getOfferIDs() public view returns (string[] memory) {
        return offerIds;
    }

    function getLatestSupplyContract() public view returns(address) {
        return lastestSupplyChainAddress;
    }
}

contract SupplyContract {
    address private buyer;
    address private seller;
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
    ) payable {
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
        uint256 priceDTO;
        uint256 amountDTO;

        if ((msg.sender == buyer) || (msg.sender == seller)) {
            priceDTO = price;
            amountDTO = amount;
        } else {
            priceDTO = 0;
            amountDTO = 0;
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
