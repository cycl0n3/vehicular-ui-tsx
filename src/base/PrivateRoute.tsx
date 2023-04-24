import React, {
    ReactNode
} from "react";

import {useNavigate} from "react-router-dom";

import UserContext from "../context/UserContext";

import {siteRoutes} from "./SiteRoutes";

import {useContext, useEffect} from "react";

const PrivateRoute = ({children}: {children: ReactNode}): JSX.Element => {
    const navigate = useNavigate();

    const localUserContext = useContext(UserContext);

    useEffect(() => {
        if (!localUserContext.valid()) {
            const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";
            navigate(url);
        }
    }, []);

    return <>
        {children}
    </>;
};

export default PrivateRoute;
