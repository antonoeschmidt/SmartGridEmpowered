import React, { useEffect } from "react";
import "./App.css";
import { getAccounts, getWeb3 } from "./utils/web3";

const App = () => {
    useEffect(() => {
        let web3 = getWeb3();
        getAccounts(web3).then((accounts) => {
            console.log(accounts);
        });
    }, []);
    return (
    
    <div className="App">He</div>
    );
};

export default App;
