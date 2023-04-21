import {useContext, useEffect} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";

import LocalUserContext from "../../context/LocalUserContext";

const SignOut = (): null => {
    const navigate: NavigateFunction = useNavigate();

    const {setUserLoggedOut} = useContext(LocalUserContext);

    useEffect(() => {
        setUserLoggedOut();
        navigate("/");
        window.location.reload();
    }, []);

    return null;
};

export default SignOut;
