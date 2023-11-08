import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';

const DrawerComponent = () => {
    const navigate = useNavigate();

    return (
        <Drawer
            className="drawer-component"
            sx={{
                minWidth: "240px",
                "& .MuiDrawer-paper": {
                    minWidth: "240px",
                    backgroundColor: "#EDEDE9",
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <div style={{display: "flex", textAlign: "center"}}>
            <h3 style={{width: "240px"}} >Smart Grid Empowered</h3>
            </div>
            <Divider />
            <List>
                <ListItem key={"home"} disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"marketplace"} disablePadding>
                    <ListItemButton onClick={() => navigate("/marketplace")}>
                        <ListItemIcon>{<StoreIcon />}</ListItemIcon>
                        <ListItemText primary={"Marketplace"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"smartmeter"} disablePadding>
                    <ListItemButton onClick={() => navigate("/smartmeter")}>
                        <ListItemIcon>{<ElectricMeterIcon />}</ListItemIcon>
                        <ListItemText primary={"Smart Meter"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default DrawerComponent;
