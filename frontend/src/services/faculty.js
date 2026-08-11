import api from "./api";

export const getFaculty = async () => {
  const response = await api.get("/api/faculty");
  return response.data;
};

export const createFaculty = async (payload) => {
  const response = await api.post("/api/faculty", payload);
  return response.data;
};

export const updateFaculty = async (id, payload) => {
  const response = await api.patch(`/api/faculty/${id}`, payload);
  return response.data;
};

export const deleteFaculty = async (id) => {
  const response = await api.delete(`/api/faculty/${id}`);
  return response.data;
};
