import axios from "axios";

const apiCoachInstance = axios.create({
  baseURL: "http://localhost:8080/api/coach-management",
});

export default apiCoachInstance;
