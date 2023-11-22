import React from "react";
import { Button as MuiButton } from "@mui/material";

type Props = {
    text: string;
    onClick: () => any;
    disabled?: boolean;
    sx?: any;
};

const Button = ({ text, onClick, disabled, sx }: Props) => {
    let style = {
        maxHeight: "3em",
        backgroundColor: "#523ffe",
        boxShadow: "unset",
        "&:hover": {
            backgroundColor: "#2d2199",
        },
    };

    if (sx) {
        style = { ...style, ...sx };
    }

    return (
        <MuiButton
            variant="contained"
            color="primary"
            // sx={{
            //     maxHeight: "3em",
            //     backgroundColor: "#523ffe",
            //     boxShadow: "unset",
            //     "&:hover": {
            //         backgroundColor: "#2d2199",
            //     },
            // }}
            sx={style}
            onClick={() => onClick()}
            disabled={disabled}
        >
            {text}
        </MuiButton>
    );
};

export default Button;
