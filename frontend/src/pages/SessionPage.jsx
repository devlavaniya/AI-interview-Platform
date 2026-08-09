import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  useCreateSession,
  useEndSession,
  useJoinSessionByCode,
  useLeaveSession,
  useSessionById,
  useStartSession,
} from "../hooks/useSessions";

import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/executor";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import {
  Check,
  Copy,
  Loader2,
  Code2,
  Plus,
  ArrowLeft,
  LogIn,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import ProblemPanel from "@/components/session/ProblemPanel";

import { useQuery } from "@tanstack/react-query";
import { problemApi } from "../api/problems";

import useStreamClient from "../hooks/useStreamClient";

import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";

import VideoCallUI from "../components/VideoCallUI";

import toast from "react-hot-toast";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  // ==========================================================
  // STATE
  // ==========================================================

  const [output, setOutput] = useState(null);

  const [isRunning, setIsRunning] = useState(false);

  const [isAccepted, setIsAccepted] = useState(false);

  const [allProblems, setAllProblems] = useState([]);

  const [problemData, setProblemData] = useState(null);

  const [copiedCode, setCopiedCode] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const [code, setCode] = useState("");

  /*
   * Stream is NOT connected automatically.
   *
   * Host:
   *   connects after starting session.
   *
   * Participant:
   *   connects after host starts session.
   */
  const [shouldConnect, setShouldConnect] = useState(false);

  /*
   * Participant session code.
   */
  const [sessionCodeInput, setSessionCodeInput] = useState("");

  /*
   * Existing problem selection.
   */
  const [createProblem, setCreateProblem] = useState("");

  const [createDifficulty, setCreateDifficulty] = useState("medium");

  /*
   * Create session mode.
   *
   * existing = existing problem
   * ai       = AI generated problem
   */
  const [problemMode, setProblemMode] = useState("existing");

  /*
   * AI problem.
   */
  const [aiTopic, setAiTopic] = useState("");

  const [aiDifficulty, setAiDifficulty] = useState("medium");

  const [aiProblem, setAiProblem] = useState(null);

  const [isGeneratingProblem, setIsGeneratingProblem] = useState(false);

  // ==========================================================
  // SESSION
  // ==========================================================

  const {
    data: sessionData,
    isLoading: loadingSession,
    isError: sessionError,
    refetch,
  } = useSessionById(id);

  const session = sessionData?.session;

  const isHost = session?.host?.clerkId === user?.id;

  const isParticipant = session?.participant?.clerkId === user?.id;

  // ==========================================================
  // PROBLEMS
  // ==========================================================

  const {
    data: dbProblems,
    isLoading: loadingProblems,
    isError: problemsError,
    error: problemsErrorDetails,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
    staleTime: 30000,
    retry: 2,
  });

  // ==========================================================
  // MUTATIONS
  // ==========================================================

  const createSessionMutation = useCreateSession();

  const startSessionMutation = useStartSession();

  const joinByCodeMutation = useJoinSessionByCode();

  const endSessionMutation = useEndSession();

  const leaveSessionMutation = useLeaveSession();

  // ==========================================================
  // STREAM
  // ==========================================================

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(
      session,
      loadingSession,
      isHost,
      isParticipant,
      shouldConnect,
    );

  // ==========================================================
  // NORMALIZE PROBLEM
  // ==========================================================

  const normalizeProblem = (problem) => {
    if (!problem || !problem.title) {
      return null;
    }

    return {
      ...problem,

      /*
       * Make sure we always have a
       * usable identifier when possible.
       */
      problemId: problem._id || problem.id || problem.problemId || null,

      /*
       * Keep title consistent.
       */
      title:
        typeof problem.title === "string"
          ? problem.title.trim()
          : problem.title,
    };
  };

  // ==========================================================
  // EXTRACT DATABASE PROBLEMS
  // ==========================================================

  const extractDatabaseProblems = (response) => {
    if (!response) {
      return [];
    }

    /*
     * API returns:
     *
     * [
     *   {...},
     *   {...}
     * ]
     */
    if (Array.isArray(response)) {
      return response;
    }

    /*
     * API returns:
     *
     * {
     *   problems: [...]
     * }
     */
    if (Array.isArray(response.problems)) {
      return response.problems;
    }

    /*
     * API returns:
     *
     * {
     *   data: [...]
     * }
     */
    if (Array.isArray(response.data)) {
      return response.data;
    }

    /*
     * Some APIs return:
     *
     * {
     *   data: {
     *     problems: [...]
     *   }
     * }
     */
    if (Array.isArray(response.data?.problems)) {
      return response.data.problems;
    }

    return [];
  };

  // ==========================================================
  // LOAD + COMBINE PROBLEMS
  // ==========================================================

  useEffect(() => {
    /*
     * ========================================================
     * STATIC PROBLEMS
     * ========================================================
     */

    const staticProblems = Object.values(PROBLEMS || {})
      .map(normalizeProblem)
      .filter(Boolean);

    /*
     * ========================================================
     * DATABASE PROBLEMS
     * ========================================================
     */

    const rawDatabaseProblems = extractDatabaseProblems(dbProblems);

    const dynamicProblems = rawDatabaseProblems
      .map(normalizeProblem)
      .filter(Boolean);

    /*
     * ========================================================
     * COMBINE
     * ========================================================
     */

    const combined = [...staticProblems, ...dynamicProblems];

    /*
     * ========================================================
     * REMOVE DUPLICATES
     * ========================================================
     *
     * Prefer MongoDB _id.
     *
     * Otherwise use static id.
     *
     * Finally use title.
     */

    const uniqueMap = new Map();

    combined.forEach((problem) => {
      const key =
        problem._id || problem.id || problem.problemId || problem.title;

      if (!key) {
        return;
      }

      /*
       * If the same problem exists in
       * static + database, database
       * version wins.
       */

      if (!uniqueMap.has(key) || problem._id) {
        uniqueMap.set(key, problem);
      }
    });

    const uniqueProblems = Array.from(uniqueMap.values());

    /*
     * ========================================================
     * SET PROBLEMS
     * ========================================================
     */

    setAllProblems(uniqueProblems);

    /*
     * ========================================================
     * DEFAULT PROBLEM
     * ========================================================
     *
     * Do NOT continuously overwrite
     * user's selection.
     */

    setCreateProblem((current) => {
      if (
        current &&
        uniqueProblems.some((problem) => problem.title === current)
      ) {
        return current;
      }

      return uniqueProblems[0]?.title || "";
    });

    /*
     * ========================================================
     * CURRENT SESSION PROBLEM
     * ========================================================
     */

    if (session?.problem) {
      const sessionProblem = String(session.problem).trim();

      const foundProblem = uniqueProblems.find((problem) => {
        const problemId = problem._id || problem.id || problem.problemId;

        return (
          String(problem.title).trim() === sessionProblem ||
          String(problemId || "") === sessionProblem
        );
      });

      if (foundProblem) {
        setProblemData(foundProblem);
      } else {
        /*
         * Important debugging information.
         */

        console.warn("Session problem was not found.", {
          sessionProblem,
          availableProblems: uniqueProblems.map((problem) => ({
            id: problem._id || problem.id || problem.problemId,
            title: problem.title,
          })),
        });
      }
    }

    /*
     * ========================================================
     * DEBUG
     * ========================================================
     */

    console.log("========== PROBLEM DEBUG ==========");

    console.log("Static problems:", staticProblems);

    console.log("Raw DB response:", dbProblems);

    console.log("Database problems:", dynamicProblems);

    console.log("Combined problems:", combined);

    console.log("Unique problems:", uniqueProblems);

    console.log("Current session problem:", session?.problem);

    console.log("Current selected problem:", problemData);

    console.log("===================================");
  }, [dbProblems, session?.problem]);

  // ==========================================================
  // PROBLEM API ERROR DEBUG
  // ==========================================================

  useEffect(() => {
    if (problemsError && problemsErrorDetails) {
      console.error("Problem API error:", problemsErrorDetails);
    }
  }, [problemsError, problemsErrorDetails]);

  // ==========================================================
  // INITIAL CODE
  // ==========================================================

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    } else {
      setCode("");
    }

    setOutput(null);
    setIsAccepted(false);
  }, [problemData, selectedLanguage]);

  // ==========================================================
  // SESSION STATUS
  // ==========================================================

  useEffect(() => {
    if (!session) {
      return;
    }

    /*
     * Completed session.
     */

    if (session.status === "completed") {
      setShouldConnect(false);

      navigate("/dashboard");

      return;
    }

    /*
     * Host starts the session.
     */

    if (isHost && session.status === "active") {
      setShouldConnect(true);
    }

    /*
     * Participant connects only
     * after host starts session.
     */

    if (isParticipant && session.status === "active") {
      setShouldConnect(true);
    }
  }, [session, isHost, isParticipant, navigate]);

  // ==========================================================
  // GENERATE AI PROBLEM
  // ==========================================================

  const handleGenerateAIProblem = async () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a topic");

      return;
    }

    try {
      setIsGeneratingProblem(true);

      const result = await problemApi.generateCustomProblem(
        aiTopic.trim(),
        aiDifficulty,
      );

      const generated =
        result?.problem || result?.data?.problem || result?.data || result;

      if (!generated) {
        toast.error("AI did not return a problem");

        return;
      }

      setAiProblem(generated);

      toast.success("Problem generated successfully");
    } catch (error) {
      console.error("AI problem generation error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to generate problem",
      );
    } finally {
      setIsGeneratingProblem(false);
    }
  };

  // ==========================================================
  // CREATE NEW SESSION
  // ==========================================================

  const handleCreateNewSession = async () => {
    let problemTitle = "";

    /*
     * EXISTING PROBLEM
     */

    if (problemMode === "existing") {
      problemTitle = createProblem;
    }

    /*
     * AI PROBLEM
     */

    if (problemMode === "ai") {
      problemTitle = aiProblem?.title || aiProblem?.problem?.title || "";
    }

    if (!problemTitle) {
      toast.error(
        problemMode === "ai"
          ? "Please generate a problem first"
          : "Please select a problem",
      );

      return;
    }

    try {
      const result = await createSessionMutation.mutateAsync({
        problem: problemTitle,

        difficulty: problemMode === "ai" ? aiDifficulty : createDifficulty,
      });

      const newSession = result?.session;

      if (!newSession?._id) {
        toast.error("Session was created but no session ID was returned");

        return;
      }

      toast.success("Session created successfully");

      setShouldConnect(false);

      navigate(`/session/${newSession._id}`);
    } catch (error) {
      console.error("Create session error:", error);
    }
  };

  // ==========================================================
  // JOIN BY CODE
  // ==========================================================

  const handleJoinByCode = async () => {
    const code = sessionCodeInput.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter the session code");

      return;
    }

    if (code.length !== 8) {
      toast.error("Session code must contain 8 characters");

      return;
    }

    try {
      const result = await joinByCodeMutation.mutateAsync(code);

      const joinedSession = result?.session;

      if (!joinedSession?._id) {
        toast.error("Invalid session response");

        return;
      }

      setShouldConnect(false);

      navigate(`/session/${joinedSession._id}`);
    } catch (error) {
      console.error("Join by code error:", error);
    }
  };

  // ==========================================================
  // START SESSION - HOST
  // ==========================================================

  const handleStartSession = async () => {
    if (!id) {
      toast.error("Session ID is missing");

      return;
    }

    try {
      await startSessionMutation.mutateAsync(id);

      setShouldConnect(true);

      await refetch();
    } catch (error) {
      console.error("Start session error:", error);
    }
  };

  // ==========================================================
  // CODE SYNC
  // ==========================================================

  const syncCodeChange = async (newCode, language) => {
    if (!channel || !user?.id) {
      return;
    }

    try {
      await channel.sendMessage({
        text: `Code updated by ${user.firstName || "User"}`,

        code_content: newCode,

        code_language: language,

        sync_type: "code_change",
      });
    } catch (error) {
      console.error("Failed to sync code:", error);
    }
  };

  // ==========================================================
  // RECEIVE STREAM EVENTS
  // ==========================================================

  useEffect(() => {
    if (!channel || !user?.id) {
      return;
    }

    const handleNewMessage = (event) => {
      const message = event.message;

      if (message.user?.id === user.id) {
        return;
      }

      if (message.sync_type === "code_change") {
        if (message.code_content !== undefined) {
          setCode(message.code_content);
        }

        if (message.code_language) {
          setSelectedLanguage(message.code_language);
        }
      } else if (message.sync_type === "output_change") {
        if (message.output_result) {
          try {
            const outputData = JSON.parse(message.output_result);

            setOutput(outputData);
          } catch (error) {
            console.error("Failed to parse output:", error);
          }
        }
      } else if (message.sync_type === "accepted_change") {
        if (message.accepted_status) {
          setIsAccepted(true);
        }
      }
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
    };
  }, [channel, user?.id]);

  // ==========================================================
  // LANGUAGE CHANGE
  // ==========================================================

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;

    setSelectedLanguage(newLanguage);

    const starterCode = problemData?.starterCode?.[newLanguage] || "";

    setCode(starterCode);

    setOutput(null);

    syncCodeChange(starterCode, newLanguage);
  };

  // ==========================================================
  // CODE CHANGE
  // ==========================================================

  const handleCodeChange = (value) => {
    const newCode = value || "";

    setCode(newCode);

    clearTimeout(window.codeChangeTimeout);

    window.codeChangeTimeout = setTimeout(() => {
      syncCodeChange(newCode, selectedLanguage);
    }, 500);
  };

  // ==========================================================
  // OUTPUT SYNC
  // ==========================================================

  const syncOutput = async (outputResult) => {
    if (!channel || !user?.id) {
      return;
    }

    try {
      await channel.sendMessage({
        text: `Code executed by ${user.firstName || "User"}`,

        output_result: JSON.stringify(outputResult),

        sync_type: "output_change",
      });
    } catch (error) {
      console.error("Failed to sync output:", error);
    }
  };

  // ==========================================================
  // ACCEPTED SYNC
  // ==========================================================

  const syncAccepted = async (accepted) => {
    if (!channel || !user?.id) {
      return;
    }

    try {
      await channel.sendMessage({
        text: `Problem ${accepted ? "solved" : "attempted"} by ${
          user.firstName || "User"
        }`,

        accepted_status: accepted,

        sync_type: "accepted_change",
      });
    } catch (error) {
      console.error("Failed to sync accepted status:", error);
    }
  };

  // ==========================================================
  // RUN CODE
  // ==========================================================

  const handleRunCode = async () => {
    setIsRunning(true);

    setOutput(null);

    setIsAccepted(false);

    try {
      const result = await executeCode(selectedLanguage, code);

      setOutput(result);

      let accepted = false;

      if (result.success && problemData?.expectedOutput?.[selectedLanguage]) {
        const expectedOutput =
          problemData.expectedOutput[selectedLanguage].trim();

        const actualOutput = result.output.trim();

        if (actualOutput === expectedOutput) {
          setIsAccepted(true);

          accepted = true;
        }
      }

      await syncOutput(result);

      if (accepted) {
        await syncAccepted(true);
      }
    } catch (error) {
      console.error("Code execution failed:", error);

      setOutput({
        success: false,
        output: "Failed to execute code.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // ==========================================================
  // END SESSION
  // ==========================================================

  const handleEndSession = async () => {
    if (!id) {
      toast.error("Session ID is missing");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to end this session?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await endSessionMutation.mutateAsync(id);

      setShouldConnect(false);

      navigate("/dashboard");
    } catch (error) {
      console.error("End session error:", error);
    }
  };

  // ==========================================================
  // LEAVE SESSION
  // ==========================================================

  const handleLeaveSession = async () => {
    if (!id) {
      toast.error("Session ID is missing");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to leave this session?",
    );

    if (!confirmed) {
      return;
    }

    try {
      /*
       * Host uses End Session.
       */

      if (!isParticipant) {
        navigate("/dashboard");

        return;
      }

      await leaveSessionMutation.mutateAsync(id);

      setShouldConnect(false);

      navigate("/dashboard");
    } catch (error) {
      console.error("Leave session error:", error);
    }
  };

  // ==========================================================
  // COPY SESSION CODE
  // ==========================================================

  const handleCopySessionCode = async () => {
    if (!session?.sessionCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(session.sessionCode);

      setCopiedCode(true);

      toast.success("Session code copied");

      setTimeout(() => {
        setCopiedCode(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // ==========================================================
  // LOADING SESSION
  // ==========================================================

  if (loadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090909]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-7 w-7 animate-spin text-yellow-400" />

          <p className="mt-3 text-sm text-zinc-500">Checking session...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // SESSION NOT FOUND
  // ==========================================================

  if (!session || sessionError) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-[#090909] text-white">
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
          <div className="w-full max-w-2xl">
            {/* HEADER */}

            <div className="mb-8 text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-yellow-400/10
                "
              >
                <Code2 className="h-5 w-5 text-yellow-400" />
              </div>

              <h1 className="mt-5 text-2xl font-semibold text-white">
                Start an Interview
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Create a new interview session or join an existing session using
                an interview code.
              </p>
            </div>

            {/* OPTIONS */}

            <div className="grid gap-4 md:grid-cols-2">
              {/* CREATE SESSION */}

              <div
                className="
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-[#111111]
                  p-6
                  shadow-xl
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-yellow-400/10
                  "
                >
                  <Plus className="h-5 w-5 text-yellow-400" />
                </div>

                <h2 className="mt-4 text-base font-semibold">Create Session</h2>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Use an existing problem or generate one with AI.
                </p>

                {/* MODE SWITCH */}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProblemMode("existing")}
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-xs
                      font-medium
                      transition
                      ${
                        problemMode === "existing"
                          ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                          : "border-zinc-800 bg-[#090909] text-zinc-500 hover:text-zinc-300"
                      }
                    `}
                  >
                    Existing Problem
                  </button>

                  <button
                    type="button"
                    onClick={() => setProblemMode("ai")}
                    className={`
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-xs
                      font-medium
                      transition
                      ${
                        problemMode === "ai"
                          ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                          : "border-zinc-800 bg-[#090909] text-zinc-500 hover:text-zinc-300"
                      }
                    `}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Problem
                  </button>
                </div>

                {/* EXISTING PROBLEM */}

                {problemMode === "existing" && (
                  <>
                    <div className="mt-5">
                      <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                        Problem
                      </label>

                      <select
                        value={createProblem}
                        onChange={(event) =>
                          setCreateProblem(event.target.value)
                        }
                        disabled={loadingProblems}
                        className="
                          w-full
                          rounded-lg
                          border
                          border-zinc-800
                          bg-[#090909]
                          px-3
                          py-2.5
                          text-sm
                          text-white
                          outline-none
                          focus:border-yellow-400/50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {loadingProblems ? (
                          <option value="">Loading problems...</option>
                        ) : allProblems.length === 0 ? (
                          <option value="">No problems available</option>
                        ) : (
                          <>
                            <option value="">Select problem</option>

                            {allProblems.map((problem, index) => (
                              <option
                                key={
                                  problem._id ||
                                  problem.id ||
                                  problem.problemId ||
                                  `${problem.title}-${index}`
                                }
                                value={problem.title}
                              >
                                {problem.title}
                              </option>
                            ))}
                          </>
                        )}
                      </select>

                      {problemsError && (
                        <p className="mt-2 text-[11px] text-red-400">
                          Database problems could not be loaded. Static problems
                          are still available.
                        </p>
                      )}
                    </div>

                    {/* DIFFICULTY */}

                    <div className="mt-3">
                      <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                        Difficulty
                      </label>

                      <select
                        value={createDifficulty}
                        onChange={(event) =>
                          setCreateDifficulty(event.target.value)
                        }
                        className="
                          w-full
                          rounded-lg
                          border
                          border-zinc-800
                          bg-[#090909]
                          px-3
                          py-2.5
                          text-sm
                          text-white
                          outline-none
                          focus:border-yellow-400/50
                        "
                      >
                        <option value="easy">Easy</option>

                        <option value="medium">Medium</option>

                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </>
                )}

                {/* AI PROBLEM */}

                {problemMode === "ai" && (
                  <>
                    <div className="mt-5">
                      <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                        Topic
                      </label>

                      <input
                        value={aiTopic}
                        onChange={(event) => setAiTopic(event.target.value)}
                        placeholder="e.g. Binary Search"
                        className="
                          w-full
                          rounded-lg
                          border
                          border-zinc-800
                          bg-[#090909]
                          px-3
                          py-2.5
                          text-sm
                          text-white
                          outline-none
                          placeholder:text-zinc-700
                          focus:border-yellow-400/50
                        "
                      />
                    </div>

                    <div className="mt-3">
                      <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                        Difficulty
                      </label>

                      <select
                        value={aiDifficulty}
                        onChange={(event) =>
                          setAiDifficulty(event.target.value)
                        }
                        className="
                          w-full
                          rounded-lg
                          border
                          border-zinc-800
                          bg-[#090909]
                          px-3
                          py-2.5
                          text-sm
                          text-white
                          outline-none
                          focus:border-yellow-400/50
                        "
                      >
                        <option value="easy">Easy</option>

                        <option value="medium">Medium</option>

                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAIProblem}
                      disabled={isGeneratingProblem || !aiTopic.trim()}
                      className="
                        mt-4
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-yellow-400/30
                        bg-yellow-400/10
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-yellow-400
                        transition
                        hover:bg-yellow-400/20
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isGeneratingProblem ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate with AI
                        </>
                      )}
                    </button>

                    {aiProblem && (
                      <div
                        className="
                          mt-4
                          rounded-lg
                          border
                          border-zinc-800
                          bg-[#090909]
                          p-3
                        "
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                              Generated Problem
                            </p>

                            <p className="mt-1 truncate text-sm font-medium text-white">
                              {aiProblem.title ||
                                aiProblem.problem?.title ||
                                "AI Generated Problem"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleGenerateAIProblem}
                            disabled={isGeneratingProblem}
                            className="
                              shrink-0
                              rounded-md
                              p-1.5
                              text-zinc-500
                              hover:bg-zinc-800
                              hover:text-white
                            "
                            title="Generate another"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {(aiProblem.description ||
                          aiProblem.problem?.description) && (
                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">
                            {aiProblem.description ||
                              aiProblem.problem?.description}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* CREATE */}

                <button
                  onClick={handleCreateNewSession}
                  disabled={
                    createSessionMutation.isPending ||
                    (problemMode === "existing" && !createProblem) ||
                    (problemMode === "ai" && !aiProblem)
                  }
                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-yellow-400
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-yellow-300
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {createSessionMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Session
                    </>
                  )}
                </button>
              </div>

              {/* JOIN SESSION */}

              <div
                className="
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-[#111111]
                  p-6
                  shadow-xl
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-zinc-800
                  "
                >
                  <LogIn className="h-5 w-5 text-zinc-300" />
                </div>

                <h2 className="mt-4 text-base font-semibold">Join Session</h2>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Enter the 8-character code shared by the interviewer.
                </p>

                <input
                  value={sessionCodeInput}
                  onChange={(event) =>
                    setSessionCodeInput(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, ""),
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleJoinByCode();
                    }
                  }}
                  maxLength={8}
                  placeholder="XXXXXXXX"
                  className="
                    mt-6
                    w-full
                    rounded-lg
                    border
                    border-zinc-800
                    bg-[#090909]
                    px-3
                    py-3
                    text-center
                    font-mono
                    text-lg
                    tracking-[0.2em]
                    text-white
                    outline-none
                    placeholder:text-zinc-700
                    focus:border-yellow-400/50
                  "
                />

                <button
                  onClick={handleJoinByCode}
                  disabled={
                    joinByCodeMutation.isPending ||
                    sessionCodeInput.length !== 8
                  }
                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-zinc-700
                    bg-[#181818]
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-zinc-800
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {joinByCodeMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Join Session
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* BACK */}

            <button
              onClick={() => navigate("/dashboard")}
              className="
                mx-auto
                mt-6
                flex
                items-center
                gap-2
                text-xs
                text-zinc-600
                transition
                hover:text-zinc-300
              "
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // WAITING
  // ==========================================================

  const isWaiting = session.status === "waiting";

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#090909] text-white">
      {/* ======================================================
          WAITING LOBBY
      ======================================================= */}

      {isWaiting ? (
        <div className="flex flex-1 items-center justify-center bg-[#090909] p-6">
          {/* HOST */}

          {isHost && (
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] p-7 shadow-2xl">
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-yellow-400/10
                  "
                >
                  <Code2 className="h-5 w-5 text-yellow-400" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">Ready to start?</h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Share the session code with your interview participant.
                </p>
              </div>

              {/* SESSION CODE */}

              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#090909]
                  p-5
                  text-center
                "
              >
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Session Code
                </p>

                <p
                  className="
                    mt-2
                    font-mono
                    text-2xl
                    font-bold
                    tracking-[0.25em]
                    text-yellow-400
                  "
                >
                  {session.sessionCode}
                </p>
              </div>

              {/* COPY */}

              <button
                onClick={handleCopySessionCode}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#151515]
                  px-4
                  py-3
                  text-sm
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                "
              >
                {copiedCode ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Session Code
                  </>
                )}
              </button>

              {/* START */}

              <button
                onClick={handleStartSession}
                disabled={startSessionMutation.isPending}
                className="
                  mt-3
                  w-full
                  rounded-xl
                  bg-yellow-400
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-yellow-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {startSessionMutation.isPending
                  ? "Starting..."
                  : "Start Session"}
              </button>

              {/* CANCEL */}

              <button
                onClick={() => navigate("/dashboard")}
                className="
                  mt-3
                  w-full
                  px-4
                  py-2
                  text-xs
                  text-zinc-600
                  hover:text-zinc-300
                "
              >
                Cancel
              </button>
            </div>
          )}

          {/* PARTICIPANT */}

          {!isHost && (
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] p-7 shadow-2xl">
              {isParticipant ? (
                <div className="text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-yellow-400/10
                    "
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    Waiting for host
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    You have joined the interview. The session will start when
                    the host starts the interview.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-center">
                    <div
                      className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-yellow-400/10
                      "
                    >
                      <Code2 className="h-5 w-5 text-yellow-400" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                      Join Interview
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      Enter the code shared by the interviewer.
                    </p>
                  </div>

                  <input
                    value={sessionCodeInput}
                    onChange={(event) =>
                      setSessionCodeInput(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, ""),
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleJoinByCode();
                      }
                    }}
                    maxLength={8}
                    placeholder="XXXXXXXX"
                    className="
                      mt-6
                      w-full
                      rounded-xl
                      border
                      border-zinc-800
                      bg-[#090909]
                      px-4
                      py-4
                      text-center
                      font-mono
                      text-lg
                      tracking-[0.25em]
                      text-white
                      outline-none
                      placeholder:text-zinc-700
                      focus:border-yellow-400/50
                    "
                  />

                  <button
                    onClick={handleJoinByCode}
                    disabled={
                      joinByCodeMutation.isPending ||
                      sessionCodeInput.length !== 8
                    }
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      bg-yellow-400
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-black
                      transition
                      hover:bg-yellow-300
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {joinByCodeMutation.isPending
                      ? "Joining..."
                      : "Join Session"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ====================================================
           ACTIVE INTERVIEW
        ===================================================== */

        <div className="relative min-h-0 flex-1">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={100} minSize={60}>
              <PanelGroup direction="vertical">
                {/* PROBLEM */}

                <Panel defaultSize={42} minSize={20}>
                  <div className="h-full overflow-hidden bg-[#0b0b0b]">
                    <ProblemPanel
                      session={session}
                      problemData={problemData}
                      isAccepted={isAccepted}
                      isHost={isHost}
                      isParticipant={isParticipant}
                      copiedCode={copiedCode}
                      handleCopySessionCode={handleCopySessionCode}
                      handleEndSession={handleEndSession}
                      handleLeaveSession={handleLeaveSession}
                      endSessionMutation={endSessionMutation}
                      leaveSessionMutation={leaveSessionMutation}
                    />
                  </div>
                </Panel>

                <PanelResizeHandle
                  className="
                    h-1.5
                    cursor-row-resize
                    border-y
                    border-zinc-800
                    bg-[#111111]
                    hover:bg-yellow-400/30
                  "
                />

                {/* EDITOR + OUTPUT */}

                <Panel defaultSize={58} minSize={30}>
                  <PanelGroup direction="vertical">
                    {/* EDITOR */}

                    <Panel defaultSize={72} minSize={35}>
                      <div className="h-full overflow-hidden bg-[#090909]">
                        <CodeEditorPanel
                          selectedLanguage={selectedLanguage}
                          code={code}
                          isRunning={isRunning}
                          onLanguageChange={handleLanguageChange}
                          onCodeChange={handleCodeChange}
                          onRunCode={handleRunCode}
                        />
                      </div>
                    </Panel>

                    <PanelResizeHandle
                      className="
                        h-1.5
                        cursor-row-resize
                        border-y
                        border-zinc-800
                        bg-[#111111]
                        hover:bg-yellow-400/30
                      "
                    />

                    {/* OUTPUT */}

                    <Panel defaultSize={28} minSize={15}>
                      <div className="h-full overflow-hidden bg-[#0b0b0b]">
                        <OutputPanel output={output} />
                      </div>
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>

          {/* VIDEO */}

          {shouldConnect && streamClient && call && (
            <StreamVideo client={streamClient}>
              <StreamCall call={call}>
                <VideoCallUI chatClient={chatClient} channel={channel} />
              </StreamCall>
            </StreamVideo>
          )}

          {/* STREAM CONNECTING */}

          {shouldConnect && isInitializingCall && (
            <div
              className="
                  pointer-events-none
                  absolute
                  right-4
                  top-4
                  z-40
                "
            >
              <div
                className="
                    flex
                    h-[120px]
                    w-[120px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    shadow-xl
                  "
              >
                <Loader2
                  className="
                      h-5
                      w-5
                      animate-spin
                      text-yellow-400
                    "
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionPage;
