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
        address prosumerAddress,
        address smartMeterAddress
    ) public isOwner {
        pubKeys[prosumerAddress] = smartMeterAddress;
    }

    function isRegisteredKey(
        address prosumerAddress,
        address smartMeterAddress
    ) public view returns (bool) {
        return pubKeys[prosumerAddress] == smartMeterAddress;
    }

    function removeRegisteredKey(address prosumerAddress) public isOwner {
        delete pubKeys[prosumerAddress];
    }

    function getGroupkey() public view returns (string memory) {
        return groupKey;
    }

    function setGroupKey(string memory _groupKey) public {
        require(msg.sender == owner, "Only owner can set the group key");
        groupKey = _groupKey;
    }
}
