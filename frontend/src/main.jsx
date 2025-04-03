import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/pages/App.jsx";
import Login from "./components/pages/Auth/Login.jsx";
import Register from "./components/pages/Auth/Register.jsx";
import ClientLayout from "./components/layouts/ClientLayout.jsx";
import AuthMiddleware from "./components/pages/Auth/AuthMiddleware.jsx";
import Reports from "./components/pages/Reports/Reports.jsx";
import Receipts from "./components/pages/Receipt/Receipts.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Teams from "./components/pages/Teams/Teams.jsx";
import Settings from "./components/pages/Settings/Settings.jsx";
import "./index.css"; // Import Tailwind CSS
import { ReportsProvider } from "./components/common/ReportsContent.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReportsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<AuthMiddleware><App /></AuthMiddleware>} />
            <Route path="/dashboard" element={<AuthMiddleware><Dashboard /></AuthMiddleware>} />
            <Route path="/reports" element={<AuthMiddleware><Reports /></AuthMiddleware>} />
            <Route path="/teams" element={<AuthMiddleware><Teams /></AuthMiddleware>} />
            <Route path="/settings" element={<AuthMiddleware><Settings /></AuthMiddleware>} />
            <Route path="/receipts" element={<AuthMiddleware><Receipts /></AuthMiddleware>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ReportsProvider>
  </StrictMode>
);