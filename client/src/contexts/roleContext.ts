import { Dispatch, SetStateAction, createContext, useState } from "react";

export type RoleContextType = {
    currentRole: Roles;
    setCurrentRole: Dispatch<SetStateAction<Roles>>;
};

export enum Roles {
    user = "user",
    dso = "dso",
}


export const useRoleContext = (): RoleContextType => {
    const [currentRole, setCurrentRole] = useState<Roles>(Roles.user);

    return {
        currentRole,
        setCurrentRole
    };
};

const RoleContext = createContext<RoleContextType>(null);

export default RoleContext;
