import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getDefaultRouteForRole } from "../../utils/auth";

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  // If user is already authenticated, redirect to their role-based home page
  if (authenticated) {
    const target = getDefaultRouteForRole();
    return <Navigate to={target} replace />;
  }

  return children;
};

export default PublicRoute;
