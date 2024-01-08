// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract SmartMeter {
    bytes32 otsHash;
    address owner;
    address currentMarketAddress;
    uint private totalConsumption;
    uint private totalProduction;
    uint batteryCharge;
    uint lastDataSent;
    uint transmissionInterval = 15 seconds;

    constructor(bytes32 _otsHash) {
        owner = msg.sender;
        otsHash = _otsHash;
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

    function createLog(
        uint256 intervalConsumption,
        uint256 intervalProduction
    ) public {
        require(msg.sender == owner, "Only owner can create logs");
        require(
            block.timestamp - lastDataSent > transmissionInterval,
            "Logs cannot appear more frequently than the transmission interval"
        );
        totalConsumption += intervalConsumption;
        totalProduction += intervalProduction;

        if ((int(intervalProduction) - int(intervalConsumption)) > 0) {
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

    function getBatteryCharge() public view returns (uint) {
        return batteryCharge;
    }

    function checkHashAndSetHash(
        bytes memory ots,
        bytes32 nextOtsHash
    ) public returns (bool) {
        if (keccak256(ots) == otsHash) {
            otsHash = nextOtsHash;
            return true;
        }
        return false;
    }

    function subtractBatteryCharge(
        uint amount,
        bytes memory ots,
        bytes32 nextOtsHash
    ) public returns (bool) {
        require(
            msg.sender == currentMarketAddress,
            "Only registered market can substract energy"
        );
        require(
            checkHashAndSetHash(ots, nextOtsHash),
            "The blinding factor was not correct"
        );
        if (batteryCharge < amount) {
            return false;
        }
        batteryCharge -= amount;
        return true;
    }

    function setCurrentMarketAddress(
        address marketAddress
    ) public returns (bool) {
        require(msg.sender == owner, "Only owner can change market address");
        currentMarketAddress = marketAddress;
        return true;
    }

    function returnReservedBatteryCharge(
        uint returnedBatteryCharge
    ) public returns (bool) {
        require(
            msg.sender == currentMarketAddress,
            "Only registered market can return energy"
        );
        batteryCharge += returnedBatteryCharge;
        return true;
    }
}
