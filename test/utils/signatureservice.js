const url = "http://127.0.0.1:5000";
const apikey = "SuperSecretKey";

const addMember = async (name) => {
    const response = fetch(`${url}/add-member/${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json", // or the appropriate content type
            "x-api-key": apikey
            // Add any other headers if needed
        }
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
    if (response?.key && response?.message)
        return { key: response.key, message: response.message };
    return response;
};

const sign = async (message, key) => {
    try {
        const response = await fetch(`${url}/sign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message, key: key }),
        });
        const json = await response.json();

        if (json.signature) {
            return json.signature;
        } else {
            throw new Error("No signature");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const verify = async (signature, message) => {
    try {
        const response = await fetch(`${url}/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message, signature: signature }),
        });
        const json = await response.json();

        return json.valid;
    } catch (error) {
        console.error("Error:", error);
    }
};

module.exports = {
    addMember, verify, sign
}