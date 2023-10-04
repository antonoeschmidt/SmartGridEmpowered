import { ethers } from "hardhat";

async function deployLock() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    const lockedAmount = ethers.parseEther("0.001");

    const lock = await ethers.deployContract("Lock", [unlockTime], {
        value: lockedAmount,
    });

    await lock.waitForDeployment();

    console.log(
        `Lock with ${ethers.formatEther(
            lockedAmount
        )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
    );
}

async function deploySupplyContract() {
    /**
     * Arguments needed
     * @param buyer: address
     * @param seller: address
     * @param amount: uint (Wh)
     * @param price: uint (Euro Cents)
     *
     **/

    const lockedAmount = ethers.parseEther("0.001");

    const sc = await ethers.deployContract(
        "SupplyContract",
        [
            "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",
            "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7",
            1000,
            1,
        ],
        {
            value: lockedAmount,
        }
    );

    await sc.waitForDeployment();

    console.log(
        `SupplyContract with ${ethers.formatEther(lockedAmount)}ETH deployed to ${sc.target}`
    );
}

async function deployMarket() {
    /**
     * Arguments needed
     * @param none
     **/

    const lockedAmount = ethers.parseEther("0.001");

    const sc = await ethers.deployContract("Market", {
        value: lockedAmount,
    });

    await sc.waitForDeployment();

    console.log(
        `Market with ${ethers.formatEther(lockedAmount)}ETH deployed to ${sc.target}`
    );
}


// DEPLOYS
deploySupplyContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

deployMarket().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
