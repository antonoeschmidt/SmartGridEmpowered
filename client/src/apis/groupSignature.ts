const url = process.env.REACT_APP_GROUPSIGNATURE_URL;

export const addMember = async (name: string) => {
    const response: any = fetch(`${url}/add-member/${name}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // or the appropriate content type
            // Add any other headers if needed
        },
        body: "{}",
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
    if (response?.key && response?.message)
        return { key: response.key, message: response.message };
    return response;
};

export const sign = async (message: string, key: string): Promise<string> => {
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

export const verify = async (signature: string, message: string) => {
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

export const openSignature = async (signature: string) => {
    try {
        const response = await fetch(`${url}/open`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify({ signature: signature }),
        });
        const json = await response.json();

        return json.owner;
    } catch (error) {
        console.error("Error:", error);
    }

    const response: any = fetch(`${url}/open`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // or the appropriate content type
            // Add any other headers if needed
        },
        body: JSON.stringify({ signature: signature }),
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
    if (response?.owner) return response.owner;
    return response;
};
// x-api-key
