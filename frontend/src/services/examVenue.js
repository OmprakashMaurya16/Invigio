import api from "./api";

export const getExamVenues = async () => {
  const response = await api.get("/api/exam-venues");
  return response.data;
};

export const createExamVenue = async (payload) => {
  const response = await api.post("/api/exam-venues", payload);
  return response.data;
};

export const updateExamVenue = async (id, payload) => {
  const response = await api.patch(`/api/exam-venues/${id}`, payload);
  return response.data;
};

export const deleteExamVenue = async (id) => {
  const response = await api.delete(`/api/exam-venues/${id}`);
  return response.data;
};
