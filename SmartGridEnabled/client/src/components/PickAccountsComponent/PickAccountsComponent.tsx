import React from "react";
import "./PickAccountsComponent.css";
import { MenuItem, Select } from "@mui/material";

const PickAccountsComponent = () => {
    return (
        <div className="pick-accounts-component">
            <h3>Choose Account</h3>
            <Select
                id="demo-simple-select"
                value={10}
                label="Age"
                onChange={() => {}}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </div>
    );
};

export default PickAccountsComponent;
