import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EthereumContext from "../../../contexts/ethereumContext";

type Props = {
    drawerWidth: number;
    open: boolean;
    handleDrawerClose: () => void;
    DrawerHeader: any;
};

const DrawerComponent = ({
    drawerWidth,
    open,
    handleDrawerClose,
    DrawerHeader,
}: Props) => {
    const navigate = useNavigate();

    const { setLoading } = useContext(EthereumContext);

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem key={"marketplace"} disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setLoading(true);
                            navigate("/");
                        }}
                    >
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
                <ListItem key={"home"} disablePadding>
                    <ListItemButton onClick={() => navigate("/settings")}>
                        <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
                        <ListItemText primary={"Settings"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default DrawerComponent;
