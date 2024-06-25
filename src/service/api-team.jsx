import axios from "axios";

const apiTeamInstance = axios.create({
  baseURL: "http://localhost:8080/api/team-management",
});

export default apiTeamInstance;
