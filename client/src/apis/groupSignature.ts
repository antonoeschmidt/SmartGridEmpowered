
const url = process.env.REACT_APP_GROUPSIGNATURE_URL;

export const addMember = async(name: string) => {
    const response: any = fetch(`${url}/add-member/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // or the appropriate content type
          // Add any other headers if needed
        },
        body: "{}"
      })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    if (response?.key && response?.message) return {"key": response.key, "message": response.message};
    return response;
}

export const sign = async(message: string, key: string) => {
    const response: any = fetch(`${url}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // or the appropriate content type
          // Add any other headers if needed
        },
        body: JSON.stringify({"message": message, "key": key})
      })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    if (response?.signature) return response.signature;
    return response;
}

export const verify = async(signature: string, message: string) => {
    const response: any = fetch(`${url}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // or the appropriate content type
          // Add any other headers if needed
        },
        body: JSON.stringify({"message": message, "signature": signature})
      })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
    if (response?.valid) return response.valid;
    return response;
}

export const open = async(signature: string) => {
    const response: any = fetch(`${url}/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // or the appropriate content type
          // Add any other headers if needed
        },
        body: JSON.stringify({"signature": signature})
      })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    if (response?.owner) return response.owner;
    return response;
}
