import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerComponent from "../../components/Shared/DrawerComponent/DrawerComponent";
// import { AccountCircle } from "@mui/icons-material";
// import { ElectricBolt } from "@mui/icons-material";
// import RoleContext from "../../contexts/roleContext";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

type Props = {
    children?: React.ReactElement;
};

export default function PersistentDrawerLeft({ children }: Props) {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // const { currentRole, setCurrentRole} = React.useContext(RoleContext)

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                open={open}
                elevation={0}
                sx={{ backgroundColor: "#523ffe" }}
            >
                <Toolbar>
                <Box sx={{ display: 'flex' }}>                    
                <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: "none" }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Smart Grid Empowered.
                    </Typography>
                    </Box>
                    <Box marginLeft={"auto"} sx={{display: 'flex'}}>
                    {/* <IconButton
                        color="inherit"
                        aria-label="Select user"
                        edge="start"
                        onClick={_ => setCurrentRole(Roles.user)}
                        sx={{...currentRole === Roles.user && {border: "solid"}}}
                    >
                        <AccountCircle />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="Select admin"
                        onClick={_ => setCurrentRole(Roles.dso)}
                        sx={{...currentRole === Roles.dso && {border: "solid"}}}
                    >
                        <ElectricBolt /> */}
                    {/* </IconButton> */}
                    </Box>
                </Toolbar>
            </AppBar>
            <DrawerComponent
                drawerWidth={drawerWidth}
                open={open}
                handleDrawerClose={handleDrawerClose}
                DrawerHeader={DrawerHeader}
            />
            <Main
                open={open}
                style={{ backgroundColor: "#e6edf9", padding: "0" }}
                onClick={() => setOpen(false)}
            >
                <DrawerHeader />
                {children}
            </Main>
        </Box>
    );
}
