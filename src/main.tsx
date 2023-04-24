import React from "react";

import ReactDOM from "react-dom/client";

import {Provider} from "react-redux";

import {store} from "./redux/store";

import App from "./App";

import "./index.css";

import {LocalUserContextProvider} from "./context/LocalUserContext";

import {NotificationProvider} from "./context/NotificationContext";

document.title = "Vehicular UI";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalUserContextProvider>
      <NotificationProvider>
        <Provider store={store}>
            <App/>
        </Provider>
      </NotificationProvider>
    </LocalUserContextProvider>
  </React.StrictMode>
);
