import api from "./axios.js";

export const listOpportunities = (params) =>
  api.get("/opportunities", { params }).then((r) => r.data);

export const getOpportunity = (id) =>
  api.get(`/opportunities/${id}`).then((r) => r.data);

export const createOpportunity = (payload) =>
  api.post("/opportunities", payload).then((r) => r.data);

export const updateOpportunity = (id, payload) =>
  api.put(`/opportunities/${id}`, payload).then((r) => r.data);

export const deleteOpportunity = (id) =>
  api.delete(`/opportunities/${id}`).then((r) => r.data);

export const toggleSave = (id) =>
  api.post(`/user/save/${id}`).then((r) => r.data);

export const getSaved = () => api.get("/user/saved").then((r) => r.data);

export const getDashboard = () =>
  api.get("/user/dashboard").then((r) => r.data);

export const updateProgress = (progress) =>
  api.post("/user/progress", { progress }).then((r) => r.data);

export const listUsers = () => api.get("/user").then((r) => r.data);
