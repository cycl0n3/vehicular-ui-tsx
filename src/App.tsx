import React from "react";

import {
  Route,
  Router,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import "./App.css";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Base from "./pages/_Base";

import { siteRoutes } from "./pages/_misc/SiteRoutes";

const queryClient = new QueryClient();

const App = (): JSX.Element => {

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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </div>
  );
};

export default App;
