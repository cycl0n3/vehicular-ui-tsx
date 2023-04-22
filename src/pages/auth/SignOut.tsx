import {useContext, useEffect} from "react";

import {useNavigate} from "react-router-dom";

import {siteRoutes} from "../../base/SiteRoutes";

import LocalUserContext from "../../context/LocalUserContext";

const SignOut = (): null => {
    const navigate = useNavigate();

    const {setUserLoggedOut} = useContext(LocalUserContext);

    useEffect(() => {
        setUserLoggedOut();
        const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";
        navigate(url);
    }, []);

    return null;
};

export default SignOut;
