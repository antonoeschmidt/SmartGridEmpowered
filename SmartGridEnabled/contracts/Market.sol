// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract Market {
    address owner;
    CableCompany cableCompany;

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
        cableCompany = CableCompany(_cableCompanyAddress);
    }

    function addOffer(
        string memory id,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        address smartMeterAddress
    ) public returns (bool) {

        require(cableCompany.isRegisteredKey(msg.sender, smartMeterAddress), "Smart Meter not registered by Cable Company");

        SmartMeter smartMeter = SmartMeter(smartMeterAddress);        
        require(smartMeter.subtractBatteryCharge(amount), "Not enough stored energy");

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

    function removeOffer(string memory id, address smartMeterAddress) public returns (bool) {
        Offer memory offer = offers[id];
        require(msg.sender == offer.owner);
        SmartMeter smartMeter = SmartMeter(smartMeterAddress); 
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

contract SmartMeter {
    address owner;
    address currentMarketAddress;
    uint private totalConsumption;
    uint private totalProduction;
    uint batteryCharge;
    uint lastDataSent;
    uint transmissionInterval = 15 seconds;

    constructor() {
        owner = msg.sender;
        totalConsumption = 0;
        totalProduction = 0;
    }

    struct PowerData {
        uint256 intervalConsumption;
        uint256 intervalProduction;
        uint256 totalConsumption;
        uint256 totalProduction;
    }

    event Log(address sender, PowerData pd, uint256 timeStamp);

    function createLog(uint256 intervalConsumption, uint256 intervalProduction)
        public
    {
        require(msg.sender == owner);
        require(block.timestamp - lastDataSent > transmissionInterval, "Logs cannot appear more frequently than the transmission interval");
        totalConsumption += intervalConsumption;
        totalProduction += intervalProduction;

        if (intervalProduction - intervalConsumption > 0) {
            batteryCharge += intervalProduction - intervalConsumption;
        }

        emit Log(
            msg.sender,
            PowerData({
                totalProduction: totalProduction,
                totalConsumption: totalConsumption,
                intervalConsumption: intervalConsumption,
                intervalProduction: intervalProduction
            }),
            block.timestamp
        );
        lastDataSent = block.timestamp;
    }

    function getBatteryCharge() public view returns(uint) {
        return batteryCharge;
    }

    function subtractBatteryCharge(uint amount) public returns (bool) {
        require(msg.sender == currentMarketAddress, "Only registered market can substract energy");
        if (batteryCharge < amount) {
            return false;
        }
        batteryCharge -= amount;
        return true;
    }

    function setCurrentMarketAddress(address marketAddress) public returns (bool) {
        require(msg.sender == owner, "Only owner can change market address");
        currentMarketAddress = marketAddress;
        return true;
    }

    function returnReservedBatteryCharge(uint returnedBatteryCharge) public returns (bool) {
        require(msg.sender == currentMarketAddress, "Only registered market can return energy");
        batteryCharge += returnedBatteryCharge;
        return true;
    }

}

contract CableCompany {
    address owner;
    mapping(address => address) pubKeys;

    constructor() {
        owner = msg.sender;
    }

    function registerKey(address smartMeterPubKey, address smartMeterAddress) public {
        require(msg.sender == owner, "Only owner can register new keys");
        pubKeys[smartMeterPubKey] = smartMeterAddress;
    }

    function isRegisteredKey(address smartMeterPubKey, address smartMeterAddress) view public returns (bool) {
        require(pubKeys[smartMeterPubKey] == smartMeterAddress, "Key not registered");
        return true;
    }

    function removeRegisteredKey(address smartMeterPubKey) public {
        require(msg.sender == owner, "Only owner can remove keys");
        delete pubKeys[smartMeterPubKey];
    }
}
