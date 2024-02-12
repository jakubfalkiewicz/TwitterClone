import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default axios.create({
  //https://192.168.0.164:5000
  baseURL: "https://192.168.0.17:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
