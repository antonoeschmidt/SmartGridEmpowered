import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import HomePage from "./pages/DashboardPage/DashboardPage";
import EthereumContext, {
    useEthereumContext,
} from "./contexts/ethereumContext";
import MarketplacePage from "./pages/MarketplacePage/MarketplacePage";

const App = () => {
    const ethereumContextValue = useEthereumContext();

    return (
        <EthereumContext.Provider value={ethereumContextValue}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </EthereumContext.Provider>
    );
};

export default App;
