import api from "./api";

export const getAttendance = async () => {
  const response = await api.get("/api/attendance");
  return response.data;
};

export const markAttendance = async (payload) => {
  const response = await api.post("/api/attendance", payload);
  return response.data;
};
