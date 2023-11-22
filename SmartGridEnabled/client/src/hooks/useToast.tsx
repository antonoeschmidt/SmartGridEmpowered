import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type ToastSeverities = "success" | "error" | "warning";

interface useToastReturn {
    toast: JSX.Element;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setProps: React.Dispatch<
        React.SetStateAction<{
            text: string;
            severity: ToastSeverities;
        }>
    >;
}

export const useToast = (): useToastReturn => {
    const [open, setOpen] = useState<boolean>(false);

    const [props, setProps] = useState<{
        text: string;
        severity: ToastSeverities;
    }>({ text: "text", severity: "success" });

    const handleClose = (reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const toast = (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={(_, r) => handleClose(r)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert severity={props.severity}>{props.text}</Alert>
        </Snackbar>
    );

    return { toast, setOpen, setProps };
};
