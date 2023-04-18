import About from '../pages/About'
import Home from '../pages/Home'
import SignIn from '../pages/auth/SignIn'
import SignUp from '../pages/auth/SignUp'

export const siteRoutes = [
  {
    key: "home",
    label: "Home",
    link: "/",
    element: <Home />,
  },
  {
    key: "about",
    label: "About",
    link: "about",
    element: <About />,
  },
  {
    key: "sign-in",
    label: "Sign In",
    link: "auth/sign-in",
    element: <SignIn />,
  },
  {
    key: "sign-up",
    label: "Sign Up",
    link: "auth/sign-up",
    element: <SignUp />,
  }
]
