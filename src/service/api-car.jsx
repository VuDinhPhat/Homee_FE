import axios from "axios";

const apiCarInstance = axios.create({
  baseURL: "http://localhost:8080/api/car-management",
});

export default apiCarInstance;
