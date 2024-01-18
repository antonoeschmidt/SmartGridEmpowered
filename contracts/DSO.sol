// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract DSO {
    address owner;

    mapping(address => address) pubKeys;
    string groupKey;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Only owner can change key map");
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

    function getGroupkey() public view returns(string memory) {
        return groupKey;
    }

    function setGroupKey(string memory _groupKey) public {
        require(msg.sender == owner, "Only owner can set the group key");
        groupKey = _groupKey;
    }
}
