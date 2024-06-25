import axios from "axios";

const apiStudentInstance = axios.create({
  baseURL: "http://localhost:8080/api/student-management",
});

export default apiStudentInstance;
