import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import MarketplacePage from "./pages/MarketplacePage/MarketplacePage";
import SmartMeterPage from "./pages/SmartMeterPage/SmartMeterPage";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import ToastContext from "./contexts/toastContext";

const RoutesApp = () => {

    const { toast } = useContext(ToastContext);


    return (
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
            {toast}
        </BrowserRouter>
    );
};

export default RoutesApp;
