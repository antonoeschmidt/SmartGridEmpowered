// SPDX-License-Identifier: GPL-3.0
// pragma experimental ABIEncoderV2;
pragma solidity ^0.8.9;

contract SmartMeter {
    address owner;
    uint256 private totalConsumption;
    uint256 private totalProduction;
    uint256 lastDataSent;
    uint256 transmissionInterval = 15 minutes;

    constructor() payable {
        owner = msg.sender;
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
        require(msg.sender == owner);
        require(
            block.timestamp - lastDataSent > transmissionInterval,
            "Logs cannot appear more frequently than the transmission interval"
        );
        totalConsumption += intervalConsumption;
        totalProduction += intervalProduction;
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
}
