import axios from "axios";

const apiBracketInstance = axios.create({
  baseURL: "http://localhost:8080/api/bracket-management",
});

export default apiBracketInstance;
