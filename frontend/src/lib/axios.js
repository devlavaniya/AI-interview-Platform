// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
// });

// export default axiosInstance;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("=================================");
console.log("VITE_API_URL =", API_URL);
console.log("=================================");

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("========== API REQUEST ==========");
    console.log("Method:", config.method?.toUpperCase());
    console.log("Base URL:", config.baseURL);
    console.log("URL:", config.url);
    console.log(
      "FINAL URL:",
      `${config.baseURL}${config.url}`
    );
    console.log("Data:", config.data);
    console.log("================================");

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("========== API RESPONSE ==========");
    console.log("Status:", response.status);
    console.log("URL:", response.config?.url);
    console.log("Data:", response.data);
    console.log("=================================");

    return response;
  },
  (error) => {
    console.error("========== API ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
    console.error("Base URL:", error.config?.baseURL);
    console.error(
      "FINAL URL:",
      `${error.config?.baseURL}${error.config?.url}`
    );
    console.error("Response:", error.response?.data);
    console.error("================================");

    return Promise.reject(error);
  }
);

export default axiosInstance;