import React from "react";
import { Button as MuiButton } from "@mui/material";

type Props = {
    text: string;
    onClick: () => any;
    disabled?: boolean;
    sx?: any;
    type?: string;
};

const Button = ({ text, onClick, disabled, sx, type }: Props) => {
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
            sx={style}
            onClick={() => onClick()}
            disabled={disabled}
        >
            {text}
        </MuiButton>
    );
};

export default Button;
