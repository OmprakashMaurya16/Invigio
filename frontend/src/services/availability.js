import api from "./api";

export const getMyAvailability = async () => {
  const response = await api.get("/api/availability/my");
  return response.data;
};

export const saveAvailability = async (payload) => {
  const response = await api.post("/api/availability", payload);
  return response.data;
};
