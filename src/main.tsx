import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function applyColorScheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
applyColorScheme(colorScheme.matches);
colorScheme.addEventListener("change", (event) => {
  applyColorScheme(event.matches);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
