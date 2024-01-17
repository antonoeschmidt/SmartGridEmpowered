const getPastEvents = async(address, abi, eventName) => {
    const contract = new web3.eth.Contract(abi, address);
    
    return await contract.getPastEvents(eventName, {
        fromBlock: 0,
        toBlock: 'latest'
        //@ts-ignore
    }, function(error, events){return events})
    .then(events => events);
};

module.exports = {
    getPastEvents
}