import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

const PrivateRoute = ({ children }) => {
  const authenticated = getUserRole();

  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
