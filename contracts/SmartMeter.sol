// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract SmartMeter {
    struct SmartMeterInstance {
        bytes32 otsHash;
        uint batteryCharge;
        uint lastDataSent;
        address marketAddress;
    }

    mapping(address => SmartMeterInstance) public smartMeters;

    uint transmissionInterval = 15 seconds;

    event Log(uint256 c, uint256 p);

    function createLog(
        uint256 c,
        uint256 p
    ) public {
        require(
            block.timestamp - smartMeters[msg.sender].lastDataSent >
                transmissionInterval,
            "Logs cannot appear more frequently than the transmission interval"
        );

        int netDifference = int(p) - int(c);

        if (netDifference > 0) {
            smartMeters[msg.sender].batteryCharge += uint(netDifference);
        } else {
            if (c - p > smartMeters[msg.sender].batteryCharge) {
                smartMeters[msg.sender].batteryCharge = 0;
            } else {
                smartMeters[msg.sender].batteryCharge -= uint(netDifference);
            }
        }

        emit Log(c, p);

        smartMeters[msg.sender].lastDataSent = block.timestamp;
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
            batteryCharge: 0
        });
    }
}
