import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { localUserContext } from "../../context/LocalUserContext";

const SignOut = () => {
  const navigate = useNavigate();
  const { setUserLoggedOut } = localUserContext();

  useEffect(() => {
    setUserLoggedOut();
    navigate("/");
    window.location.reload();
  }, []);

  return null;
};

export default SignOut;
