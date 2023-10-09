import React from "react";
import "./HomePage.css";
import PickAccountsComponent from "../../components/PickAccountsComponent/PickAccountsComponent";

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Hej</h1>
            <div className="row">
                <PickAccountsComponent />
            </div>
        </div>
    );
};

export default HomePage;
