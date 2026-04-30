import api from "./axios.js";

export const getQuiz = (opportunityId) =>
  api.get(`/quiz/${opportunityId}`).then((r) => r.data);

export const submitQuiz = (opportunityId, answers) =>
  api.post("/quiz/submit", { opportunityId, answers }).then((r) => r.data);
