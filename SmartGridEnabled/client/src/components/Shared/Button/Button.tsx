import React from "react";
import { Button as MuiButton } from "@mui/material";

type Props = {
    text: string;
    onClick: () => any;
    disabled?: boolean;
};

const Button = ({ text, onClick, disabled }: Props) => {
    return (
        <MuiButton
            variant="contained"
            color="primary"
            sx={{
                maxHeight: "3em",
                backgroundColor: "#523ffe",
                boxShadow: "unset",
                "&:hover": {
                    backgroundColor: "#2d2199",
                },
            }}
            onClick={() => onClick()}
            disabled={disabled}
        >
            {text}
        </MuiButton>
    );
};

export default Button;
