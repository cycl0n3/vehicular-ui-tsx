import PrivateRoute from "./PrivateRoute";

import About from "../pages/home/About";
import Home from "../pages/home/Home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Profile from "../pages/home/Profile";
import SignOut from "../pages/auth/SignOut";
import Users from "../pages/admin/Users";

export type SiteRoute = {
    key: string;
    label: string;
    link: string;
    element: JSX.Element;
    roles: string[];
};

export const GUEST_ROLE = "GUEST";
export const USER_ROLE = "USER";
export const ADMIN_ROLE = "ADMIN";

export const siteRoutes: SiteRoute[] = [
    {
        key: "home",
        label: "Home",
        link: "/",
        element: <Home/>,
        roles: [GUEST_ROLE, USER_ROLE, ADMIN_ROLE],
    },
    {
        key: "about",
        label: "About",
        link: "/about",
        element: <About/>,
        roles: [GUEST_ROLE, USER_ROLE, ADMIN_ROLE],
    },
    {
        key: "profile",
        label: "Profile",
        link: "/profile",
        element: (
            <PrivateRoute>
                <Profile/>
            </PrivateRoute>
        ),
        roles: [USER_ROLE, ADMIN_ROLE],
    },
    {
        key: "sign-in",
        label: "Sign In",
        link: "/auth/sign-in",
        element: <SignIn/>,
        roles: [GUEST_ROLE],
    },
    {
        key: "sign-up",
        label: "Sign Up",
        link: "/auth/sign-up",
        element: <SignUp/>,
        roles: [GUEST_ROLE],
    },
    {
        key: "admin-users",
        label: "Users List",
        link: "/admin/users",
        element: (
            <PrivateRoute>
                <Users/>
            </PrivateRoute>
        ),
        roles: [ADMIN_ROLE],
    },
    {
        key: "sign-out",
        label: "Sign Out",
        link: "/auth/sign-out",
        element: (
            <PrivateRoute>
                <SignOut/>
            </PrivateRoute>
        ),
        roles: [USER_ROLE, ADMIN_ROLE],
    },
];
