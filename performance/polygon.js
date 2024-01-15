const SimpleStorage = require("../build/polygon-contracts/SimpleStorage.json");
const { performance } = require("perf_hooks");
let Web3 = require("web3");
require("dotenv").config();

const PROVIDER = "polygon";

const setupTest = async (providerChoice) => {
    let provider;
    let accountAddress;
    let contractAddress;
    let privateKey;
    let web3;
    if (providerChoice === "polygon") {
        provider = new Web3.providers.HttpProvider(process.env.POLYGON_URL);
        web3 = new Web3(provider);
        const account = web3.eth.accounts.privateKeyToAccount(
            process.env.PRIVATE_KEY
        );
        accountAddress = account.address;
        contractAddress = process.env.POLYGON_CONTRACT_ADDRESS;
        privateKey = process.env.PRIVATE_KEY;
    } else if (providerChoice === "ganache") {
        provider = new Web3.providers.HttpProvider(process.env.ETHEREUM_URL);
        web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        accountAddress = accounts[0];
        contractAddress = process.env.ETHEREUM_CONTRACT_ADDRESS;
        privateKey = process.env.ETHEREUM_PRIVATE_KEY;
    } else if (providerChoice === "ethereum") {
        console.log("Using Sepolia");
        provider = new Web3.providers.HttpProvider(process.env.SEPOLIA_URL);
        web3 = new Web3(provider);
        const account = web3.eth.accounts.privateKeyToAccount(
            process.env.PRIVATE_KEY
        );
        accountAddress = account.address;
        contractAddress = process.env.POLYGON_CONTRACT_ADDRESS;
        privateKey = process.env.PRIVATE_KEY;
    }
    return { web3, accountAddress, contractAddress, privateKey };
};

const runTests = async () => {
    const { web3, accountAddress, contractAddress, privateKey } =
        await setupTest(PROVIDER);
    let tpsList = [];
    // let noOfTxs = [5, 10, 15, 20, 30];
    let noOfTxs = [30];

    for (let i = 0; i < noOfTxs.length; i++) {
        tpsList.push({
            txs: noOfTxs[i],
            tps: await test(
                accountAddress,
                contractAddress,
                privateKey,
                web3,
                noOfTxs[i]
            ),
        });
    }
    console.log(tpsList);
};

runTests().then(() => {
    console.log("done");
});

const test = async (
    accountAddress,
    contractAddress,
    privateKey,
    web3,
    noOfTxs
) => {
    console.log("Starting test...");
    const simpleStorageContract = new web3.eth.Contract(
        SimpleStorage.abi,
        contractAddress
    );

    let nonce = await web3.eth.getTransactionCount(accountAddress, "pending");
    console.log("Current nonce: " + nonce);

    let block = await web3.eth.getBlock("latest");
    let gasLimit = Math.round(block.gasLimit / block.transactions.length);

    const batch = new web3.BatchRequest();

    let counter = 0;

    nonce = Math.round(Math.random() * 100000);
    console.log("Starting nonce: " + nonce);

    await new Promise(async (resolve, reject) => {
        for (let i = 0; i < noOfTxs; i++) {
            const encoded = simpleStorageContract.methods
                .set(i + 1)
                .encodeABI();
            var tx = {
                gas: gasLimit,
                to: contractAddress,
                data: encoded,
                from: accountAddress,
                nonce: nonce + i,
                // chainId: "80001",
            };
            let signedTransaction = await web3.eth.accounts.signTransaction(
                tx,
                privateKey
            );

            batch.add(
                web3.eth.sendSignedTransaction.request(
                    signedTransaction.rawTransaction,
                    (error, data) => {
                        if (error) {
                            console.log(error);
                            return reject(error);
                        }
                        counter++;
                        console.log(data);

                        if (counter === noOfTxs) {
                            console.log("All transactions sent");
                            resolve();
                        }
                    }
                )
            );
        }

        t0 = performance.now();
        await batch.execute();
    });

    t1 = performance.now();

    console.log("Latency: " + (t1 - t0));

    // Calculate TPS
    let tps = (noOfTxs / (t1 - t0)) * 1000;
    console.log("TPS: " + tps);

    return tps;
};

const testDeployment = async () => {
    const accounts = await web3.eth.getAccounts();
    const simpleStorageContract = new web3.eth.Contract(SimpleStorage.abi);
    const deployment = await simpleStorageContract.deploy({
        data: SimpleStorage.bytecode,
    });

    const deploymentTransaction = await deployment.send({
        from: accounts[0],
        gas: "1500000",
        gasPrice: "30000000000",
    });
    console.log(deploymentTransaction.options.address);
    const contractAddress = deploymentTransaction.options.address;

    simpleStorageContract.options.address = contractAddress;

    t0 = performance.now();
    console.log("Starting test...");
    for (let i = 0; i < NUMBER_OF_TX; i++) {
        let tx = await simpleStorageContract.methods.set(1).send({
            from: accounts[0],
            gas: "1500000",
            gasPrice: "30000000000",
        });
    }

    t1 = performance.now();

    console.log("Latency: " + (t1 - t0));

    // Calculate TPS
    let tps = (NUMBER_OF_TX / (t1 - t0)) * 1000;
    console.log("TPS: " + tps);
};
