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
    struct SupplyContractDTO {
        address buyer;
        address seller;
        uint256 amount;
        uint256 price;
        uint256 timestamp;
    }
    mapping(string => Offer) private offers;
    string[] public offerIds;
    
    mapping(address => SupplyContractDTO) private supplyContracts;
    address[] public supplyContractAddresses;

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

        supplyContracts[address(sc)] = SupplyContractDTO({
            buyer: buyer,
            seller: seller,
            amount: amount,
            price: price,
            timestamp: block.timestamp
        });
        supplyContractAddresses.push(address(sc));
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

    function getSupplyContract(address scAddress) public view returns (SupplyContractDTO memory) {
        return supplyContracts[scAddress];
    }

    function getSupplyContracts() public view returns (SupplyContractDTO[] memory) {
        SupplyContractDTO[] memory supplyContractsReturn = new SupplyContractDTO[](supplyContractAddresses.length);
        for (uint i = 0; i < supplyContractAddresses.length; i++) {
            address scAddress = supplyContractAddresses[i];
            SupplyContractDTO storage sc = supplyContracts[scAddress];
            supplyContractsReturn[i] = sc;
        }
        return supplyContractsReturn;
    }

    function getSupplyContractAddresses() public view returns (address[] memory) {
        return supplyContractAddresses;
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
}
