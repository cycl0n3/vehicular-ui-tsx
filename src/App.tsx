import React from "react";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";


import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Base from "./pages/_Base";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Base />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="auth/sign-in" element={<SignIn />} />
      <Route path="auth/sign-up" element={<SignUp />} />
      <Route path="*" element={<div>404</div>} />
    </Route>
  )
);

const App: React.FC = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
