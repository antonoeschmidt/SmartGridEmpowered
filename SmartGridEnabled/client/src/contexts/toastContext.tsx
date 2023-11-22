import React, { createContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type ToastSeverities = "success" | "error" | "warning" | "info";

export type ToastContextType = {
    toast: JSX.Element;
    onOpen: () => void;
    setToastProps: (text: string, severity: ToastSeverities) => void;
}

export const useToastContext = (): ToastContextType => {
    const [open, setOpen] = useState<boolean>(false);

    const [props, setProps] = useState<{
        text: string;
        severity: ToastSeverities;
    }>({ text: "text", severity: "success" });

    const setToastProps = (text: string, severity: ToastSeverities): void => {
        setProps({text, severity});
    }

    const handleClose = (reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const onOpen = () => setOpen(true);

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

    return { toast, onOpen, setToastProps };
};

const ToastContext = createContext<ToastContextType>(null);

export default ToastContext;