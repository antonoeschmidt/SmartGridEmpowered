import { AddCircle } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { FC } from "react";

export type AddButtonProps = {
    onClick: (e) => void;
}

export const AddButton: FC<AddButtonProps> = ({onClick}) => {
    
    return (<IconButton sx={{width: "100%", height: "100%"}} aria-label="Add a new offer" color="primary" onClick={onClick}>
        <AddCircle sx={{width: "100%", height: "100%"}} color="primary"/>
    </IconButton>)
}