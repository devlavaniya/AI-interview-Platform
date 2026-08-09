import mongoose from "mongoose";
import MockInterview from "../models/MockInterview.js";

// =====================================================
// SAVE COMPLETED INTERVIEW
// =====================================================

export const saveInterviewReport = async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log("\n========================================");
    console.log("SAVE INTERVIEW REQUEST");
    console.log("User ID:", userId);
    console.log("========================================");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const {
      topic,
      topicLabel,
      difficulty,
      questionCount,
      questions,
      answers,
      report,
      durationMinutes,
    } = req.body;

    // =================================================
    // DEBUG
    // =================================================

    console.log("Topic:", topic);
    console.log("Topic Label:", topicLabel);
    console.log("Difficulty:", difficulty);
    console.log("Question Count:", questionCount);

    console.log(
      "Questions:",
      JSON.stringify(questions, null, 2)
    );

    console.log(
      "Answers:",
      JSON.stringify(answers, null, 2)
    );

    console.log(
      "Report:",
      JSON.stringify(report, null, 2)
    );

    // =================================================
    // VALIDATION
    // =================================================

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Difficulty is required",
      });
    }

    if (!report) {
      return res.status(400).json({
        success: false,
        message: "Evaluation report is required",
      });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Questions must be an array",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No questions found",
      });
    }

    // =================================================
    // NORMALIZE QUESTIONS
    // =================================================

    const normalizedQuestions = questions.map(
      (question, index) => ({
        id:
          question?.id ??
          index + 1,

        question:
          question?.question ||
          "",

        idealAnswer:
          question?.idealAnswer ||
          "",
      })
    );

    // =================================================
    // NORMALIZE ANSWERS
    //
    // IMPORTANT:
    // We always take candidateAnswer from the frontend.
    // =================================================

    const normalizedAnswers =
      normalizedQuestions.map(
        (question, index) => {
          const answer = answers[index];

          return {
            id:
              answer?.id ??
              question.id ??
              index + 1,

            question:
              answer?.question ||
              question.question ||
              "",

            idealAnswer:
              answer?.idealAnswer ||
              question.idealAnswer ||
              "",

            candidateAnswer:
              answer?.candidateAnswer ??
              answer?.answer ??
              "",
          };
        }
      );

    console.log(
      "\nNORMALIZED ANSWERS:"
    );

    console.log(
      JSON.stringify(
        normalizedAnswers,
        null,
        2
      )
    );

    // =================================================
    // AI QUESTION ANALYSIS
    // =================================================

    const aiAnalysis =
      Array.isArray(report.questionAnalysis)
        ? report.questionAnalysis
        : [];

    // =================================================
    // BUILD QUESTION ANALYSIS
    //
    // We iterate over QUESTIONS, not AI analysis.
    // This guarantees every question gets an entry.
    // =================================================

    const questionAnalysis =
      normalizedQuestions.map(
        (question, index) => {
          const answer =
            normalizedAnswers[index];

          const ai =
            aiAnalysis[index] || {};

          return {
            questionId:
              ai?.questionId ??
              question.id ??
              index + 1,

            question:
              question.question,

            // ALWAYS use actual candidate answer
            candidateAnswer:
              answer.candidateAnswer,

            idealAnswer:
              answer.idealAnswer,

            score:
              typeof ai?.score === "number"
                ? ai.score
                : 0,

            feedback:
              ai?.feedback || "",

            whatWasGood:
              ai?.whatWasGood || "",

            whatToImprove:
              ai?.whatToImprove || "",

            correctAnswer:
              ai?.correctAnswer ||
              ai?.idealAnswer ||
              question.idealAnswer ||
              "",
          };
        }
      );

    console.log(
      "\nQUESTION ANALYSIS:"
    );

    console.log(
      JSON.stringify(
        questionAnalysis,
        null,
        2
      )
    );

    // =================================================
    // CREATE DOCUMENT
    // =================================================

    const interviewData = {
      user: userId,

      topic,

      topicLabel:
        topicLabel ||
        topic,

      difficulty,

      questionCount:
        questionCount ||
        normalizedQuestions.length,

      questions:
        normalizedQuestions,

      answers:
        normalizedAnswers,

      overallScore:
        typeof report.overallScore === "number"
          ? report.overallScore
          : 0,

      grade:
        report.grade ||
        "",

      summary:
        report.summary ||
        "",

      strengths:
        Array.isArray(report.strengths)
          ? report.strengths
          : [],

      areasToImprove:
        Array.isArray(
          report.areasToImprove
        )
          ? report.areasToImprove
          : [],

      questionAnalysis,

      visualAnalysis:
        report.visualAnalysis || undefined,

      durationMinutes:
        typeof durationMinutes === "number"
          ? durationMinutes
          : 0,
    };

    console.log(
      "\nFINAL MONGODB DOCUMENT:"
    );

    console.log(
      JSON.stringify(
        interviewData,
        null,
        2
      )
    );

    // =================================================
    // SAVE
    // =================================================

    const interview =
      await MockInterview.create(
        interviewData
      );

    console.log(
      "\n========================================"
    );

    console.log(
      "INTERVIEW SAVED SUCCESSFULLY"
    );

    console.log(
      "MongoDB ID:",
      interview._id
    );

    console.log(
      "========================================\n"
    );

    return res.status(201).json({
      success: true,
      message:
        "Interview saved successfully",

      interviewId:
        interview._id,

      interview,
    });
  } catch (error) {
    console.error(
      "\n========================================"
    );

    console.error(
      "SAVE INTERVIEW ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Errors:",
      error.errors
    );

    console.error(
      "Full Error:",
      error
    );

    console.error(
      "========================================\n"
    );

    return res.status(500).json({
      success: false,

      message:
        "Error saving interview report",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// GET INTERVIEW HISTORY
// =====================================================

export const getInterviewHistory = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User authentication failed",
      });
    }

    const interviews =
      await MockInterview.find({
        user: userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .select(
          "topic topicLabel difficulty questionCount overallScore grade durationMinutes createdAt"
        )
        .lean();

    console.log(
      "Interview history:",
      interviews.length
    );

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(
      "Error fetching interview history:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error fetching interview history",
    });
  }
};

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

export const getInterviewById = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview ID",
      });
    }

    const interview =
      await MockInterview.findOne({
        _id: id,
        user: userId,
      }).lean();

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    console.log(
      "Interview details requested:",
      id
    );

    console.log(
      "Answers:",
      JSON.stringify(
        interview.answers,
        null,
        2
      )
    );

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(
      "Error fetching interview:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interview",
    });
  }
};