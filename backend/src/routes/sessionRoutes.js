import express from "express";

import {
  createSession,
  getActiveSessions,
  getMyActiveSessions,
  getMyRecentSessions,
  getSessionById,
  startSession,
  joinSession,
  joinSessionByCode,
  leaveSession,
  endSession,
} from "../controllers/sessionController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// ============================================================
// CREATE
// ============================================================

router.post("/", protectRoute, createSession);

// ============================================================
// GET
// ============================================================

router.get("/active", protectRoute, getActiveSessions);

router.get("/my-active", protectRoute, getMyActiveSessions);

router.get("/my-recent", protectRoute, getMyRecentSessions);

// ============================================================
// JOIN BY CODE
// ============================================================

router.post("/join/code/:code", protectRoute, joinSessionByCode);

// ============================================================
// SESSION ID ROUTES
// ============================================================

router.get("/:id", protectRoute, getSessionById);

router.post("/:id/start", protectRoute, startSession);

router.post("/:id/join", protectRoute, joinSession);

router.post("/:id/leave", protectRoute, leaveSession);

router.post("/:id/end", protectRoute, endSession);

export default router;
