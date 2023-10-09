import React from "react";
import { Outlet } from "react-router-dom";
import "./MainPage.css";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";

const MainPage = () => {
    return (
        <div className="main-container">
            <DrawerComponent />

            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainPage;
