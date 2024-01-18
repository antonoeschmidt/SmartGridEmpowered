// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract CableCompany {
    address owner;
    // in case people don't trust our api and wan't to verify themselves.
    mapping(address => address) pubKeys;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Only owner can register new keys");
        _;
    }

    function registerKey(
        address smartMeterPubKey,
        address smartMeterAddress
    ) public isOwner {
        pubKeys[smartMeterPubKey] = smartMeterAddress;
    }

    function isRegisteredKey(
        address smartMeterPubKey,
        address smartMeterAddress
    ) public view returns (bool) {
        return pubKeys[smartMeterPubKey] == smartMeterAddress;
    }

    function removeRegisteredKey(address smartMeterPubKey) public isOwner {
        delete pubKeys[smartMeterPubKey];
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
