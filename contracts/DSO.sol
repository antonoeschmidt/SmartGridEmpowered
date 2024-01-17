// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract DSO {
    address owner;

    mapping(address => address) pubKeys;
    string groupKey;

    constructor(string memory _groupKey) {
        owner = msg.sender;
        groupKey = _groupKey;
    }

    function registerKey(address smartMeterPubKey, address smartMeterAddress) public {
        require(msg.sender == owner, "Only owner can register new keys");
        pubKeys[smartMeterPubKey] = smartMeterAddress;
    }

    function isRegisteredKey(address smartMeterPubKey, address smartMeterAddress) view public returns (bool) {
        return pubKeys[smartMeterPubKey] == smartMeterAddress;
    }

    function removeRegisteredKey(address smartMeterPubKey) public {
        require(msg.sender == owner, "Only owner can remove keys");
        delete pubKeys[smartMeterPubKey];
    }

     function getOwner() public view returns(address) {
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