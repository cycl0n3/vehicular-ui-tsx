import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { CurrentUserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </React.StrictMode>
);
