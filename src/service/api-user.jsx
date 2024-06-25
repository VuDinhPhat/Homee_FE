import axios from "axios";

const apiUserInstance = axios.create({
  baseURL: "http://localhost:8080/api/user-management",
});

export default apiUserInstance;
