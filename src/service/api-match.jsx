import axios from "axios";

const apiMatchInstance = axios.create({
  baseURL: "http://localhost:8080/api/match-management",
});

export default apiMatchInstance;
