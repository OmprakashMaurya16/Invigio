import api from "./api";

export const getVenues = async (params = {}) => {
  const response = await api.get("/api/venues", { params });
  return response.data;
};

export const createVenue = async (payload) => {
  const response = await api.post("/api/venues", payload);
  return response.data;
};

export const updateVenue = async (id, payload) => {
  const response = await api.patch(`/api/venues/${id}`, payload);
  return response.data;
};

export const deleteVenue = async (id) => {
  const response = await api.delete(`/api/venues/${id}`);
  return response.data;
};
