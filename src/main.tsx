import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import {LocalUserContextProvider} from "./context/LocalUserContext";
import {NotificationProvider} from "./context/NotificationContext";

document.title = "Vehicular UI";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalUserContextProvider>
      <NotificationProvider>
        <App/>
      </NotificationProvider>
    </LocalUserContextProvider>
  </React.StrictMode>
);
