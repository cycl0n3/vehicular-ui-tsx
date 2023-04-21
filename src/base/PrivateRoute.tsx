import {useNavigate} from "react-router-dom";

import LocalUserContext from "../context/LocalUserContext";

import {siteRoutes} from "./SiteRoutes";

import {useContext, useEffect} from "react";

const PrivateRoute = ({children}: any): any => {
    const navigate = useNavigate();

    const localUserContext = useContext(LocalUserContext);

    useEffect(() => {
        if (!localUserContext.isUserLoggedIn()) {
            const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";
            navigate(url);
            window.location.reload();
        }
    }, []);

    return children;
};

export default PrivateRoute;
