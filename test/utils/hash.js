const getSecrets = (secret) => {
    const encodedSecret = web3.eth.abi.encodeParameters(
        ["string"],
        [secret]
    );
    const hash = web3.utils.soliditySha3(encodedSecret);
    return {hash, encodedSecret};
}