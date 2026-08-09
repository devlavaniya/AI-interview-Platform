import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import { interviewApi } from "../api/interview";

import {
  BrainCircuit,
  Sparkles,
  Trophy,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Camera,
  CameraOff,
  History,
  CalendarDays,
  BarChart3,
  Clock3,
} from "lucide-react";

const TOPICS = [
  {
    id: "dsa",
    label: "Data Structures & Algorithms",
    icon: "🧮",
    desc: "Arrays, Trees, Graphs",
  },
  {
    id: "system-design",
    label: "System Design",
    icon: "🏗️",
    desc: "Scalability & Architecture",
  },
  {
    id: "os",
    label: "Operating Systems",
    icon: "💻",
    desc: "Memory & Scheduling",
  },
  {
    id: "dbms",
    label: "DBMS",
    icon: "🗄️",
    desc: "SQL & Transactions",
  },
  {
    id: "oop",
    label: "OOP",
    icon: "🎯",
    desc: "SOLID & Design Patterns",
  },
  {
    id: "cn",
    label: "Computer Networks",
    icon: "🌐",
    desc: "TCP/IP & HTTP",
  },
  {
    id: "react",
    label: "React",
    icon: "⚛️",
    desc: "Hooks & State",
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: "⚡",
    desc: "ES6 & Async",
  },
  {
    id: "hr",
    label: "HR Interview",
    icon: "🤝",
    desc: "Behavioural",
  },
];

const QUESTION_COUNTS = [3, 5, 10];

function MockInterviewPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  // =========================================================
  // STAGE
  // =========================================================

  const [stage, setStage] = useState("setup");

  // =========================================================
  // SETUP
  // =========================================================

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // =========================================================
  // INTERVIEW
  // =========================================================

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // =========================================================
  // CAMERA
  // =========================================================

  const [cameraStatus, setCameraStatus] = useState("idle");
  // idle | starting | active | unavailable

  // =========================================================
  // REPORT
  // =========================================================

  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);

  // =========================================================
  // HISTORY DETAILS DIALOG
  // =========================================================

  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryInterview, setSelectedHistoryInterview] = useState(null);

  // =========================================================
  // REFS
  // =========================================================

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const recognitionTextRef = useRef("");

  // =========================================================
  // LOAD / REFRESH HISTORY
  // =========================================================

  const refreshHistory = useCallback(async () => {
    try {
      if (typeof interviewApi.getHistory !== "function") {
        console.warn("interviewApi.getHistory is not available.");
        return;
      }

      const data = await interviewApi.getHistory();

      if (data?.success) {
        setHistory(Array.isArray(data.interviews) ? data.interviews : []);
      } else {
        console.warn("Interview history API returned an unsuccessful response:", data);
      }
    } catch (error) {
      // History should never stop a new interview from working.
      console.warn(
        "Could not load interview history:",
        error?.response?.status,
        error?.response?.data || error?.message
      );
    }
  }, []);

  const handleHistoryClick = async (interviewId) => {
    if (!interviewId) {
      toast.error("Interview ID is missing.");
      return;
    }

    // Open the dialog FIRST so the click always gives visible feedback.
    setHistoryDialogOpen(true);
    setHistoryLoading(true);
    setSelectedHistoryInterview(null);

    try {
      if (typeof interviewApi.getById !== "function") {
        throw new Error(
          "interviewApi.getById is not available. Add the GET interview-by-id API."
        );
      }

      const response = await interviewApi.getById(interviewId);

      console.log("Interview details response:", response);

      // Support common API response shapes:
      // { success: true, interview: {...} }
      // { interview: {...} }
      // {...interview fields directly}
      const interview =
        response?.interview ||
        response?.data?.interview ||
        response?.data ||
        response;

      if (!interview || typeof interview !== "object") {
        throw new Error("Interview details were not returned by the server.");
      }

      setSelectedHistoryInterview(interview);
    } catch (error) {
      console.error("HISTORY DETAILS ERROR:", error);
      console.error("Response:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to load interview details."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistoryDialog = () => {
    setHistoryDialogOpen(false);
    setHistoryLoading(false);
    setSelectedHistoryInterview(null);
  };

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    if (!historyDialogOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeHistoryDialog();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [historyDialogOpen]);

  // =========================================================
  // SPEECH RECOGNITION
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = recognitionTextRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          transcript += result[0].transcript + " ";
        } else {
          transcript += result[0].transcript;
        }
      }

      recognitionTextRef.current = transcript.trim();

      setCurrentAnswer(recognitionTextRef.current);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore stop errors.
      }

      recognitionRef.current = null;
    };
  }, []);

  // =========================================================
  // CAMERA
  // =========================================================

  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");

    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore track stop errors.
        }
      });

      videoStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraStatus("idle");
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn("getUserMedia is not supported.");
      setCameraStatus("unavailable");
      return;
    }

    try {
      setCameraStatus("starting");

      console.log("Requesting camera permission...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      console.log("Camera permission granted.");

      videoStreamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        console.warn("Video element is not available yet.");

        stream.getTracks().forEach((track) => track.stop());
        videoStreamRef.current = null;
        setCameraStatus("unavailable");

        return;
      }

      video.srcObject = stream;

      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      await video.play();

      console.log("Camera preview started successfully.");

      setCameraStatus("active");
    } catch (error) {
      console.error("Camera initialization failed:", error);

      if (error?.name === "NotAllowedError") {
        toast.error("Camera permission was denied.");
      } else if (error?.name === "NotFoundError") {
        toast.error("No camera was found.");
      } else if (error?.name === "NotReadableError") {
        toast.error("Camera is already being used by another application.");
      } else {
        toast.error("Unable to access camera.");
      }

      setCameraStatus("unavailable");
    }
  }, []);

  // =========================================================
  // CAMERA EFFECT
  //
  // IMPORTANT:
  // Camera starts AFTER stage becomes "interview".
  // Therefore the <video> element already exists.
  // =========================================================

  useEffect(() => {
    if (stage !== "interview") {
      return;
    }

    let cancelled = false;

    const initializeCamera = async () => {
      // Wait one frame so React has definitely mounted <video>.
      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (cancelled) return;

      await startCamera();
    };

    initializeCamera();

    return () => {
      cancelled = true;
    };
  }, [stage, startCamera]);

  // =========================================================
  // CLEANUP WHEN COMPONENT UNMOUNTS
  // =========================================================

  useEffect(() => {
    return () => {
      stopCamera();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore.
        }
      }

      window.speechSynthesis?.cancel();
    };
  }, [stopCamera]);

  // =========================================================
  // VOICE
  // =========================================================

  const speak = useCallback(
    (text) => {
      if (!voiceEnabled || !text) return;

      if (!window.speechSynthesis) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled],
  );

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const handleStartInterview = async () => {
    try {
      setStage("loading");

      const topic = showCustomInput
        ? customTopic.trim()
        : selectedTopic?.label;

      console.log("Starting interview:", {
        topic,
        difficulty,
        count: questionCount,
      });

      if (!topic) {
        toast.error("Please select an interview topic.");
        setStage("setup");
        return;
      }

      if (showCustomInput && !customTopic.trim()) {
        toast.error("Please enter a custom topic.");
        setStage("setup");
        return;
      }

      if (typeof interviewApi.generateQuestions !== "function") {
        throw new Error(
          "interviewApi.generateQuestions is not available.",
        );
      }

      const data = await interviewApi.generateQuestions({
        topic,
        difficulty,
        count: questionCount,
      });

      console.log("Generate questions response:", data);

      const generatedQuestions = Array.isArray(data?.questions)
        ? data.questions
        : [];

      if (generatedQuestions.length === 0) {
        throw new Error("No interview questions were generated.");
      }

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setCurrentAnswer("");
      setAnswerSubmitted(false);
      setReport(null);
      setStartTime(Date.now());

      recognitionTextRef.current = "";

      setStage("interview");

      // Camera is intentionally NOT started here.
      //
      // The camera useEffect will start after React renders
      // the <video> element.
      //
      // This fixes the black camera preview problem.

      setTimeout(() => {
        if (generatedQuestions[0]?.question) {
          speak(generatedQuestions[0].question);
        }
      }, 150);
    } catch (error) {
      console.error("START INTERVIEW ERROR:", error);

      console.error("Response:", error?.response?.data);
      console.error("Status:", error?.response?.status);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Unable to start interview.",
      );

      setStage("setup");
    }
  };

  // =========================================================
  // MICROPHONE
  // =========================================================

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error(
        "Speech recognition is not supported in this browser.",
      );
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      recognitionTextRef.current = currentAnswer.trim();

      recognitionRef.current.start();
    } catch (error) {
      console.error("Microphone error:", error);

      // Browser can throw if recognition is already running.
      if (error?.name !== "InvalidStateError") {
        toast.error("Unable to start microphone.");
      }
    }
  };

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmitAnswer = () => {
    const answer = currentAnswer.trim();

    if (!answer) {
      toast.error("Answer cannot be empty.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      toast.error("Current question is unavailable.");
      return;
    }

    // Stop speech recognition if active.
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore.
      }

      setIsListening(false);
    }

    const answerObject = {
      id: currentQuestion.id ?? currentQuestionIndex + 1,
      question: currentQuestion.question || "",
      idealAnswer: currentQuestion.idealAnswer || "",
      candidateAnswer: answer,
    };

    const updatedAnswers = [...answers, answerObject];

    console.log("Updated answers:", updatedAnswers);

    setAnswers(updatedAnswers);
    setAnswerSubmitted(true);
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNextQuestion = () => {
    if (!answerSubmitted) {
      toast.error("Please submit your answer first.");
      return;
    }

    if (currentQuestionIndex >= questions.length - 1) {
      handleFinishInterview();
      return;
    }

    const nextIndex = currentQuestionIndex + 1;

    setCurrentQuestionIndex(nextIndex);

    setCurrentAnswer("");

    setAnswerSubmitted(false);

    recognitionTextRef.current = "";

    if (voiceEnabled && questions[nextIndex]?.question) {
      setTimeout(() => {
        speak(questions[nextIndex].question);
      }, 100);
    }
  };

  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

