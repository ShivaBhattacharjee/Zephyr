import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NicknameProvider } from "./context/NickName.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NicknameProvider>
      <App />
    </NicknameProvider>
  </React.StrictMode>
);
