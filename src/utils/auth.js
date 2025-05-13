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
  const decoded = jwtDecode(token);
  return decoded.role;
};
