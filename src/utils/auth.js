import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    return decoded.role;
  } catch (error) {
    removeToken();
    return null;
  }
};

/**
 * Get the default route path for the current authenticated user's role.
 * - ADMIN      -> /admin
 * - INSTRUCTOR -> /inscourse
 * - STUDENT or unknown -> /list
 */
export const getDefaultRouteForRole = () => {
  const role = getUserRole();

  if (role === "ADMIN") return "/admin";
  if (role === "INSTRUCTOR") return "/inscourse";

  // Default for STUDENT or when role is missing
  return "/list";
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return false;
    }
    return true;
  } catch (error) {
    // Invalid token
    removeToken();
    return false;
  }
};

export const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    return decoded;
  } catch (error) {
    removeToken();
    return null;
  }
};
