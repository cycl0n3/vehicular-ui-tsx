import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { localUserContext } from "../../context/LocalUserContext";

const SignOut = (): null => {
  const navigate: NavigateFunction = useNavigate();
  const { setUserLoggedOut } = localUserContext();

  useEffect(() => {
    setUserLoggedOut();
    navigate("/");
    window.location.reload();
  }, []);

  return null;
};

export default SignOut;
