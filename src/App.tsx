import React, { useState } from "react";

import {
  Link as RouteLink,
  Outlet,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <RouteLink to="/">Home</RouteLink>
          </li>
          <li>
            <RouteLink to="/about">About</RouteLink>
          </li>
          <li>
            <RouteLink to="/auth/sign-in">Sign In</RouteLink>
          </li>
          <li>
            <RouteLink to="/auth/sign-up">Sign Up</RouteLink>
          </li>
          <li>
            <RouteLink to="/other">404</RouteLink>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="auth/sign-in" element={<SignIn />} />
            <Route path="auth/sign-up" element={<SignUp />} />
            <Route path="*" element={<div>404</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
