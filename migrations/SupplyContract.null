// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

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