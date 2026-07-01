import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/api/notifications");
  return response.data;
};
