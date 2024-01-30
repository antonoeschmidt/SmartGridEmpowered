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
    const storedJsonString = localStorage.getItem(account) ?? "{}";
    const parsedJson = JSON.parse(storedJsonString) ?? {};
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
    const nextSecretString = crypto.randomUUID();
    const encodedNextSecretString = web3.eth.abi.encodeParameters(['string'],[nextSecretString]);
    const nextSecretHash = web3.utils.soliditySha3(encodedNextSecretString);
        // fetch secret
    const currentSecret = getUserKey(account, "secret") ?? "";
    const encodedCurrentSecretString = web3.eth.abi.encodeParameters(['string'],[currentSecret]);

    return {currentSecretEncoded: encodedCurrentSecretString, nextSecretHash, nextSecret: nextSecretString};
}

export const addPreviousSignature = (account: string, signature: string) => {
    
}