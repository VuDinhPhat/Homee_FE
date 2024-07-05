
import axios from "axios";

const apiFoodInstance = axios.create({
  baseURL: "https://localhost:44388/api/Foods",
});

export default apiFoodInstance;

