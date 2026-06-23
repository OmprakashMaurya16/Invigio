import api from "./api";

const TOKEN_KEY = "invigio_token";
const USER_KEY = "invigio_user";

export const login = async (email, password) => {
  const response = await api.post("/api/user/login", { email, password });
  return response.data;
};

export const setAuthCredentials = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthCredentials = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

export const clearAuthCredentials = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const mapRole = (role) => {
  if (!role) return null;
  const normalized = role.toString().toUpperCase();
  if (normalized === "ADMIN") return "admin";
  if (normalized === "PROFESSOR") return "professor";
  return role.toLowerCase();
};
