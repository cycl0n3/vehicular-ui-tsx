import {useContext, useEffect} from "react";

import {useNavigate} from "react-router-dom";

import {siteRoutes} from "../../base/SiteRoutes";

import UserContext from "../../context/UserContext";

const SignOut = (): null => {
    const navigate = useNavigate();

    const {logout} = useContext(UserContext);

    useEffect(() => {
        logout();
        const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";
        navigate(url);
    }, []);

    return null;
};

export default SignOut;
