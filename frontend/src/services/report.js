import api from "./api";

export const getDutySummary = async () => {
  const response = await api.get("/api/reports/duties");
  return response.data;
};

export const getExamSummary = async () => {
  const response = await api.get("/api/reports/exams");
  return response.data;
};

export const getConflictSummary = async () => {
  const response = await api.get("/api/reports/conflicts");
  return response.data;
};
