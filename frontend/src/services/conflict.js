import api from "./api";

export const getConflicts = async () => {
  const response = await api.get("/api/conflicts");
  return response.data;
};

export const getMyConflicts = async () => {
  const response = await api.get("/api/conflicts/my");
  return response.data;
};

export const resolveConflict = async (id, payload) => {
  const response = await api.patch(`/api/conflicts/${id}/resolve`, payload);
  return response.data;
};

export const createConflict = async (payload) => {
  const response = await api.post("/api/conflicts", payload);
  return response.data;
};
