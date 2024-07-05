import axios from "axios";

const apiUserInstance = axios.create({
  baseURL: "https://localhost:44388/api/Users",
});

export default apiUserInstance;
