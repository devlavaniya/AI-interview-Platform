import mongoose from "mongoose";

import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

// ============================================================
// SESSION CODE
// ============================================================

function generateSessionCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

async function getUniqueSessionCode() {
  let code = generateSessionCode();

  let existingCode = await Session.findOne({
    sessionCode: code,
  });

  while (existingCode) {
    code = generateSessionCode();

    existingCode = await Session.findOne({
      sessionCode: code,
    });
  }

  return code;
}

// ============================================================
// CREATE SESSION
// ============================================================

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;

    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if (!userId || !clerkId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!problem || !difficulty) {
      return res.status(400).json({
        message: "Problem and difficulty are required",
      });
    }

    // --------------------------------------------------------
    // CHECK EXISTING SESSION
    // --------------------------------------------------------

    const existingSession = await Session.findOne({
      host: userId,

      status: {
        $in: ["waiting", "active"],
      },
    });

    if (existingSession) {
      return res.status(400).json({
        message: "You already have an active session. Please end it first.",
      });
    }

    // --------------------------------------------------------
    // STREAM IDs
    // --------------------------------------------------------

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    const sessionCode = await getUniqueSessionCode();

    // --------------------------------------------------------
    // CREATE DATABASE SESSION
    // --------------------------------------------------------

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,

      callId,

      sessionCode,

      /*
       * IMPORTANT:
       *
       * Newly created session is waiting.
       */
      status: "waiting",
    });

    // --------------------------------------------------------
    // CREATE STREAM VIDEO CALL
    // --------------------------------------------------------

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,

        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // --------------------------------------------------------
    // CREATE CHAT CHANNEL
    // --------------------------------------------------------

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,

      created_by_id: clerkId,

      members: [clerkId],
    });

    await channel.create();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(201).json({
      session,
    });
  } catch (error) {
    console.error("Error in createSession controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// ACTIVE SESSION COUNT
// ============================================================

export async function getActiveSessions(_req, res) {
  try {
    const count = await Session.countDocuments({
      status: "active",
    });

    return res.status(200).json({
      count,
      sessions: [],
    });
  } catch (error) {
    console.error("Error in getActiveSessions controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// MY ACTIVE / WAITING SESSIONS
// ============================================================

export async function getMyActiveSessions(req, res) {
  try {
    const userId = req.user?._id;

    const sessions = await Session.find({
      $or: [{ host: userId }, { participant: userId }],

      status: {
        $in: ["waiting", "active"],
      },
    })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      sessions,
    });
  } catch (error) {
    console.error("Error in getMyActiveSessions controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// RECENT SESSIONS
// ============================================================

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user?._id;

    const sessions = await Session.find({
      status: "completed",

      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      sessions,
    });
  } catch (error) {
    console.error("Error in getMyRecentSessions controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// GET SESSION BY ID
// ============================================================

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid session ID",
      });
    }

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    return res.status(200).json({
      session,
    });
  } catch (error) {
    console.error("Error in getSessionById controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// START SESSION
// ============================================================

export async function startSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid session ID",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // --------------------------------------------------------
    // HOST ONLY
    // --------------------------------------------------------

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the host can start the session",
      });
    }

    // --------------------------------------------------------
    // ALREADY STARTED
    // --------------------------------------------------------

    if (session.status === "active") {
      return res.status(400).json({
        message: "Session is already started",
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        message: "Session has already ended",
      });
    }

    // --------------------------------------------------------
    // START
    // --------------------------------------------------------

    session.status = "active";

    await session.save();

    return res.status(200).json({
      session,

      message: "Session started successfully",
    });
  } catch (error) {
    console.error("Error in startSession controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// JOIN SESSION BY ID
// ============================================================

export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid session ID",
      });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Waiting and active sessions can be joined.
    if (!["waiting", "active"].includes(session.status)) {
      return res.status(400).json({
        message: "Cannot join this session",
      });
    }

    // Host cannot join own session.
    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Host cannot join their own session",
      });
    }

    // Session already has another participant.
    if (
      session.participant &&
      session.participant.toString() !== userId.toString()
    ) {
      return res.status(409).json({
        message: "Session is full",
      });
    }

    // Add participant.
    session.participant = userId;

    await session.save();

    // Add to chat.
    try {
      const channel = chatClient.channel("messaging", session.callId);

      if (clerkId) {
        await channel.addMembers([clerkId]);
      }
    } catch (chatError) {
      console.error("Chat add member error:", chatError.message);
    }

    return res.status(200).json({
      session,

      message: "Joined session successfully",
    });
  } catch (error) {
    console.error("Error in joinSession controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// JOIN BY CODE
// ============================================================

export async function joinSessionByCode(req, res) {
  try {
    const { code } = req.params;

    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if (!code) {
      return res.status(400).json({
        message: "Session code is required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const session = await Session.findOne({
      sessionCode: normalizedCode,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found. Invalid code.",
      });
    }

    // Waiting OR active is joinable.
    if (!["waiting", "active"].includes(session.status)) {
      return res.status(400).json({
        message: "This session is no longer available",
      });
    }

    // Host cannot join own session.
    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Host cannot join their own session",
      });
    }

    // Already has another participant.
    if (
      session.participant &&
      session.participant.toString() !== userId.toString()
    ) {
      return res.status(409).json({
        message: "Session is full",
      });
    }

    session.participant = userId;

    await session.save();

    // Add participant to chat.
    try {
      const channel = chatClient.channel("messaging", session.callId);

      if (clerkId) {
        await channel.addMembers([clerkId]);
      }
    } catch (chatError) {
      console.error("Chat member error:", chatError.message);
    }

    return res.status(200).json({
      session,

      message: "Joined session successfully",
    });
  } catch (error) {
    console.error("Error in joinSessionByCode controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// LEAVE SESSION
// ============================================================

export async function leaveSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user?._id;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid session ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // --------------------------------------------------------
    // FIND SESSION
    // --------------------------------------------------------

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // --------------------------------------------------------
    // ONLY PARTICIPANT
    // --------------------------------------------------------

    if (
      !session.participant ||
      session.participant.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not a participant in this session",
      });
    }

    // --------------------------------------------------------
    // REMOVE PARTICIPANT
    // --------------------------------------------------------

    session.participant = null;

    await session.save();

    // --------------------------------------------------------
    // REMOVE CHAT MEMBER
    // --------------------------------------------------------

    try {
      const channel = chatClient.channel("messaging", session.callId);

      if (req.user?.clerkId) {
        await channel.removeMembers([req.user.clerkId]);
      }
    } catch (chatError) {
      console.error("Chat removal error:", chatError.message);
    }

    return res.status(200).json({
      session,

      message: "Left session successfully",
    });
  } catch (error) {
    console.error("Error in leaveSession controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// ============================================================
// END SESSION
// ============================================================

export async function endSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user?._id;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid session ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // --------------------------------------------------------
    // HOST ONLY
    // --------------------------------------------------------

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the host can end the session",
      });
    }

    // --------------------------------------------------------
    // ALREADY COMPLETED
    // --------------------------------------------------------

    if (session.status === "completed") {
      return res.status(400).json({
        message: "Session is already completed",
      });
    }

    // --------------------------------------------------------
    // DELETE STREAM VIDEO
    // --------------------------------------------------------

    try {
      if (session.callId) {
        const call = streamClient.video.call("default", session.callId);

        await call.delete({
          hard: true,
        });
      }
    } catch (streamError) {
      console.error("Stream call deletion error:", streamError.message);
    }

    // --------------------------------------------------------
    // DELETE CHAT
    // --------------------------------------------------------

    try {
      if (session.callId) {
        const channel = chatClient.channel("messaging", session.callId);

        await channel.delete();
      }
    } catch (chatError) {
      console.error("Chat deletion error:", chatError.message);
    }

    // --------------------------------------------------------
    // COMPLETE SESSION
    // --------------------------------------------------------

    session.status = "completed";

    await session.save();

    return res.status(200).json({
      session,

      message: "Session ended successfully",
    });
  } catch (error) {
    console.error("Error in endSession controller:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
