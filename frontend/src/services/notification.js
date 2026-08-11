import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/api/notifications");
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch("/api/notifications/read-all");
  return response.data;
};
