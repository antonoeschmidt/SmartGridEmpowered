// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// pragma experimental ABIEncoderV2; // only for testing

contract SupplyContract {
    address private buyer;
    address private seller;
    uint private amount; // Wh
    uint private price; // Euro cents
    uint timestamp; // Unix

    constructor(address _buyer, address _seller, uint _amount, uint _price) payable {
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

    function getAmount() public view returns (uint) {
        require((msg.sender == buyer) || (msg.sender == seller));
        return amount;
    }

    function getPrice() public view returns (uint) {
        require((msg.sender == buyer) || (msg.sender == seller));
        return price;
    }
}
