import { useNavigate } from "react-router-dom";

import { userContext } from "../context/UserContext";

import { siteRoutes } from "./SiteRoutes";
import { useEffect } from "react";

const PrivateRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = userContext();

  useEffect(() => {
    if (!isUserLoggedIn()) {
      const url = siteRoutes.find(route => route.key === "sign-in")?.link || "/";      
      navigate(url);
    }
  })

  return children;
};

export default PrivateRoute;
