import axios from "axios";

export const apiConfig = axios.create({
  baseURL: "https://dummyjson.com/",
  withCredentials: true,
});
