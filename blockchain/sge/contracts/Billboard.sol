// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */

 struct Offer {
        uint price;
        uint expirationTime; //expiration time
        uint kwh;
        address owner; //maybe it should return without the owner.
        bool active;
    }

contract Billboard {

    Offer[] public offers;

    function _filterOffers() internal {
        for (uint i = 0; i < offers.length; i++) {
            if(offers[i].expirationTime > block.timestamp) {
                offers[i] = offers[offers.length - 1];
                offers.pop();
            }
        }
    }

    function _getOffers() public returns (Offer[] memory) {
        _filterOffers();
        return offers;
    }

    function _getIndex(address owner) view  private returns (uint256) {
        uint index = offers.length;
        for (uint i = 0; i < offers.length; i++) {
            if(owner == offers[i].owner) {
                return i;
            }
        }
        return index;
    }
    // you can oinly have one offer.
    function _addOffer(uint _price, uint _expirationTime, uint _kwh) public returns (bool) {
        //uint index = _getIndex(msg.sender);
        //if (index == offers.length) {
        //    return false;
        // }
        offers.push(Offer({price: _price, expirationTime: _expirationTime, kwh: _kwh, owner: msg.sender, active: true}));
        return true;
    }

    function _removeOffer() public returns (bool) {
        uint _index = _getIndex(msg.sender);
        if (_index == offers.length) {
            return false;
        }
        offers[_index] = offers[offers.length - 1];
        offers.pop();
        return true;
    } 
}

contract Producer {

    event transmitPower(address indexed oldOwner, address indexed newOwner, uint kwh, uint price);
    Billboard private myBillboard;

    Offer offer;
    address private owner;
    

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(uint _price, uint _expirationTime, uint _kwh, address billboardAdress) {
        owner = msg.sender;
        offer = Offer({price: _price, expirationTime: _expirationTime, kwh: _kwh, owner: owner, active: true});
        myBillboard = Billboard(billboardAdress);
    }

    function getOffer() external view returns(Offer memory) {
       return offer;
    }

    function addToBillboard() public isOwner {
        myBillboard._addOffer(offer.price, offer.expirationTime, offer.kwh);
    }

    function buyOffer() public {
        offer.active = false;
        removeFromBillboard();
        emit transmitPower(owner, msg.sender, offer.kwh, offer.price);
    }

    function removeFromBillboard() private isOwner {
        myBillboard._removeOffer();
    }

    function setPrice( uint256 _price) private isOwner {
        offer.price = _price;
    }

    function setExpirationTime( uint256 _expirationTime) private isOwner {
        offer.expirationTime = _expirationTime;
    }

    function setKwh( uint256 _kwh) private isOwner {
        offer.kwh = _kwh;
    }

    function setActive(bool _active) private isOwner {
        offer.active = _active;
    }
}