const handleFinishInterview = async () => {
  try {
    console.log("Stopping camera...");
    stopCamera();

    setStage("loading");

    // =====================================================
    // 1. Prepare questions + candidate answers
    // =====================================================

    const questionsAndAnswers = answers.map((answer, index) => ({
      id: answer?.id ?? questions[index]?.id ?? index + 1,

      question:
        answer?.question ||
        questions[index]?.question ||
        "",

      idealAnswer:
        answer?.idealAnswer ||
        questions[index]?.idealAnswer ||
        "",

      candidateAnswer:
        answer?.candidateAnswer ||
        answer?.answer ||
        "",
    }));

    const topic = showCustomInput
      ? customTopic.trim()
      : selectedTopic?.label;

    if (!topic) {
      throw new Error("Interview topic is missing.");
    }

    console.log(
      "Submitting interview for evaluation:",
      {
        topic,
        difficulty,
        questionsAndAnswers,
      }
    );

    // =====================================================
    // 2. Evaluate interview using Groq
    // =====================================================

    const response = await interviewApi.evaluateAnswers({
      topic,
      difficulty,
      questionsAndAnswers,
      videoFrames: [],
    });

    console.log("Evaluation response:", response);

    if (!response?.evaluation) {
      throw new Error(
        "Backend returned no evaluation."
      );
    }

    const evaluation = response.evaluation;

    // =====================================================
    // 3. Store evaluation in React state
    // =====================================================

    setReport(evaluation);

    // =====================================================
    // 4. Calculate duration
    // =====================================================

    const durationMinutes = startTime
      ? Math.max(
          1,
          Math.round(
            (Date.now() - startTime) / 60000
          )
        )
      : 0;

    // =====================================================
    // 5. Save complete interview to MongoDB
    // =====================================================

    try {
      const savePayload = {
        topic:
          selectedTopic?.id ||
          "custom",

        topicLabel: topic,

        difficulty,

        questionCount:
          questions.length,

        questions: questions.map((question) => ({
          id: question?.id,
          question:
            question?.question || "",
          idealAnswer:
            question?.idealAnswer || "",
        })),

        // IMPORTANT:
        // Save the exact same normalized
        // questions + answers used for evaluation.
        answers: questionsAndAnswers,

        report: evaluation,

        durationMinutes,
      };

      console.log(
        "Saving interview to MongoDB:",
        JSON.stringify(
          savePayload,
          null,
          2
        )
      );

      const saveResponse =
        await interviewApi.saveReport(
          savePayload
        );

      console.log(
        "Interview saved successfully:",
        saveResponse
      );

      if (!saveResponse?.success) {
        throw new Error(
          saveResponse?.message ||
            "Interview was not saved."
        );
      }

      toast.success(
        "Interview saved to history."
      );

      // =================================================
      // 6. Refresh history
      // =================================================

      if (typeof refreshHistory === "function") {
        await refreshHistory();
      }
    } catch (saveError) {
      console.error(
        "========== SAVE INTERVIEW ERROR =========="
      );

      console.error(
        "Save error:",
        saveError
      );

      console.error(
        "Backend response:",
        saveError?.response?.data
      );

      console.error(
        "Backend status:",
        saveError?.response?.status
      );

      console.error(
        "==========================================="
      );

      toast.error(
        "Report generated successfully, but it could not be saved to history."
      );
    }

    // =====================================================
    // 7. Show report
    // =====================================================

    setStage("report");
  } catch (err) {
    console.error(
      "========== EVALUATION ERROR =========="
    );

    console.error(
      "Evaluation error:",
      err
    );

    console.error(
      "Backend response:",
      err?.response?.data
    );

    console.error(
      "Backend status:",
      err?.response?.status
    );

    console.error(
      "======================================"
    );

    toast.error(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to evaluate interview."
    );

    stopCamera();

    setStage("setup");
  }
};

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    stopCamera();

    window.speechSynthesis?.cancel();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore.
      }
    }

    setStage("setup");

    setQuestions([]);

    setCurrentQuestionIndex(0);

    setAnswers([]);

    setCurrentAnswer("");

    setAnswerSubmitted(false);

    setReport(null);
    setStartTime(null);

    setCameraStatus("idle");

    setIsListening(false);
    setIsSpeaking(false);

    recognitionTextRef.current = "";

    setHistoryDialogOpen(false);
    setHistoryLoading(false);
    setSelectedHistoryInterview(null);
  };

  // =========================================================
  // SETUP SCREEN
  // =========================================================

  if (stage === "setup") {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HERO */}

        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-surface to-black">
          <div className="flex flex-col gap-10 p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-[11px] font-medium text-yellow-400">
                <Sparkles size={16} />
                AI Powered Interview Platform
              </div>

              <h1 className="text-5xl font-bold leading-tight text-white">
                Hi,
                <span className="text-yellow-400">
                  {" "}
                  {user?.firstName || "Developer"}
                </span>
              </h1>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                Practice coding interviews with AI, receive instant
                feedback, improve communication, strengthen DSA skills,
                and prepare for your dream company.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
                <BrainCircuit
                  className="mb-3 text-yellow-400"
                  size={34}
                />

                <h3 className="text-[11px] font-medium text-white">
                  AI Questions
                </h3>

                <p className="mt-2 text-xs text-zinc-500">
                  Dynamic questions generated every interview.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
                <Trophy
                  className="mb-3 text-yellow-400"
                  size={34}
                />

                <h3 className="text-[11px] font-medium text-white">
                  Instant Report
                </h3>

                <p className="mt-2 text-xs text-zinc-500">
                  Get score, strengths and weaknesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERVIEW HISTORY */}

        <section className="rounded-3xl border border-zinc-800 bg-[#101010] p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400">
                  <History size={20} className="text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Interview History
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Your recent AI interview performance.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={refreshHistory}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Refresh History
            </button>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#0d0d0d] px-6 py-10 text-center">
              <History size={32} className="mx-auto text-zinc-600" />
              <p className="mt-3 text-sm font-medium text-zinc-300">
                No completed interviews yet
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Complete your first interview and its score will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {history.slice(0, 6).map((item, index) => {
                const score = item?.overallScore ?? 0;
                const date = item?.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date unavailable";

                return (
                  <button
                    key={item?._id || index}
                    type="button"
                    onClick={() => handleHistoryClick(item?._id)}
                    className="group rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 text-left transition hover:border-yellow-500/50 hover:bg-[#121212]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item?.topicLabel || item?.topic || "Interview"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {item?.difficulty || "Medium"} •{" "}
                          {item?.questionCount || 0} questions
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-bold text-yellow-400">
                          {score}%
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                          Score
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#151515] p-3">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <CalendarDays size={13} />
                          <span className="text-[10px]">Date</span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-300">{date}</p>
                      </div>

                      <div className="rounded-xl bg-[#151515] p-3">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <BarChart3 size={13} />
                          <span className="text-[10px]">Grade</span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-white">
                          {item?.grade || "--"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500">
                      <Clock3 size={12} />
                      {item?.durationMinutes
                        ? `${item.durationMinutes} min`
                        : "Duration unavailable"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================
            HISTORY DETAILS DIALOG
            ========================================================= */}

        {historyDialogOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeHistoryDialog();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Interview history details"
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-[#0b0b0b] shadow-2xl"
              onMouseDown={(event) => event.stopPropagation()}
            >
              {/* DIALOG HEADER */}
              <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-[#101010] px-6 py-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-yellow-400">
                    Interview History
                  </p>

                  <h2 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">
                    {selectedHistoryInterview?.topicLabel ||
                      selectedHistoryInterview?.topic ||
                      "Interview Details"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeHistoryDialog}
                  className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-yellow-400 hover:text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* DIALOG BODY */}
              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                {historyLoading ? (
                  <div className="flex min-h-[360px] items-center justify-center">
                    <div className="text-center">
                      <Loader2
                        size={42}
                        className="mx-auto animate-spin text-yellow-400"
                      />
                      <p className="mt-4 text-sm text-zinc-400">
                        Loading interview details...
                      </p>
                    </div>
                  </div>
                ) : selectedHistoryInterview ? (
                  <div className="space-y-6">
                    {/* SUMMARY */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                          Score
                        </p>
                        <p className="mt-2 text-3xl font-bold text-yellow-400">
                          {selectedHistoryInterview.overallScore ?? 0}%
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                          Grade
                        </p>
                        <p className="mt-2 text-3xl font-bold text-white">
                          {selectedHistoryInterview.grade || "--"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                          Difficulty
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {selectedHistoryInterview.difficulty || "--"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
                        <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                          Questions
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {selectedHistoryInterview.questionCount ??
                            selectedHistoryInterview.questions?.length ??
                            selectedHistoryInterview.answers?.length ??
                            0}
                        </p>
                      </div>
                    </div>

                    {/* DATE / DURATION */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <CalendarDays size={14} />
                          <span className="text-[10px] uppercase tracking-wide">
                            Interview Date
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-zinc-200">
                          {selectedHistoryInterview.createdAt
                            ? new Date(
                                selectedHistoryInterview.createdAt,
                              ).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Date unavailable"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-[#111] p-5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Clock3 size={14} />
                          <span className="text-[10px] uppercase tracking-wide">
                            Duration
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-zinc-200">
                          {selectedHistoryInterview.durationMinutes
                            ? `${selectedHistoryInterview.durationMinutes} min`
                            : "Duration unavailable"}
                        </p>
                      </div>
                    </div>

                    {/* OVERALL ASSESSMENT */}
                    {selectedHistoryInterview.summary && (
                      <section className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
                        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-yellow-400">
                          Overall Assessment
                        </h3>

                        <p className="text-sm leading-7 text-zinc-300">
                          {selectedHistoryInterview.summary}
                        </p>
                      </section>
                    )}

                    {/* STRENGTHS / IMPROVEMENTS */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      <section className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
                        <h3 className="mb-5 text-[11px] font-medium uppercase tracking-wide text-green-400">
                          Strengths
                        </h3>

                        <div className="space-y-3">
                          {Array.isArray(
                            selectedHistoryInterview.strengths,
                          ) &&
                          selectedHistoryInterview.strengths.length > 0 ? (
                            selectedHistoryInterview.strengths.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle
                                    size={17}
                                    className="mt-1 shrink-0 text-green-400"
                                  />
                                  <p className="text-sm leading-6 text-zinc-300">
                                    {item}
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-zinc-600">
                              No strengths recorded.
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
                        <h3 className="mb-5 text-[11px] font-medium uppercase tracking-wide text-red-400">
                          Areas to Improve
                        </h3>

                        <div className="space-y-3">
                          {Array.isArray(
                            selectedHistoryInterview.areasToImprove,
                          ) &&
                          selectedHistoryInterview.areasToImprove.length > 0 ? (
                            selectedHistoryInterview.areasToImprove.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <X
                                    size={17}
                                    className="mt-1 shrink-0 text-red-400"
                                  />
                                  <p className="text-sm leading-6 text-zinc-300">
                                    {item}
                                  </p>
                                </div>
                              ),
                            )
                          ) : Array.isArray(
                              selectedHistoryInterview.weaknesses,
                            ) &&
                            selectedHistoryInterview.weaknesses.length > 0 ? (
                            selectedHistoryInterview.weaknesses.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <X
                                    size={17}
                                    className="mt-1 shrink-0 text-red-400"
                                  />
                                  <p className="text-sm leading-6 text-zinc-300">
                                    {item}
                                  </p>
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-zinc-600">
                              No improvement areas recorded.
                            </p>
                          )}
                        </div>
                      </section>
                    </div>

                    {/* QUESTIONS */}
                    <section>
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-[11px] font-medium uppercase tracking-wide text-yellow-400">
                          Question Analysis
                        </h3>

                        <span className="text-[10px] text-zinc-600">
                          {Array.isArray(
                            selectedHistoryInterview.questionAnalysis,
                          )
                            ? selectedHistoryInterview.questionAnalysis.length
                            : 0}{" "}
                          evaluated
                        </span>
                      </div>

                      {Array.isArray(
                        selectedHistoryInterview.questionAnalysis,
                      ) &&
                      selectedHistoryInterview.questionAnalysis.length > 0 ? (
                        <div className="space-y-5">
                          {selectedHistoryInterview.questionAnalysis.map(
                            (item, index) => (
                              <div
                                key={item.questionId ?? item.id ?? index}
                                className="rounded-2xl border border-zinc-800 bg-[#111] p-6"
                              >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-[10px] uppercase tracking-wide text-yellow-400">
                                      Question {index + 1}
                                    </p>

                                    <h4 className="mt-2 text-sm font-medium leading-7 text-white">
                                      {item.question ||
                                        selectedHistoryInterview.questions?.[
                                          index
                                        ]?.question ||
                                        "Question unavailable"}
                                    </h4>
                                  </div>

                                  <div className="shrink-0 rounded-full bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-400">
                                    {item.score ?? "--"}/10
                                  </div>
                                </div>

                                <div className="mt-5 rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5">
                                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-blue-400">
                                    Your Answer
                                  </p>

                                  <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                                    {item.candidateAnswer ||
                                      selectedHistoryInterview.answers?.[
                                        index
                                      ]?.candidateAnswer ||
                                      selectedHistoryInterview.answers?.[
                                        index
                                      ]?.answer ||
                                      "No answer recorded."}
                                  </p>
                                </div>

                                {item.feedback && (
                                  <div className="mt-5">
                                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-purple-400">
                                      Feedback
                                    </p>

                                    <p className="text-sm leading-7 text-zinc-400">
                                      {item.feedback}
                                    </p>
                                  </div>
                                )}

                                {item.whatWasGood && (
                                  <div className="mt-5">
                                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-green-400">
                                      What Was Good
                                    </p>

                                    <p className="text-sm leading-7 text-zinc-300">
                                      {item.whatWasGood}
                                    </p>
                                  </div>
                                )}

                                {item.whatToImprove && (
                                  <div className="mt-5">
                                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-red-400">
                                      What To Improve
                                    </p>

                                    <p className="text-sm leading-7 text-zinc-300">
                                      {item.whatToImprove}
                                    </p>
                                  </div>
                                )}

                                {item.correctAnswer && (
                                  <div className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5">
                                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-yellow-400">
                                      Ideal Answer
                                    </p>

                                    <p className="text-sm leading-7 text-zinc-300">
                                      {item.correctAnswer}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
                          <p className="text-sm text-zinc-500">
                            No detailed question analysis is available for
                            this interview.
                          </p>
                        </div>
                      )}
                    </section>

                    {/* FALLBACK ANSWERS */}
                    {(!Array.isArray(
                      selectedHistoryInterview.questionAnalysis,
                    ) ||
                      selectedHistoryInterview.questionAnalysis.length === 0) &&
                      Array.isArray(selectedHistoryInterview.answers) &&
                      selectedHistoryInterview.answers.length > 0 && (
                        <section>
                          <h3 className="mb-5 text-[11px] font-medium uppercase tracking-wide text-yellow-400">
                            Your Answers
                          </h3>

                          <div className="space-y-4">
                            {selectedHistoryInterview.answers.map(
                              (answer, index) => (
                                <div
                                  key={answer?.id ?? index}
                                  className="rounded-2xl border border-zinc-800 bg-[#111] p-5"
                                >
                                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                                    Question {index + 1}
                                  </p>

                                  <p className="mt-2 text-sm leading-7 text-white">
                                    {answer?.question ||
                                      selectedHistoryInterview.questions?.[
                                        index
                                      ]?.question ||
                                      "Question unavailable"}
                                  </p>

                                  <div className="mt-4 rounded-xl bg-[#0d0d0d] p-4">
                                    <p className="mb-2 text-[10px] uppercase tracking-wide text-blue-400">
                                      Your Answer
                                    </p>

                                    <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                                      {answer?.candidateAnswer ||
                                        answer?.answer ||
                                        (typeof answer === "string"
                                          ? answer
                                          : "No answer recorded.")}
                                    </p>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </section>
                      )}
                  </div>
                ) : (
                  <div className="flex min-h-[360px] items-center justify-center text-center">
                    <div>
                      <p className="text-sm text-zinc-400">
                        Interview details could not be loaded.
                      </p>

                      <button
                        type="button"
                        onClick={closeHistoryDialog}
                        className="mt-4 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-medium text-black"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOPICS */}

        <section>
          <span className="mb-6 block border-b border-zinc-800 py-2 text-3xl font-medium text-white">
            Choose Interview Topic
          </span>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic);
                  setShowCustomInput(false);
                }}
                className={`rounded-xl border p-4 text-center transition-all duration-200 ${
                  selectedTopic?.id === topic.id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-zinc-800 bg-[#101010] hover:border-yellow-500/40 hover:bg-zinc-900"
                }`}
              >
                <div className="text-xl">{topic.icon}</div>

                <span className="mt-3 block text-lg font-medium text-white">
                  {topic.label}
                </span>

                <p className="mt-1 text-xs text-zinc-500">
                  {topic.desc}
                </p>
              </button>
            ))}

            <button
              onClick={() => {
                setSelectedTopic(null);
                setShowCustomInput(true);
              }}
              className={`rounded-xl border p-4 text-center transition ${
                showCustomInput
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-zinc-800 bg-[#101010] hover:border-yellow-500/40 hover:bg-zinc-900"
              }`}
            >
              <div className="text-3xl">✍️</div>

              <h3 className="mt-3 text-[11px] font-medium text-white">
                Custom Topic
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Your own topic
              </p>
            </button>
          </div>

          {showCustomInput && (
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Example: Node.js, Redis, AWS..."
              className="mt-6 h-14 w-full rounded-xl border border-zinc-700 bg-[#101010] px-5 text-white outline-none focus:border-yellow-400"
            />
          )}
        </section>

        {/* SETTINGS */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* DIFFICULTY */}

          <section className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
            <span className="mb-5 block border-b border-zinc-800 py-2 text-3xl font-medium text-white">
              Difficulty
            </span>

            <div className="space-y-3">
              {[
                {
                  id: "Easy",
                  title: "Easy",
                  desc: "Beginner friendly questions",
                },
                {
                  id: "Medium",
                  title: "Medium",
                  desc: "Most recommended level",
                },
                {
                  id: "Hard",
                  title: "Hard",
                  desc: "Advanced interview round",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDifficulty(item.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    difficulty === item.id
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-zinc-700 hover:border-yellow-500/40 hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">
                      {item.title}
                    </span>

                    {difficulty === item.id && (
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* QUESTIONS */}

          <section className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
            <span className="mb-5 block border-b border-zinc-800 py-2 text-3xl font-medium text-white">
              Number of Questions
            </span>

            <div className="space-y-3">
              {QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    questionCount === count
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-zinc-700 hover:border-yellow-500/40 hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">
                      {count} Questions
                    </span>

                    {questionCount === count && (
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    )}
                  </div>

                  <p className="mt-1 text-base text-zinc-500">
                    {count === 3
                      ? "Quick Practice"
                      : count === 5
                        ? "Standard Interview"
                        : "Deep Interview"}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* SUMMARY */}

          <section className="rounded-2xl border border-zinc-800 bg-[#111] p-6">
            <span className="mb-5 block border-b border-zinc-800 py-2 text-3xl font-medium text-white">
              Interview Summary
            </span>

            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-zinc-700 bg-[#101010] p-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                  Topic
                </p>

                <p className="text-sm font-medium text-white">
                  {showCustomInput
                    ? customTopic || "Custom Topic"
                    : selectedTopic?.label || "-"}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-700 bg-[#101010] p-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                  Difficulty
                </p>

                <p className="text-sm font-medium text-white">
                  {difficulty}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-700 bg-[#101010] p-4">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                  Questions
                </p>

                <p className="text-sm font-medium text-white">
                  {questionCount}
                </p>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={
                (!selectedTopic && !customTopic.trim()) ||
                stage === "loading"
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-sm font-medium text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start Interview
              <ArrowRight size={18} />
            </button>
          </section>
        </div>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW SCREEN
  // =========================================================

  if (stage === "interview") {
    const question = questions[currentQuestionIndex];

    return (
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}

        <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-yellow-400">
                AI Interview
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Question {currentQuestionIndex + 1} /{" "}
                {questions.length}
              </h1>
            </div>

            <button
              onClick={() => {
                const enabled = !voiceEnabled;
                setVoiceEnabled(enabled);

                if (!enabled) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
              }}
              className="rounded-xl bg-zinc-900 p-3 text-zinc-300 transition hover:bg-zinc-800"
              title={
                voiceEnabled
                  ? "Disable AI voice"
                  : "Enable AI voice"
              }
            >
              {voiceEnabled ? (
                <Volume2 size={20} />
              ) : (
                <VolumeX size={20} />
              )}
            </button>
          </div>

          {/* PROGRESS */}

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-yellow-400 transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) /
                    Math.max(questions.length, 1)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* MAIN */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* CAMERA */}

          <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {cameraStatus === "active" ? (
                  <Camera
                    size={18}
                    className="text-green-400"
                  />
                ) : (
                  <CameraOff
                    size={18}
                    className="text-yellow-400"
                  />
                )}

                <h2 className="text-[11px] font-medium text-white">
                  Camera Preview
                </h2>
              </div>

              <span
                className={`text-[10px] ${
                  cameraStatus === "active"
                    ? "text-green-400"
                    : cameraStatus === "starting"
                      ? "text-yellow-400"
                      : "text-zinc-500"
                }`}
              >
                {cameraStatus === "active"
                  ? "LIVE"
                  : cameraStatus === "starting"
                    ? "Starting..."
                    : cameraStatus === "unavailable"
                      ? "Unavailable"
                      : "OFF"}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />

              {cameraStatus !== "active" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center">
                    {cameraStatus === "starting" ? (
                      <>
                        <Loader2
                          size={30}
                          className="mx-auto animate-spin text-yellow-400"
                        />

                        <p className="mt-3 text-xs text-zinc-400">
                          Starting camera...
                        </p>
                      </>
                    ) : cameraStatus === "unavailable" ? (
                      <>
                        <CameraOff
                          size={30}
                          className="mx-auto text-zinc-500"
                        />

                        <p className="mt-3 text-xs text-zinc-500">
                          Camera unavailable
                        </p>
                      </>
                    ) : (
                      <Camera
                        size={30}
                        className="mx-auto text-zinc-500"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QUESTION */}

          <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-8 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400">
                <BrainCircuit
                  className="text-black"
                  size={28}
                />
              </div>

              <div>
                <p className="text-[11px] text-yellow-400">
                  AI Interviewer
                </p>

                <h3 className="text-[11px] font-medium text-white">
                  IntelliView AI
                </h3>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6">
              <p className="text-base leading-8 text-zinc-200">
                {question?.question ||
                  "Question is loading..."}
              </p>
            </div>

            {isSpeaking && (
              <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400">
                <Volume2 size={15} />
                AI is speaking...
              </div>
            )}
          </div>
        </div>

        {/* ANSWER */}

        <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[11px] font-medium text-white">
              Your Answer
            </h2>

            <button
              onClick={toggleMic}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 transition ${
                isListening
                  ? "bg-red-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {isListening ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}

              {isListening
                ? "Stop Recording"
                : "Record"}
            </button>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => {
              setCurrentAnswer(e.target.value);
              recognitionTextRef.current = e.target.value;
            }}
            placeholder="Start speaking or type your answer here..."
            disabled={answerSubmitted}
            className="min-h-55 w-full rounded-2xl border border-zinc-700 bg-[#0d0d0d] p-5 text-white outline-none focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
          />

          <div className="mt-6 flex justify-end gap-4">
            {!answerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-[11px] font-medium text-black"
              >
                <Send size={18} />
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-[11px] font-medium text-white"
              >
                {currentQuestionIndex ===
                questions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}

                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (stage === "loading") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-12 text-center">
          <Loader2
            className="mx-auto animate-spin text-yellow-400"
            size={60}
          />

          <h2 className="mt-8 text-3xl font-bold text-white">
            AI is Working...
          </h2>

          <p className="mt-4 text-xs text-zinc-500">
            Please wait while IntelliView prepares your
            interview and evaluates your answers.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // REPORT
  // =========================================================

  if (stage === "report") {
    const overallScore = report?.overallScore ?? 0;

    const strengths = Array.isArray(report?.strengths)
      ? report.strengths
      : [];

    const areasToImprove = Array.isArray(report?.areasToImprove)
      ? report.areasToImprove
      : Array.isArray(report?.weaknesses)
        ? report.weaknesses
        : [];

    const questionAnalysis = Array.isArray(
      report?.questionAnalysis,
    )
      ? report.questionAnalysis
      : [];

    return (
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}

        <section className="rounded-3xl border border-zinc-800 bg-[#101010] p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400">
            <Trophy
              className="text-black"
              size={40}
            />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-white">
            Interview Completed
          </h1>

          <p className="mt-3 text-xs text-zinc-500">
            Great work! Here's your AI performance report.
          </p>

          {report?.grade && (
            <div className="mt-5 inline-flex rounded-full border border-yellow-500/30 bg-yellow-400/10 px-5 py-2 text-yellow-400">
              Grade: {report.grade}
            </div>
          )}
        </section>

        {/* SCORE */}

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-[#101010] p-8 text-center">
            <p className="text-xs text-zinc-500">
              Overall Score
            </p>

            <h2 className="mt-3 text-5xl font-bold text-yellow-400">
              {overallScore}%
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#101010] p-8 text-center">
            <p className="text-xs text-zinc-500">
              Grade
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
              {report?.grade || "--"}
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#101010] p-8 text-center">
            <p className="text-xs text-zinc-500">
              Questions Evaluated
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
              {questionAnalysis.length}
            </h2>
          </div>
        </section>

        {/* SUMMARY */}

        {report?.summary && (
          <section className="rounded-3xl border border-zinc-800 bg-[#101010] p-8">
            <h2 className="mb-4 text-[11px] font-medium text-yellow-400">
              Overall Assessment
            </h2>

            <p className="leading-8 text-zinc-300">
              {report.summary}
            </p>
          </section>
        )}

        {/* STRENGTHS / IMPROVEMENTS */}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-8">
            <h2 className="mb-6 text-[11px] font-medium text-green-400">
              Strengths
            </h2>

            <div className="space-y-4">
              {strengths.length > 0 ? (
                strengths.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle
                      className="mt-1 shrink-0 text-green-400"
                      size={18}
                    />

                    <p className="text-zinc-300">
                      {item}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  No strengths reported.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#101010] p-8">
            <h2 className="mb-6 text-[11px] font-medium text-red-400">
              Areas to Improve
            </h2>

            <div className="space-y-4">
              {areasToImprove.length > 0 ? (
                areasToImprove.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <X
                      className="mt-1 shrink-0 text-red-400"
                      size={18}
                    />

                    <p className="text-zinc-300">
                      {item}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  No improvement areas reported.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* QUESTION ANALYSIS */}

        <section className="rounded-3xl border border-zinc-800 bg-[#101010] p-8">
          <h2 className="mb-6 text-[11px] font-medium text-yellow-400">
            Question Analysis
          </h2>

          <div className="space-y-6">
            {questionAnalysis.map((item, index) => (
              <div
                key={item.questionId ?? index}
                className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-sm font-medium text-white">
                    Question {index + 1}
                  </h3>

                  <div className="rounded-full bg-yellow-400/10 px-4 py-1 text-xs font-medium text-yellow-400">
                    Score: {item.score ?? "--"}/10
                  </div>
                </div>

                {item.feedback && (
                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {item.feedback}
                  </p>
                )}

                {item.whatWasGood && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-green-400">
                      What was good
                    </p>

                    <p className="text-sm leading-7 text-zinc-300">
                      {item.whatWasGood}
                    </p>
                  </div>
                )}

                {item.whatToImprove && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-red-400">
                      What to improve
                    </p>

                    <p className="text-sm leading-7 text-zinc-300">
                      {item.whatToImprove}
                    </p>
                  </div>
                )}

                {item.correctAnswer && (
                  <div className="mt-5 rounded-xl border border-zinc-800 bg-[#111] p-5">
                    <p className="mb-2 text-xs font-medium text-yellow-400">
                      Ideal Answer
                    </p>

                    <p className="text-sm leading-7 text-zinc-300">
                      {item.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ACTIONS */}

        <section className="flex flex-wrap justify-center gap-5 pb-12">
          <button
            onClick={handleReset}
            className="rounded-xl bg-yellow-400 px-8 py-4 text-[11px] font-medium text-black transition hover:scale-105"
          >
            Start New Interview
          </button>

          <button
            onClick={async () => {
              await refreshHistory();
              handleReset();
            }}
            className="rounded-xl border border-zinc-700 bg-[#111] px-8 py-4 text-white transition hover:border-yellow-400"
          >
            View History
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-zinc-700 bg-[#111] px-8 py-4 text-white transition hover:border-yellow-400"
          >
            Back to Dashboard
          </button>
        </section>
      </div>
    );
  }

  return null;
}

export default MockInterviewPage;