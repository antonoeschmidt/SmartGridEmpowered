// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.21 <0.7.0;

contract Billboard {
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
        SupplyContract sc = new SupplyContract({
            _buyer: msg.sender,
            _seller: offer.owner,
            _amount: offer.kWh,
            _price: offer.price
        });
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
}

contract SupplyContract {
    address private buyer;
    address private seller;
    uint256 private amount; // Wh
    uint256 private price; // Euro cents
    uint256 timestamp; // Unix

    constructor(
        address _buyer,
        address _seller,
        uint256 _amount,
        uint256 _price
    ) public {
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
}
