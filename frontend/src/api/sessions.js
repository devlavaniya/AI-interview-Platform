import axiosInstance from "../lib/axios";

export const sessionApi = {
  // ============================================================
  // CREATE
  // ============================================================

  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  // ============================================================
  // GET SESSIONS
  // ============================================================

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },

  getMyActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-active");
    return response.data;
  },

  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  getSessionById: async (id) => {
    if (!id) {
      throw new Error("Session ID is required");
    }

    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  // ============================================================
  // START SESSION
  // ============================================================

  startSession: async (id) => {
    if (!id) {
      throw new Error("Session ID is required");
    }

    const response = await axiosInstance.post(`/sessions/${id}/start`);

    return response.data;
  },

  // ============================================================
  // JOIN SESSION
  // ============================================================

  joinSession: async (sessionId) => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const response = await axiosInstance.post(`/sessions/${sessionId}/join`);

    return response.data;
  },

  // ============================================================
  // JOIN BY CODE
  // ============================================================

  joinSessionByCode: async (code) => {
    if (!code) {
      throw new Error("Session code is required");
    }

    const cleanCode = code.trim().toUpperCase();

    const response = await axiosInstance.post(
      `/sessions/join/code/${cleanCode}`,
    );

    return response.data;
  },

  // ============================================================
  // END SESSION
  // ============================================================

  endSession: async (id) => {
    if (!id) {
      throw new Error("Session ID is required");
    }

    const response = await axiosInstance.post(`/sessions/${id}/end`);

    return response.data;
  },

  // ============================================================
  // LEAVE SESSION
  // ============================================================

  leaveSession: async (id) => {
    if (!id) {
      throw new Error("Session ID is required");
    }

    const response = await axiosInstance.post(`/sessions/${id}/leave`);

    return response.data;
  },

  // ============================================================
  // STREAM TOKEN
  // ============================================================

  getStreamToken: async () => {
    const response = await axiosInstance.get("/chat/token");

    return response.data;
  },
};
