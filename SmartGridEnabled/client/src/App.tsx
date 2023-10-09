import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { getAccounts, getWeb3 } from "./utils/web3";
import MainPage from "./pages/MainPage/MainPage";
import HomePage from "./pages/HomePage/HomePage";

const App = () => {
    useEffect(() => {
        let web3 = getWeb3();
        getAccounts(web3).then((accounts) => {
            console.log(accounts);
        });
    }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}>
                    <Route path="/" element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
