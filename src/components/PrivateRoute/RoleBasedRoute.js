import React from "react";
import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  getUserRole,
  getDefaultRouteForRole,
} from "../../utils/auth";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to the user's role-based home if they don't have required role
    const target = getDefaultRouteForRole();
    return <Navigate to={target} replace />;
  }

  return children;
};

export default RoleBasedRoute;

