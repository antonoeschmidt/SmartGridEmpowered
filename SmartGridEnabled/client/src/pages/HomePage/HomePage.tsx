import React from "react";
import "./HomePage.css";
import PickAccountsComponent from "../../components/PickAccountsComponent/PickAccountsComponent";

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Dashboard</h1>
            <div className="row">
                <PickAccountsComponent />
                <div className="home-item-component"><p>Current usage</p></div>
            </div>
        </div>
    );
};

export default HomePage;
