import React from "react";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";


import "./App.css";

import Base from "./pages/_Base";

import { siteRoutes } from "./components/SiteRoutes";

const App: React.FC = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Base />}>
        <Route index element={siteRoutes[0].element} />
  
        {siteRoutes.slice(1).map(route => {
          return <Route key={route.key} path={route.link} element={route.element} />
        })}
  
        <Route path="*" element={<div>404</div>} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
