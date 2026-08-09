import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("=================================");
console.log("VITE_API_URL =", API_URL);
console.log("=================================");

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Clerk token getter
let getClerkToken = null;

export const setClerkTokenGetter = (getter) => {
  getClerkToken = getter;
};

// ================================
// REQUEST INTERCEPTOR
// ================================

axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("========== API REQUEST ==========");
    console.log("Method:", config.method?.toUpperCase());
    console.log("Base URL:", config.baseURL);
    console.log("URL:", config.url);

    console.log(
      "FINAL URL:",
      `${config.baseURL}${config.url}`
    );

    // Get Clerk session token
    if (getClerkToken) {
      try {
        const token = await getClerkToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;

          console.log("Clerk token attached: YES");
        } else {
          console.warn("Clerk token attached: NO TOKEN");
        }
      } catch (error) {
        console.error(
          "Failed to get Clerk token:",
          error
        );
      }
    } else {
      console.warn(
        "Clerk token getter has not been initialized"
      );
    }

    console.log("Data:", config.data);
    console.log("================================");

    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// RESPONSE INTERCEPTOR
// ================================

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

    console.error(
      "Response:",
      error.response?.data
    );

    console.error("================================");

    return Promise.reject(error);
  }
);

export default axiosInstance;