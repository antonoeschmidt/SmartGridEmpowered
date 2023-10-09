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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

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
            {/* <img style={{width: "240px"}} src="/sge_logo.png" alt="/logo192.png" /> */}
            <Divider />
            <List>
                <ListItem key={"home"} disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"requests"} disablePadding>
                    <ListItemButton onClick={() => navigate("/requests")}>
                        <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                        <ListItemText primary={"Requests"} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={"logout"} disablePadding id="sign-out-button">
                    <ListItemButton>
                        <ListItemIcon>{<LogoutIcon />}</ListItemIcon>
                        <ListItemText primary={"Sign out"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default DrawerComponent;
