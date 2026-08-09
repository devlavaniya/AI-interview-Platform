import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  FileText,
  Loader2,
  Play,
  Terminal,
} from "lucide-react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { problemApi } from "../api/problems";
import { executeCode } from "../lib/executor";

function ProblemPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================================
  // STATE
  // ==========================================================

  const [problem, setProblem] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isRunning, setIsRunning] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const [code, setCode] = useState("");

  const [output, setOutput] = useState(null);

  const [isAccepted, setIsAccepted] = useState(false);

  const [copied, setCopied] = useState(false);

  // ==========================================================
  // LOAD PROBLEM
  // ==========================================================

  useEffect(() => {
    if (!id) {
      toast.error("Problem ID is missing");
      navigate("/problems");
      return;
    }

    const loadProblem = async () => {
      try {
        setIsLoading(true);

        console.log("Loading problem with ID:", id);

        const response = await problemApi.getProblemById(id);

        console.log("Problem API response:", response);

        /*
         * Backend currently returns:
         *
         * {
         *   problem: {...}
         * }
         *
         * But we also support:
         *
         * {
         *   data: {...}
         * }
         *
         * or directly:
         *
         * {...}
         */

        const loadedProblem =
          response?.problem ||
          response?.data?.problem ||
          response?.data ||
          response;

        if (!loadedProblem) {
          toast.error("Problem not found");

          navigate("/problems");

          return;
        }

        setProblem(loadedProblem);

        // ------------------------------------------------------
        // INITIAL CODE
        // ------------------------------------------------------

        const starterCode = loadedProblem?.starterCode?.python || "";

        setCode(starterCode);
      } catch (error) {
        console.error("Failed to load problem:", error);

        toast.error(error?.response?.data?.message || "Failed to load problem");

        navigate("/problems");
      } finally {
        setIsLoading(false);
      }
    };

    loadProblem();
  }, [id, navigate]);

  // ==========================================================
  // LANGUAGE CHANGE
  // ==========================================================

  const handleLanguageChange = (event) => {
    const language = event.target.value;

    setSelectedLanguage(language);

    const starterCode = problem?.starterCode?.[language] || "";

    setCode(starterCode);

    setOutput(null);
    setIsAccepted(false);
  };

  // ==========================================================
  // CODE CHANGE
  // ==========================================================

  const handleCodeChange = (event) => {
    setCode(event.target.value);

    setOutput(null);
    setIsAccepted(false);
  };

  // ==========================================================
  // RUN CODE
  // ==========================================================

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");

      return;
    }

    setIsRunning(true);
    setOutput(null);
    setIsAccepted(false);

    try {
      const result = await executeCode(selectedLanguage, code);

      console.log("Execution result:", result);

      setOutput(result);

      // ------------------------------------------------------
      // VALIDATE OUTPUT
      // ------------------------------------------------------

      const expectedOutput = problem?.expectedOutput?.[selectedLanguage];

      if (
        result?.success &&
        expectedOutput !== undefined &&
        expectedOutput !== null
      ) {
        const expected = String(expectedOutput).trim().replace(/\r\n/g, "\n");

        const actual = String(result.output || "")
          .trim()
          .replace(/\r\n/g, "\n");

        if (actual === expected) {
          setIsAccepted(true);

          toast.success("Accepted!");
        }
      }
    } catch (error) {
      console.error("Code execution failed:", error);

      setOutput({
        success: false,
        output: error?.message || "Failed to execute code.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // ==========================================================
  // COPY PROBLEM ID
  // ==========================================================

  const handleCopyId = async () => {
    if (!problem?.id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(problem.id);

      setCopied(true);

      toast.success("Problem ID copied");

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // ==========================================================
  // DIFFICULTY CLASS
  // ==========================================================

  const getDifficultyClass = (difficulty) => {
    const value = String(difficulty || "").toLowerCase();

    if (value === "easy") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
    }

    if (value === "medium") {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-400";
    }

    if (value === "hard") {
      return "border-red-400/20 bg-red-400/10 text-red-400";
    }

    return "border-zinc-800 bg-zinc-900 text-zinc-400";
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <Navbar />

        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-7 w-7 animate-spin text-yellow-400" />

            <p className="mt-3 text-sm text-zinc-500">Loading problem...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PROBLEM NOT FOUND
  // ==========================================================

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <Navbar />

        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10">
              <FileText className="h-5 w-5 text-red-400" />
            </div>

            <h1 className="mt-4 text-lg font-semibold">Problem not found</h1>

            <p className="mt-2 text-sm text-zinc-500">
              This problem may have been deleted.
            </p>

            <button
              onClick={() => navigate("/problems")}
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-yellow-400
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black
                hover:bg-yellow-300
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#090909] text-white">
      <Navbar />

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="shrink-0 border-b border-zinc-800 bg-[#0d0d0d]">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* BACK */}

            <button
              onClick={() => navigate("/problems")}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-800
                text-zinc-500
                transition
                hover:bg-zinc-800
                hover:text-white
              "
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* ICON */}

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-yellow-400/10
              "
            >
              <Code2 className="h-4 w-4 text-yellow-400" />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-white">
                  {problem.title}
                </h1>

                <span
                  className={`
                    shrink-0
                    rounded-md
                    border
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    ${getDifficultyClass(problem.difficulty)}
                  `}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-600">
                <span>{problem.category || "Programming"}</span>

                {problem.id && (
                  <>
                    <span>•</span>

                    <button
                      onClick={handleCopyId}
                      className="flex items-center gap-1 hover:text-zinc-300"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}

                      {problem.id}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="min-h-0 flex-1">
        <div className="mx-auto flex h-full max-w-[1600px]">
          {/* ==================================================
              LEFT - PROBLEM
          ================================================== */}

          <div className="min-w-0 flex-1 overflow-y-auto border-r border-zinc-800">
            <div className="max-w-4xl p-6 lg:p-8">
              {/* DESCRIPTION */}

              <section>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FileText className="h-4 w-4 text-yellow-400" />
                  Problem Description
                </h2>

                <div className="mt-4 text-sm leading-7 text-zinc-300">
                  {problem.description?.text ? (
                    <p className="whitespace-pre-wrap">
                      {problem.description.text}
                    </p>
                  ) : (
                    <p className="text-zinc-600">No description available.</p>
                  )}
                </div>
              </section>

              {/* NOTES */}

              {Array.isArray(problem.description?.notes) &&
                problem.description.notes.length > 0 && (
                  <section className="mt-8">
                    <h2 className="text-sm font-semibold text-white">Notes</h2>

                    <ul className="mt-3 space-y-2">
                      {problem.description.notes.map((note, index) => (
                        <li
                          key={index}
                          className="flex gap-2 text-sm leading-6 text-zinc-400"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />

                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* EXAMPLES */}

              {Array.isArray(problem.examples) &&
                problem.examples.length > 0 && (
                  <section className="mt-8">
                    <h2 className="text-sm font-semibold text-white">
                      Examples
                    </h2>

                    <div className="mt-4 space-y-4">
                      {problem.examples.map((example, index) => (
                        <div
                          key={index}
                          className="
                              overflow-hidden
                              rounded-xl
                              border
                              border-zinc-800
                              bg-[#0d0d0d]
                            "
                        >
                          <div className="border-b border-zinc-800 px-4 py-3">
                            <span className="text-xs font-medium text-zinc-500">
                              Example {index + 1}
                            </span>
                          </div>

                          <div className="space-y-4 p-4">
                            {example.input && (
                              <div>
                                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                  Input
                                </p>

                                <pre className="overflow-x-auto rounded-lg bg-[#080808] p-3 font-mono text-xs leading-6 text-zinc-300">
                                  {example.input}
                                </pre>
                              </div>
                            )}

                            {example.output && (
                              <div>
                                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                  Output
                                </p>

                                <pre className="overflow-x-auto rounded-lg bg-[#080808] p-3 font-mono text-xs leading-6 text-zinc-300">
                                  {example.output}
                                </pre>
                              </div>
                            )}

                            {example.explanation && (
                              <div>
                                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                  Explanation
                                </p>

                                <p className="text-sm leading-6 text-zinc-400">
                                  {example.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              {/* CONSTRAINTS */}

              {Array.isArray(problem.constraints) &&
                problem.constraints.length > 0 && (
                  <section className="mt-8">
                    <h2 className="text-sm font-semibold text-white">
                      Constraints
                    </h2>

                    <ul className="mt-3 space-y-2">
                      {problem.constraints.map((constraint, index) => (
                        <li
                          key={index}
                          className="
                              rounded-lg
                              border
                              border-zinc-800
                              bg-[#0d0d0d]
                              px-3
                              py-2
                              font-mono
                              text-xs
                              text-zinc-400
                            "
                        >
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
            </div>
          </div>

          {/* ==================================================
              RIGHT - CODE
          ================================================== */}

          <div className="flex w-[45%] min-w-[420px] flex-col bg-[#080808]">
            {/* CODE HEADER */}

            <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 px-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-yellow-400" />

                <span className="text-xs font-semibold text-zinc-300">
                  Solution
                </span>
              </div>

              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="
                  rounded-md
                  border
                  border-zinc-800
                  bg-[#111111]
                  px-2.5
                  py-1.5
                  text-xs
                  text-zinc-300
                  outline-none
                  focus:border-yellow-400/40
                "
              >
                <option value="python">Python</option>

                <option value="java">Java</option>

                <option value="cpp">C++</option>
              </select>
            </div>

            {/* CODE EDITOR */}

            <div className="min-h-0 flex-1 p-4">
              <textarea
                value={code}
                onChange={handleCodeChange}
                spellCheck="false"
                className="
                  h-full
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#0d0d0d]
                  p-4
                  font-mono
                  text-[13px]
                  leading-6
                  text-zinc-300
                  outline-none
                  focus:border-yellow-400/30
                "
                placeholder="Write your solution here..."
              />
            </div>

            {/* RUN BAR */}

            <div className="flex shrink-0 items-center justify-between border-t border-zinc-800 bg-[#0d0d0d] px-4 py-3">
              <div>
                {isAccepted ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                    Accepted
                  </span>
                ) : (
                  <span className="text-xs text-zinc-600">
                    Run your solution
                  </span>
                )}
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-yellow-400
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-black
                  transition
                  hover:bg-yellow-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Run Code
                  </>
                )}
              </button>
            </div>

            {/* OUTPUT */}

            <div className="h-[28%] min-h-[150px] shrink-0 border-t border-zinc-800">
              <div className="flex h-9 items-center border-b border-zinc-800 px-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                  Output
                </span>
              </div>

              <div className="h-[calc(100%-36px)] overflow-auto p-4">
                {!output ? (
                  <p className="text-xs text-zinc-700">
                    Output will appear here.
                  </p>
                ) : (
                  <pre
                    className={`
                      whitespace-pre-wrap
                      font-mono
                      text-xs
                      leading-6
                      ${output.success ? "text-zinc-300" : "text-red-400"}
                    `}
                  >
                    {output.output || output.message || "No output"}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;
