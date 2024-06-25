import axios from "axios";

const apiContestantInstance = axios.create({
  baseURL: "http://localhost:8080/api/contestant-management",
});

export default apiContestantInstance;
