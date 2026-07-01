import api from "./api";

export const createCancellationRequest = async (payload) => {
  const response = await api.post("/api/cancellation-requests", payload);
  return response.data;
};

export const getMyCancellationRequests = async () => {
  const response = await api.get("/api/cancellation-requests");
  return response.data;
};
