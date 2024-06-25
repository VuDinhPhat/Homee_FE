import axios from "axios";

const apiResultInstance = axios.create({
  baseURL: "http://localhost:8080/api/result-management",
});

export default apiResultInstance;
