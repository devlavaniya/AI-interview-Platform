// src/pages/AddProblem.jsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  ArrowLeft,
  Code2,
  FileText,
  ListChecks,
  Terminal,
  Save,
  Loader2,
  Layers3,
  Sparkles,
} from "lucide-react";

import { problemApi } from "../api/problems";
import toast from "react-hot-toast";

function AddProblem() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);

  // ==========================================================
  // STATE
  // ==========================================================

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);

  const [form, setForm] = useState({
    id: "",
    title: "",
    difficulty: "easy",
    category: "",

    descriptionText: "",
    notes: "",

    examples: "",
    constraints: "",

    pyCode: "",
    javaCode: "",
    cppCode: "",

    pyOutput: "",
    javaOutput: "",
    cppOutput: "",
  });

  // ==========================================================
  // INPUT HANDLER
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // NORMALIZE DIFFICULTY
  // ==========================================================

  const normalizeDifficulty = (difficulty) => {
    const value = String(difficulty || "easy").toLowerCase();

    if (value === "medium") {
      return "medium";
    }

    if (value === "hard") {
      return "hard";
    }

    return "easy";
  };

  // ==========================================================
  // LOAD PROBLEM FOR EDITING
  // ==========================================================

  useEffect(() => {
    if (!editId) {
      return;
    }

    const loadProblem = async () => {
      try {
        setIsLoadingProblem(true);

        const response = await problemApi.getProblemById(editId);

        console.log("Problem loaded for editing:", response);

        const problem = response?.problem || response?.data || response;

        if (!problem) {
          toast.error("Problem not found");

          navigate("/problems");

          return;
        }

        // ====================================================
        // EXAMPLES
        // ====================================================

        const examples = Array.isArray(problem.examples)
          ? problem.examples
              .map((example) => {
                return [
                  example?.input || "",
                  example?.output || "",
                  example?.explanation ? example.explanation : "",
                ]
                  .filter((value) => value !== "")
                  .join("\n");
              })
              .join("\n\n")
          : "";

        // ====================================================
        // NOTES
        // ====================================================

        const notes = Array.isArray(problem.description?.notes)
          ? problem.description.notes.join("\n")
          : "";

        // ====================================================
        // CONSTRAINTS
        // ====================================================

        const constraints = Array.isArray(problem.constraints)
          ? problem.constraints.join("\n")
          : "";

        // ====================================================
        // SET FORM
        // ====================================================

        setForm({
          id: problem.id || "",

          title: problem.title || "",

          difficulty: normalizeDifficulty(problem.difficulty),

          category: problem.category || "",

          descriptionText: problem.description?.text || "",

          notes,

          examples,

          constraints,

          pyCode: problem.starterCode?.python || "",

          javaCode: problem.starterCode?.java || "",

          cppCode: problem.starterCode?.cpp || "",

          pyOutput: problem.expectedOutput?.python || "",

          javaOutput: problem.expectedOutput?.java || "",

          cppOutput: problem.expectedOutput?.cpp || "",
        });
      } catch (error) {
        console.error("Failed to load problem:", error);

        toast.error(error?.response?.data?.message || "Failed to load problem");

        navigate("/problems");
      } finally {
        setIsLoadingProblem(false);
      }
    };

    loadProblem();
  }, [editId, navigate]);

  // ==========================================================
  // PARSE EXAMPLES
  // ==========================================================

  const parseExamples = () => {
    if (!form.examples.trim()) {
      return [];
    }

    return form.examples
      .split(/\n\s*\n/)
      .map((example) => {
        const lines = example
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        return {
          input: lines[0] || "",
          output: lines[1] || "",
          explanation: lines[2] || "",
        };
      })
      .filter((example) => example.input || example.output);
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!form.id.trim()) {
      toast.error("Problem ID is required");

      return;
    }

    if (!form.title.trim()) {
      toast.error("Problem title is required");

      return;
    }

    if (!form.descriptionText.trim()) {
      toast.error("Problem description is required");

      return;
    }

    if (!form.category.trim()) {
      toast.error("Problem category is required");

      return;
    }

    // ========================================================
    // PREPARE DATA
    // ========================================================

    const problemData = {
      id: form.id.trim(),

      title: form.title.trim(),

      difficulty: normalizeDifficulty(form.difficulty),

      category: form.category.trim(),

      description: {
        text: form.descriptionText.trim(),

        notes: form.notes
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },

      examples: parseExamples(),

      constraints: form.constraints
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      starterCode: {
        python: form.pyCode,
        java: form.javaCode,
        cpp: form.cppCode,
      },

      expectedOutput: {
        python: form.pyOutput,
        java: form.javaOutput,
        cpp: form.cppOutput,
      },
    };

    console.log("Submitting problem:", problemData);

    // ========================================================
    // SAVE
    // ========================================================

    try {
      setIsLoading(true);

      if (isEditing) {
        await problemApi.updateProblem(editId, problemData);

        toast.success("Problem updated successfully!");
      } else {
        await problemApi.createProblem(problemData);

        toast.success("Problem created successfully!");
      }

      // Refresh problem list when user
      // reaches the Problems page.
      navigate("/problems");
    } catch (error) {
      console.error("Save problem error:", error);

      toast.error(error?.response?.data?.message || "Failed to save problem");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // STYLES
  // ==========================================================

  const inputClass = `
    h-10
    w-full
    rounded-lg
    border
    border-zinc-800
    bg-[#101010]
    px-3
    text-sm
    text-white
    outline-none
    transition
    placeholder:text-zinc-700
    focus:border-yellow-400/40
    focus:bg-[#121212]
  `;

  const textareaClass = `
    w-full
    rounded-xl
    border
    border-zinc-800
    bg-[#101010]
    p-4
    text-sm
    leading-6
    text-zinc-200
    outline-none
    transition
    placeholder:text-zinc-700
    focus:border-yellow-400/40
    focus:bg-[#121212]
  `;

  const codeClass = `
    w-full
    rounded-xl
    border
    border-zinc-800
    bg-[#080808]
    p-4
    font-mono
    text-[13px]
    leading-6
    text-zinc-300
    outline-none
    transition
    placeholder:text-zinc-700
    focus:border-yellow-400/40
  `;

  // ==========================================================
  // LOADING EDIT PAGE
  // ==========================================================

  if (isEditing && isLoadingProblem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <div className="flex flex-col items-center">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-[#111111]
            "
          >
            <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
          </div>

          <span className="mt-4 text-sm text-zinc-500">Loading problem...</span>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div
        className="
          sticky
          top-0
          z-40
          border-b
          border-zinc-800
          bg-[#090909]/95
          backdrop-blur
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-3
            lg:px-6
          "
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/problems")}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-800
                text-zinc-500
                transition
                hover:bg-zinc-900
                hover:text-white
              "
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

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

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {isEditing ? "Edit Problem" : "Create Problem"}
              </span>

              <span className="text-[11px] text-zinc-600">
                {isEditing
                  ? "Update coding challenge"
                  : "Add a new coding challenge"}
              </span>
            </div>
          </div>

          <span
            className="
              hidden
              rounded-md
              border
              border-yellow-400/20
              bg-yellow-400/10
              px-2.5
              py-1
              text-[10px]
              font-medium
              text-yellow-400
              sm:block
            "
          >
            Admin
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          max-w-7xl
          px-5
          py-6
          pb-32
          lg:px-6
        "
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
            <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10">
                <Layers3 className="h-4 w-4 text-blue-400" />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  Basic Information
                </div>

                <div className="text-[11px] text-zinc-600">
                  Define the problem identity
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {/* ID */}

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                    Problem ID
                  </label>

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="two-sum"
                    className={inputClass}
                  />

                  <span className="mt-1.5 block text-[10px] text-zinc-700">
                    Unique identifier used by the problem.
                  </span>
                </div>

                {/* TITLE */}

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                    Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Two Sum"
                    className={inputClass}
                  />
                </div>

                {/* DIFFICULTY */}

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="easy">Easy</option>

                    <option value="medium">Medium</option>

                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-zinc-500">
                    Category
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Array"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
            <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10">
                <FileText className="h-4 w-4 text-purple-400" />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  Problem Description
                </div>

                <div className="text-[11px] text-zinc-600">
                  Explain what the candidate needs to solve
                </div>
              </div>
            </div>

            <div className="p-5">
              <textarea
                name="descriptionText"
                value={form.descriptionText}
                onChange={handleChange}
                rows={8}
                placeholder="Describe the problem clearly..."
                className={textareaClass}
              />
            </div>
          </section>

          {/* =================================================
              NOTES + CONSTRAINTS
          ================================================= */}

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
              <div className="border-b border-zinc-800 px-5 py-4">
                <div className="text-sm font-semibold text-white">Notes</div>

                <div className="mt-1 text-[11px] text-zinc-600">
                  One note per line
                </div>
              </div>

              <div className="p-5">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={9}
                  placeholder={`The answer always exists.
Do not use the same element twice.`}
                  className={textareaClass}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
              <div className="border-b border-zinc-800 px-5 py-4">
                <div className="text-sm font-semibold text-white">
                  Constraints
                </div>

                <div className="mt-1 text-[11px] text-zinc-600">
                  One constraint per line
                </div>
              </div>

              <div className="p-5">
                <textarea
                  name="constraints"
                  value={form.constraints}
                  onChange={handleChange}
                  rows={9}
                  placeholder={`2 <= nums.length <= 10000
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9`}
                  className={`${textareaClass} font-mono text-[12px]`}
                />
              </div>
            </section>
          </div>

          {/* =================================================
              EXAMPLES
          ================================================= */}

          <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
            <div className="flex flex-col gap-3 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10">
                  <ListChecks className="h-4 w-4 text-yellow-400" />
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">
                    Examples
                  </div>

                  <div className="text-[11px] text-zinc-600">
                    Input, output and explanation
                  </div>
                </div>
              </div>

              <span className="w-fit rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] text-zinc-500">
                Separate examples with a blank line
              </span>
            </div>

            <div className="p-5">
              <textarea
                name="examples"
                value={form.examples}
                onChange={handleChange}
                rows={16}
                placeholder={`nums = [2,7,11,15], target = 9
[0,1]
nums[0] + nums[1] = 9

nums = [3,2,4], target = 6
[1,2]`}
                className={`${textareaClass} font-mono text-[12px]`}
              />
            </div>
          </section>

          {/* =================================================
              STARTER CODE
          ================================================= */}

          <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
            <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
                <Terminal className="h-4 w-4 text-emerald-400" />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  Starter Code
                </div>

                <div className="text-[11px] text-zinc-600">
                  Initial code shown to candidates
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-3">
              {/* PYTHON */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-yellow-400">
                    Python
                  </span>

                  <span className="text-[10px] text-zinc-700">.py</span>
                </div>

                <textarea
                  name="pyCode"
                  value={form.pyCode}
                  onChange={handleChange}
                  rows={14}
                  spellCheck="false"
                  placeholder={`def solve():
    pass`}
                  className={codeClass}
                />
              </div>

              {/* JAVA */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-yellow-400">
                    Java
                  </span>

                  <span className="text-[10px] text-zinc-700">.java</span>
                </div>

                <textarea
                  name="javaCode"
                  value={form.javaCode}
                  onChange={handleChange}
                  rows={14}
                  spellCheck="false"
                  placeholder={`class Solution {
    
}`}
                  className={codeClass}
                />
              </div>

              {/* C++ */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-yellow-400">
                    C++
                  </span>

                  <span className="text-[10px] text-zinc-700">.cpp</span>
                </div>

                <textarea
                  name="cppCode"
                  value={form.cppCode}
                  onChange={handleChange}
                  rows={14}
                  spellCheck="false"
                  placeholder={`#include <bits/stdc++.h>
using namespace std;`}
                  className={codeClass}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              EXPECTED OUTPUT
          ================================================= */}

          <section className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
            <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
                <CheckIcon />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  Expected Output
                </div>

                <div className="text-[11px] text-zinc-600">
                  Output used to validate solutions
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-3">
              {/* PYTHON */}

              <div>
                <span className="mb-2 block text-xs font-medium text-yellow-400">
                  Python
                </span>

                <textarea
                  name="pyOutput"
                  value={form.pyOutput}
                  onChange={handleChange}
                  rows={7}
                  spellCheck="false"
                  placeholder="[0,1]"
                  className={codeClass}
                />
              </div>

              {/* JAVA */}

              <div>
                <span className="mb-2 block text-xs font-medium text-yellow-400">
                  Java
                </span>

                <textarea
                  name="javaOutput"
                  value={form.javaOutput}
                  onChange={handleChange}
                  rows={7}
                  spellCheck="false"
                  placeholder="[0,1]"
                  className={codeClass}
                />
              </div>

              {/* C++ */}

              <div>
                <span className="mb-2 block text-xs font-medium text-yellow-400">
                  C++
                </span>

                <textarea
                  name="cppOutput"
                  value={form.cppOutput}
                  onChange={handleChange}
                  rows={7}
                  spellCheck="false"
                  placeholder="[0,1]"
                  className={codeClass}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              SAVE BAR
          ================================================= */}

          <div className="sticky bottom-4 z-30 rounded-2xl border border-zinc-800 bg-[#111111]/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10 sm:flex">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </div>

                <div>
                  <div className="text-xs font-medium text-zinc-300">
                    {isEditing ? "Ready to update?" : "Ready to publish?"}
                  </div>

                  <div className="text-[10px] text-zinc-600">
                    Make sure the problem data is correct before saving.
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => navigate("/problems")}
                  className="
                    flex-1
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
                    sm:flex-none
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
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
                    disabled:opacity-50
                    sm:flex-none
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />

                      {isEditing ? "Update Problem" : "Create Problem"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

// ============================================================
// CHECK ICON
// ============================================================

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-cyan-400"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M5 12.5 9.5 17 19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AddProblem;
