
// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

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
        return pubKeys[smartMeterPubKey] == smartMeterAddress;
    }

    function removeRegisteredKey(address smartMeterPubKey) public {
        require(msg.sender == owner, "Only owner can remove keys");
        delete pubKeys[smartMeterPubKey];
    }
}
