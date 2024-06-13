import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CsvProvider } from "./components/CsvContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CsvProvider>
      <App />
    </CsvProvider>
  </React.StrictMode>
);
