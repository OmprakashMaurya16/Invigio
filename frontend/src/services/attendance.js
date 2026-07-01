import api from "./api";

export const getAttendanceSummary = async () => {
  const response = await api.get("/api/attendance/summary");
  return response.data;
};
