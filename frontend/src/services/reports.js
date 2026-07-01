import api from "./api";

export const getReportsSummary = async () => {
  const response = await api.get("/api/reports/summary");
  return response.data;
};
