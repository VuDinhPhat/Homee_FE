import axios from "axios";

const apiChefInstance = axios.create({
  baseURL: "https://localhost:44388/api/Chefs",
});

export default apiChefInstance;
