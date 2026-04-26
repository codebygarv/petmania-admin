import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("admin_token");
  console.log(user, token);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("admin_token");
  console.log(user, token);
  const location = useLocation();

  if (token && user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}