// src/components/CreateSessionsModal.jsx

import { useEffect, useState } from "react";
import { X, Plus, Loader2, Sparkles, Code2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { problemApi } from "../api/problems";
import { PROBLEMS } from "../data/problems";

function CreateSessionsModal({
  isOpen,
  onClose,
  onCreate,
  isCreating = false,
}) {
  const [problemMode, setProblemMode] = useState("existing");

  const [selectedProblem, setSelectedProblem] = useState("");

  const [difficulty, setDifficulty] = useState("medium");

  const [aiTopic, setAiTopic] = useState("");

  const [aiDifficulty, setAiDifficulty] = useState("medium");

  const [aiProblem, setAiProblem] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);

  // ==========================================================
  // GET PROBLEMS
  // ==========================================================

  const {
    data: problemResponse,
    isLoading: isLoadingProblems,
    isError: isProblemsError,
    error: problemsError,
    refetch: refetchProblems,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
    enabled: isOpen,
    staleTime: 30000,
  });

  // ==========================================================
  // COMBINE PROBLEMS
  // ==========================================================

  const [allProblems, setAllProblems] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // --------------------------------------------------------
    // STATIC PROBLEMS
    // --------------------------------------------------------

    const staticProblems = Object.values(PROBLEMS || {}).filter(
      (problem) => problem && problem.title,
    );

    // --------------------------------------------------------
    // DATABASE PROBLEMS
    // --------------------------------------------------------

    const databaseProblems = Array.isArray(problemResponse?.problems)
      ? problemResponse.problems
      : [];

    // --------------------------------------------------------
    // COMBINE
    // --------------------------------------------------------

    const combinedProblems = [...staticProblems, ...databaseProblems];

    // --------------------------------------------------------
    // REMOVE DUPLICATES
    // --------------------------------------------------------

    const uniqueProblems = Array.from(
      new Map(
        combinedProblems.map((problem) => [
          String(problem.id || problem._id || problem.title)
            .trim()
            .toLowerCase(),

          problem,
        ]),
      ).values(),
    );

    setAllProblems(uniqueProblems);

    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    console.log("========== CREATE SESSION PROBLEMS ==========");

    console.log("Raw API response:", problemResponse);

    console.log("Database problems:", databaseProblems);

    console.log("Static problems:", staticProblems);

    console.log("Final problems:", uniqueProblems);

    console.log("Problem count:", uniqueProblems.length);

    console.log("=============================================");
  }, [isOpen, problemResponse]);

  // ==========================================================
  // RESET MODAL
  // ==========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setProblemMode("existing");
    setSelectedProblem("");
    setDifficulty("medium");

    setAiTopic("");
    setAiDifficulty("medium");
    setAiProblem(null);
    setIsGenerating(false);

    refetchProblems();
  }, [isOpen, refetchProblems]);

  // ==========================================================
  // SELECT PROBLEM
  // ==========================================================

  const handleProblemChange = (event) => {
    const value = event.target.value;

    setSelectedProblem(value);

    const selected = allProblems.find((problem) => problem.title === value);

    if (selected) {
      const selectedDifficulty = String(
        selected.difficulty || "medium",
      ).toLowerCase();

      if (["easy", "medium", "hard"].includes(selectedDifficulty)) {
        setDifficulty(selectedDifficulty);
      }
    }
  };

  // ==========================================================
  // AI GENERATE PROBLEM
  // ==========================================================

  const handleGenerateAIProblem = async () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a topic");

      return;
    }

    try {
      setIsGenerating(true);

      const response = await problemApi.generateCustomProblem(
        aiTopic.trim(),
        aiDifficulty,
      );

      const generated =
        response?.problem ||
        response?.data?.problem ||
        response?.data ||
        response;

      if (!generated) {
        toast.error("AI did not return a problem");

        return;
      }

      setAiProblem(generated);

      toast.success("AI problem generated successfully");
    } catch (error) {
      console.error("AI problem generation error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to generate problem",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // ==========================================================
  // CREATE SESSION
  // ==========================================================

  const handleCreate = async () => {
    let problemTitle = "";
    let selectedDifficulty = difficulty;

    // --------------------------------------------------------
    // EXISTING PROBLEM
    // --------------------------------------------------------

    if (problemMode === "existing") {
      problemTitle = selectedProblem;

      if (!problemTitle) {
        toast.error("Please select a problem");

        return;
      }

      const selected = allProblems.find(
        (problem) => problem.title === selectedProblem,
      );

      if (selected) {
        const normalizedDifficulty = String(
          selected.difficulty || difficulty,
        ).toLowerCase();

        if (["easy", "medium", "hard"].includes(normalizedDifficulty)) {
          selectedDifficulty = normalizedDifficulty;
        }
      }
    }

    // --------------------------------------------------------
    // AI PROBLEM
    // --------------------------------------------------------

    if (problemMode === "ai") {
      problemTitle = aiProblem?.title || aiProblem?.problem?.title || "";

      if (!problemTitle) {
        toast.error("Please generate an AI problem first");

        return;
      }

      selectedDifficulty = aiDifficulty;
    }

    // --------------------------------------------------------
    // FINAL VALIDATION
    // --------------------------------------------------------

    if (!problemTitle) {
      toast.error("Please select or generate a problem");

      return;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    try {
      await onCreate({
        problem: problemTitle,
        difficulty: selectedDifficulty,
        aiGenerated: problemMode === "ai",
        aiProblem: problemMode === "ai" ? aiProblem : null,
      });

      // Parent controls closing/navigation.
    } catch (error) {
      console.error("Create session error:", error);
    }
  };

  // ==========================================================
  // CLOSED
  // ==========================================================

  if (!isOpen) {
    return null;
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800
          bg-[#101010]
          shadow-2xl
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-800
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-yellow-400/10
              "
            >
              <Code2 className="h-4 w-4 text-yellow-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Create Interview Session
              </h2>

              <p className="text-[11px] text-zinc-600">
                Choose a coding problem
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-zinc-500
              transition
              hover:bg-zinc-800
              hover:text-white
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="space-y-5 p-5">
          {/* ==================================================
              MODE
          ================================================== */}

          <div>
            <label className="mb-2 block text-[11px] font-medium text-zinc-500">
              Problem Source
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProblemMode("existing")}
                className={`
                  rounded-lg
                  border
                  px-3
                  py-2.5
                  text-xs
                  font-medium
                  transition
                  ${
                    problemMode === "existing"
                      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                      : "border-zinc-800 bg-[#151515] text-zinc-500 hover:text-white"
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
                  gap-2
                  rounded-lg
                  border
                  px-3
                  py-2.5
                  text-xs
                  font-medium
                  transition
                  ${
                    problemMode === "ai"
                      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                      : "border-zinc-800 bg-[#151515] text-zinc-500 hover:text-white"
                  }
                `}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate with AI
              </button>
            </div>
          </div>

          {/* ==================================================
              EXISTING PROBLEM
          ================================================== */}

          {problemMode === "existing" && (
            <>
              <div>
                <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                  Select Problem
                </label>

                {isLoadingProblems ? (
                  <div
                    className="
                      flex
                      h-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#090909]
                      text-xs
                      text-zinc-500
                    "
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-yellow-400" />
                    Loading problems...
                  </div>
                ) : isProblemsError ? (
                  <div
                    className="
                      rounded-lg
                      border
                      border-red-500/20
                      bg-red-500/5
                      p-3
                      text-xs
                      text-red-400
                    "
                  >
                    Failed to load problems.
                    <button
                      type="button"
                      onClick={() => refetchProblems()}
                      className="
                        ml-2
                        underline
                        hover:no-underline
                      "
                    >
                      Retry
                    </button>
                  </div>
                ) : allProblems.length === 0 ? (
                  <div
                    className="
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#090909]
                      p-4
                      text-center
                    "
                  >
                    <p className="text-xs text-zinc-500">
                      No problems available.
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-700">
                      Create a problem from the Problems page first.
                    </p>
                  </div>
                ) : (
                  <select
                    value={selectedProblem}
                    onChange={handleProblemChange}
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      bg-[#090909]
                      px-3
                      text-sm
                      text-white
                      outline-none
                      focus:border-yellow-400/50
                    "
                  >
                    <option value="">Select a problem</option>

                    {allProblems.map((problem, index) => (
                      <option
                        key={
                          problem._id ||
                          problem.id ||
                          `${problem.title}-${index}`
                        }
                        value={problem.title}
                      >
                        {problem.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* DIFFICULTY */}

              <div>
                <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-zinc-800
                    bg-[#090909]
                    px-3
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

          {/* ==================================================
              AI
          ================================================== */}

          {problemMode === "ai" && (
            <>
              <div>
                <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                  Topic
                </label>

                <input
                  value={aiTopic}
                  onChange={(event) => setAiTopic(event.target.value)}
                  placeholder="e.g. Arrays, Graphs, Dynamic Programming"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-zinc-800
                    bg-[#090909]
                    px-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-zinc-700
                    focus:border-yellow-400/50
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                  Difficulty
                </label>

                <select
                  value={aiDifficulty}
                  onChange={(event) => setAiDifficulty(event.target.value)}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-zinc-800
                    bg-[#090909]
                    px-3
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
                disabled={isGenerating || !aiTopic.trim()}
                className="
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
                  text-xs
                  font-semibold
                  text-yellow-400
                  transition
                  hover:bg-yellow-400/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Problem
                  </>
                )}
              </button>

              {aiProblem && (
                <div
                  className="
                    rounded-lg
                    border
                    border-zinc-800
                    bg-[#090909]
                    p-4
                  "
                >
                  <div className="text-xs font-semibold text-white">
                    {aiProblem.title ||
                      aiProblem.problem?.title ||
                      "Generated Problem"}
                  </div>

                  <div className="mt-1 text-[11px] text-zinc-500">
                    AI generated problem is ready.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            border-t
            border-zinc-800
            px-5
            py-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-zinc-800
              bg-[#151515]
              px-4
              py-2.5
              text-xs
              font-medium
              text-zinc-400
              transition
              hover:bg-zinc-800
              hover:text-white
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              isCreating ||
              isLoadingProblems ||
              (problemMode === "existing" && !selectedProblem) ||
              (problemMode === "ai" && !aiProblem)
            }
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-yellow-400
              px-5
              py-2.5
              text-xs
              font-semibold
              text-black
              transition
              hover:bg-yellow-300
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {isCreating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Create Session
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionsModal;
