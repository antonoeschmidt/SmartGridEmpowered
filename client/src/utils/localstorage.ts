import { getWeb3 } from "../apis/web3";

export const loadFromLocalStorage: any = (account: string) => {
    const storedJsonString = localStorage.getItem(account);
    // by setting the smart meter to empty we initialize making a new one, but the other use effect only triggers if currentMarket is set.
    if (!storedJsonString) {
        return {};
    }
    const parsedJson = JSON.parse(storedJsonString);
    const smartMeterAddress = parsedJson.smartMeterAddress
        ? parsedJson.smartMeterAddress
        : "";
    const signature = parsedJson.signature ? parsedJson.signature : "";
    const secret = parsedJson.secret ?? "";
    return {
        smartMeterAddress,
        signature,
        secret
    };
};

export const addUserKey: any = (account, keyName: string, keyValue: any) => {
    const storedJsonString = localStorage.getItem(account);
    const parsedJson = JSON.parse(storedJsonString);
    localStorage.setItem(account, JSON.stringify({...parsedJson, [keyName]: keyValue}))
}

export const getUserKey = (account: string, keyName: string) => {
    const storedJsonString = localStorage.getItem(account);
    if (!storedJsonString) return "";
    const parsedJson = JSON.parse(storedJsonString);
    return parsedJson[keyName] ?? "";
}

export const getSmartMeterSecrets = (account: string) => {
    const web3 = getWeb3();
    const array = new Uint32Array(10);
    crypto.getRandomValues(array);
    const encodedSecretString = web3.eth.abi.encodeParameters(['string'],["array.toString()"])
    const nextSecretHash = web3.utils.soliditySha3(encodedSecretString);
        // fetch secret
    const currentSecret = getUserKey(account, "secret");
        // add the next key to local storage
    addUserKey("account", "secret", encodedSecretString);
    return {currentSecret, nextSecretHash};
}