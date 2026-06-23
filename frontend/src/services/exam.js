import api from "./api";

export const getExams = async (params = {}) => {
  const response = await api.get("/api/exams", { params });
  return response.data;
};

export const getExam = async (id) => {
  const response = await api.get(`/api/exams/${id}`);
  return response.data;
};

export const createExam = async (payload) => {
  const response = await api.post("/api/exams", payload);
  return response.data;
};

export const updateExam = async (id, payload) => {
  const response = await api.patch(`/api/exams/${id}`, payload);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/api/exams/${id}`);
  return response.data;
};

export const cancelExam = async (id) => {
  const response = await api.patch(`/api/exams/${id}/cancel`);
  return response.data;
};
