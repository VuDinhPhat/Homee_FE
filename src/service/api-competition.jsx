import axios from "axios";

const apiCompetitionInstance = axios.create({
  baseURL: "http://localhost:8080/api/competition-management",
});

export default apiCompetitionInstance;
