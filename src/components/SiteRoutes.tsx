import PrivateRoute from './PrivateRoute'

import About from '../pages/home/About'
import Home from '../pages/home/Home'
import SignIn from '../pages/auth/SignIn'
import SignUp from '../pages/auth/SignUp'
import Profile from '../pages/home/Profile'
import SignOut from '../pages/auth/SignOut'

export const siteRoutes = [
  {
    key: "home",
    label: "Home",
    link: "/",
    element: <Home />,
    public: true,
  },
  {
    key: "about",
    label: "About",
    link: "/about",
    element: <About />,
    public: true,
  },
  {
    key: "profile",
    label: "Profile",
    link: "/profile",
    element: (<PrivateRoute> 
      <Profile />
    </PrivateRoute>),
    private: true,
  },
  {
    key: "sign-in",
    label: "Sign In",
    link: "/auth/sign-in",
    element: <SignIn />,
    protected: true,
  },
  {
    key: "sign-up",
    label: "Sign Up",
    link: "/auth/sign-up",
    element: <SignUp />,
    protected: true,
  },
  {
    key: "sign-out",
    label: "Sign Out",
    link: "/auth/sign-out",
    element: <PrivateRoute>
      <SignOut />
    </PrivateRoute>,
    private: true,
  }
]
