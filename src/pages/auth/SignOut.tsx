import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { userContext } from "../../context/UserContext";

const SignOut = () => {
  const navigate = useNavigate();
  const { setUserLoggedOut } = userContext();

  useEffect(() => {
    setUserLoggedOut();
    navigate("/");
    window.location.reload();
  }, []);

  return null;
};

export default SignOut;
