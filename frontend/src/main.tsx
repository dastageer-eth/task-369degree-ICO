import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Invest from "./pages/Invest.tsx";
import Stake from "./pages/Stake.tsx";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/stake" element={<Stake />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
