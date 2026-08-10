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

// --------------------------------------------------
// Clerk token getter
// This will be connected from main.jsx
// --------------------------------------------------
let clerkGetToken = null;

export const setClerkGetToken = (getToken) => {
  clerkGetToken = getToken;
};

// --------------------------------------------------
// Request interceptor
// Attach Clerk session token to every API request
// --------------------------------------------------
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (clerkGetToken) {
        const token = await clerkGetToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;

          console.log("🔐 Clerk token attached to request");
        } else {
          console.warn("⚠️ Clerk token is empty");
        }
      } else {
        console.warn("⚠️ Clerk getToken is not initialized yet");
      }
    } catch (error) {
      console.error("❌ Failed to get Clerk token:", error);
    }

    // Existing request logging
    console.log("========== API REQUEST ==========");
    console.log("Method:", config.method?.toUpperCase());
    console.log("Base URL:", config.baseURL);
    console.log("URL:", config.url);
    console.log("FINAL URL:", `${config.baseURL}${config.url}`);
    console.log("Data:", config.data);
    console.log(
      "Authorization:",
      config.headers?.Authorization ? "Bearer token attached" : "Missing",
    );
    console.log("================================");

    return config;
  },
  (error) => Promise.reject(error),
);

// --------------------------------------------------
// Response interceptor
// --------------------------------------------------
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