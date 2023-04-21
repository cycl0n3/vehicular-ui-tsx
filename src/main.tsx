import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import {LocalUserProvider} from "./context/LocalUserContext";

document.title = "Vehicular UI";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalUserProvider>
      <App/>
    </LocalUserProvider>
  </React.StrictMode>
);
