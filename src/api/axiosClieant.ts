import axios from "axios";

const baseUrl = "https://www.googleapis.com/books/v1/volumes?";

const axiosClient = axios.create({
  baseURL: baseUrl,
});

export default axiosClient;
