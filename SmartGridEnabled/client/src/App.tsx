import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import EthereumContext, {
    useEthereumContext,
} from "./contexts/ethereumContext";
import MarketplacePage from "./pages/MarketplacePage/MarketplacePage";
import SmartMeterPage from "./pages/SmartMeterPage/SmartMeterPage";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";

const App = () => {
    const ethereumContextValue = useEthereumContext();

    return (
        <EthereumContext.Provider value={ethereumContextValue}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />}>
                        <Route path="/" element={<MarketplacePage />} />
                        <Route path="/settings" element={<DashboardPage />} />
                        <Route
                            path="/smartmeter"
                            element={<SmartMeterPage />}
                        />
                    </Route>
                    <Route path="onboarding" element={<OnboardingPage />} />
                </Routes>
            </BrowserRouter>
        </EthereumContext.Provider>
    );
};

export default App;
