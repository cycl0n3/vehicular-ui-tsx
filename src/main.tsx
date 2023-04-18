import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
