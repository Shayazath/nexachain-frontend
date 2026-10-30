import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Referrals from "./pages/Referrals";
import Activity from "./pages/Activity";
import "./styles.css";
function Protected() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="boot-screen">
        <span className="spinner" />
        Loading Nexachain…
      </div>
    );
  return user ? <Layout /> : <Navigate to="/login" replace />;
}
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Protected />}>
            <Route index element={<Dashboard />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/activity" element={<Activity />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
