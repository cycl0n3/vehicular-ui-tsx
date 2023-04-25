import {useContext, useEffect} from "react";

import {useNavigate} from "react-router-dom";

import {siteRoutes} from "../_misc/SiteRoutes";

import UserContext from "../../context/UserContext";

import * as USER from "../../redux/user";

import {useAppDispatch} from "../../redux/store";

const SignOut = (): null => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const {logout} = useContext(UserContext);

    useEffect(() => {
        logout(); dispatch(USER.logout());

        const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";
        navigate(url);
    }, []);

    return null;
};

export default SignOut;
