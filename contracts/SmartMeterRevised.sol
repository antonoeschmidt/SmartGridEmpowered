// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract SmartMeterRevised {
    struct SmartMeterInstance {
        bytes32 otsHash;
        uint batteryCharge;
        uint lastDataSent;
        uint totalConsumption;
        uint totalProduction;
        address marketAddress;
    }

    mapping(address => SmartMeterInstance) public smartMeters;

    uint transmissionInterval = 15 seconds;

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
        SmartMeterInstance memory smartMeterInstance = smartMeters[msg.sender];
        require(
            block.timestamp - smartMeterInstance.lastDataSent >
                transmissionInterval,
            "Logs cannot appear more frequently than the transmission interval"
        );
        smartMeterInstance.totalConsumption += intervalConsumption;
        smartMeterInstance.totalProduction += intervalProduction;

        int netDifference = int(intervalProduction) - int(intervalConsumption);

        if (netDifference > 0) {
            smartMeterInstance.batteryCharge += uint(netDifference);
        } else if (netDifference < 0) {
            if (uint(netDifference) > smartMeterInstance.batteryCharge) {
                smartMeterInstance.batteryCharge = 0;
            } else {
                smartMeterInstance.batteryCharge -= uint(netDifference);
            }
        }

        emit Log(
            msg.sender,
            PowerData({
                totalProduction: smartMeterInstance.totalProduction,
                totalConsumption: smartMeterInstance.totalConsumption,
                intervalConsumption: intervalConsumption,
                intervalProduction: intervalProduction
            }),
            block.timestamp
        );
        smartMeterInstance.lastDataSent = block.timestamp;
        smartMeters[msg.sender] = smartMeterInstance;
    }

    function getBatteryCharge(
        address smartMeterAddress
    ) public view returns (uint) {
        return smartMeters[smartMeterAddress].batteryCharge;
    }

    function checkHashAndSetHash(
        bytes memory ots,
        bytes32 nextOtsHash,
        address smartMeterAddress
    ) public returns (bool) {
        if (keccak256(ots) == smartMeters[smartMeterAddress].otsHash) {
            smartMeters[smartMeterAddress].otsHash = nextOtsHash;
            return true;
        }
        return false;
    }

    function subtractBatteryCharge(
        uint amount,
        bytes memory ots,
        bytes32 nextOtsHash,
        address smartMeterAddress
    ) public returns (bool) {
        require(
            msg.sender == smartMeters[smartMeterAddress].marketAddress,
            "Only registered market can substract energy"
        );
        require(
            checkHashAndSetHash(ots, nextOtsHash, smartMeterAddress),
            "The blinding factor was not correct"
        );
        if (smartMeters[smartMeterAddress].batteryCharge < amount) {
            return false;
        }
        smartMeters[smartMeterAddress].batteryCharge -= amount;
        return true;
    }

    function returnReservedBatteryCharge(
        uint returnedBatteryCharge,
        address smartMeterAddress
    ) public returns (bool) {
        require(
            msg.sender == smartMeters[smartMeterAddress].marketAddress,
            "Only registered market can return energy"
        );
        smartMeters[smartMeterAddress].batteryCharge += returnedBatteryCharge;
        return true;
    }

    function setMarketAddress(address _marketAddress) public {
        smartMeters[msg.sender].marketAddress = _marketAddress;
    }

    function createSmartMeter(address _marketAddress, bytes32 _otsHash) public {
        smartMeters[msg.sender] = SmartMeterInstance({
            otsHash: _otsHash,
            marketAddress: _marketAddress,
            lastDataSent: 0,
            totalConsumption: 0,
            totalProduction: 0,
            batteryCharge: 0
        });
    }
}
