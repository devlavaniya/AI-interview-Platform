import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

// ============================================================
// CREATE SESSION
// ============================================================

export const useCreateSession = () => {
  return useMutation({
    mutationKey: ["createSession"],

    mutationFn: sessionApi.createSession,

    onSuccess: () => {
      toast.success("Session created successfully!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create session",
      );
    },
  });
};

// ============================================================
// ACTIVE SESSIONS
// ============================================================

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });
};

// ============================================================
// MY ACTIVE SESSIONS
// ============================================================

export const useMyActiveSessions = () => {
  return useQuery({
    queryKey: ["myActiveSessions"],
    queryFn: sessionApi.getMyActiveSessions,

    refetchInterval: 5000,
  });
};

// ============================================================
// RECENT SESSIONS
// ============================================================

export const useMyRecentSessions = () => {
  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });
};

// ============================================================
// GET SESSION
// ============================================================

export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],

    queryFn: () => sessionApi.getSessionById(id),

    enabled: Boolean(id),

    refetchInterval: 5000,
  });
};

// ============================================================
// JOIN SESSION
// ============================================================

export const useJoinSession = () => {
  return useMutation({
    mutationKey: ["joinSession"],

    mutationFn: sessionApi.joinSession,

    onSuccess: () => {
      toast.success("Joined session successfully!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to join session",
      );
    },
  });
};

// ============================================================
// JOIN SESSION BY CODE
// ============================================================

export const useJoinSessionByCode = () => {
  return useMutation({
    mutationKey: ["joinSessionByCode"],

    mutationFn: (code) => sessionApi.joinSessionByCode(code),

    onSuccess: () => {
      toast.success("Joined session successfully!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to join session",
      );
    },
  });
};

// ============================================================
// START SESSION
// ============================================================

export const useStartSession = () => {
  return useMutation({
    mutationKey: ["startSession"],

    mutationFn: (sessionId) => {
      if (!sessionId) {
        throw new Error("Session ID is missing");
      }

      return sessionApi.startSession(sessionId);
    },

    onSuccess: () => {
      toast.success("Interview session started!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to start session",
      );
    },
  });
};

// ============================================================
// END SESSION
// ============================================================

export const useEndSession = () => {
  return useMutation({
    mutationKey: ["endSession"],

    mutationFn: (sessionId) => {
      if (!sessionId) {
        throw new Error("Session ID is missing");
      }

      return sessionApi.endSession(sessionId);
    },

    onSuccess: () => {
      toast.success("Session ended successfully!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to end session",
      );
    },
  });
};

// ============================================================
// LEAVE SESSION
// ============================================================

export const useLeaveSession = () => {
  return useMutation({
    mutationKey: ["leaveSession"],

    mutationFn: (sessionId) => {
      if (!sessionId) {
        throw new Error("Session ID is missing");
      }

      return sessionApi.leaveSession(sessionId);
    },

    onSuccess: () => {
      toast.success("Left session successfully!");
    },

    onError: (error) => {
      console.error("Leave session error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to leave session",
      );
    },
  });
};
