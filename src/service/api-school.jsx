import axios from "axios";

const apiSchoolInstance = axios.create({
  baseURL: "http://localhost:8080/api/school-management",
});

export default apiSchoolInstance;
