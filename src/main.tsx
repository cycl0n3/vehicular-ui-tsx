import React from "react";

import ReactDOM from "react-dom/client";

import {Provider} from "react-redux";

import {store} from "./redux/store";

import App from "./App";

import "./index.css";

import {UserContextProvider} from "./context/UserContext";

import {NotificationProvider} from "./context/NotificationContext";

document.title = "Vehicular UI";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <NotificationProvider>
        <Provider store={store}>
            <App/>
        </Provider>
      </NotificationProvider>
    </UserContextProvider>
  </React.StrictMode>
);
