// import mongoose from "mongoose";

// const questionAnalysisSchema = new mongoose.Schema(
//   {
//     questionId: { type: Number },
//     question: { type: String },
//     candidateAnswer: { type: String, default: "" },
//     idealAnswer: { type: String },
//     score: { type: Number, min: 0, max: 10 },
//     feedback: { type: String },
//     whatWasGood: { type: String },
//     whatToImprove: { type: String },
//     correctAnswer: { type: String },
//   },
//   { _id: false }
// );

// const mockInterviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     topic: { type: String, required: true },
//     topicLabel: { type: String },
//     difficulty: {
//       type: String,
//       enum: ["Easy", "Medium", "Hard"],
//       required: true,
//     },
//     questionCount: { type: Number, required: true },
//     questions: [
//       {
//         id: Number,
//         question: String,
//         idealAnswer: String,
//       },
//     ],
//     answers: [{ type: String }],
//     overallScore: { type: Number, min: 0, max: 100 },
//     grade: { type: String },
//     summary: { type: String },
//     strengths: [String],
//     areasToImprove: [String],
//     questionAnalysis: [questionAnalysisSchema],
//     visualAnalysis: {
//       nervousness: { type: String },
//       eyeContact: { type: String },
//       attire: { type: String },
//       feedback: { type: String }
//     },
//     durationMinutes: { type: Number },
//   },
//   { timestamps: true }
// );

// const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

// export default MockInterview;


import mongoose from "mongoose";

const questionAnalysisSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
    },

    question: {
      type: String,
    },

    candidateAnswer: {
      type: String,
      default: "",
    },

    idealAnswer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
      default: "",
    },

    whatWasGood: {
      type: String,
      default: "",
    },

    whatToImprove: {
      type: String,
      default: "",
    },

    correctAnswer: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// ANSWER SCHEMA
// =====================================================

const answerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },

    question: {
      type: String,
      default: "",
    },

    idealAnswer: {
      type: String,
      default: "",
    },

    candidateAnswer: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// MOCK INTERVIEW SCHEMA
// =====================================================

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    topicLabel: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    questionCount: {
      type: Number,
      required: true,
    },

    // =================================================
    // QUESTIONS
    // =================================================

    questions: [
      {
        id: Number,

        question: {
          type: String,
          default: "",
        },

        idealAnswer: {
          type: String,
          default: "",
        },
      },
    ],

    // =================================================
    // CANDIDATE ANSWERS
    // =================================================

    answers: [answerSchema],

    // =================================================
    // REPORT
    // =================================================

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    areasToImprove: {
      type: [String],
      default: [],
    },

    questionAnalysis: {
      type: [questionAnalysisSchema],
      default: [],
    },

    // =================================================
    // VISUAL ANALYSIS
    // =================================================

    visualAnalysis: {
      nervousness: {
        type: String,
        default: "",
      },

      eyeContact: {
        type: String,
        default: "",
      },

      attire: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

const MockInterview = mongoose.model(
  "MockInterview",
  mockInterviewSchema
);

export default MockInterview;