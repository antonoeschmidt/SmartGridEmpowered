// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract DSO {
    address owner;

    mapping(address => address) registeredAddresses;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Only owner can change key map");
        _;
    }

    function registerKey(
        address prosumerAddress,
        address smartMeterAddress
    ) public isOwner {
        registeredAddresses[prosumerAddress] = smartMeterAddress;
    }

    function isRegisteredKey(
        address prosumerAddress,
        address smartMeterAddress
    ) public view returns (bool) {
        return registeredAddresses[prosumerAddress] == smartMeterAddress;
    }

    function removeRegisteredKey(address prosumerAddress) public isOwner {
        delete registeredAddresses[prosumerAddress];
    }
}
