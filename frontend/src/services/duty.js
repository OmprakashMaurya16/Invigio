import api from "./api";

export const getMyDuties = async () => {
  const response = await api.get("/api/duties/my-duties");
  return response.data;
};

export const respondToDuty = async (id, status, notes) => {
  const response = await api.patch(`/api/duties/${id}/respond`, { status, notes });
  return response.data;
};
