import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  // If user is already authenticated, redirect to dashboard
  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
