import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const OnboardingDialogComponent = () => {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Welcome to Smart Grid Empowered"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This seems like this is your first run. We need to set a
                    couple of things up. First off, we need to define an admin
                    account, in order to configure the system.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Let's get started!
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OnboardingDialogComponent;
