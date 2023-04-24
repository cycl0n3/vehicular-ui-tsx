import React, {
    ReactNode
} from "react";

import {useNavigate} from "react-router-dom";

import LocalUserContext from "../context/LocalUserContext";

import {siteRoutes} from "./SiteRoutes";

import {useContext, useEffect} from "react";

const PrivateRoute = ({children}: {children: ReactNode}): JSX.Element => {
    const navigate = useNavigate();

    const localUserContext = useContext(LocalUserContext);

    useEffect(() => {
        if (!localUserContext.isUserLoggedIn()) {
            const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";
            navigate(url);
        }
    }, []);

    return <>
        {children}
    </>;
};

export default PrivateRoute;
