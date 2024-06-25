import axios from "axios";

const apiRoundInstance = axios.create({
  baseURL: "http://localhost:8080/api/round-management",
});

export default apiRoundInstance;
