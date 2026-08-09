import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // ============================================================
    // INTERVIEW PROBLEM
    // ============================================================

    problem: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    // ============================================================
    // HOST
    // ============================================================

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ============================================================
    // PARTICIPANT
    // ============================================================

    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ============================================================
    // SESSION STATUS
    //
    // waiting   → Session created, host has not started it
    // active    → Interview is currently running
    // completed → Interview has ended
    // ============================================================

    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting",
      index: true,
    },

    // ============================================================
    // STREAM VIDEO CALL
    // ============================================================

    callId: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // INTERVIEW SESSION CODE
    //
    // Example:
    // 8F4K2P9A
    //
    // This is the code shared with the participant.
    // ============================================================

    sessionCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
      minlength: 8,
      maxlength: 8,
    },
  },
  {
    timestamps: true,
  },
);

// ============================================================
// MODEL
// ============================================================

const Session = mongoose.model("Session", sessionSchema);

export default Session;
