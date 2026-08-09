import { Link, useNavigate } from "react-router";
import {
  ChevronRight,
  Code2,
  Edit3,
  Search,
  Trash2,
  X,
  SlidersHorizontal,
  CheckCircle2,
  CircleDot,
  Flame,
} from "lucide-react";

import { PROBLEMS } from "../data/problems";
import { useUser } from "@clerk/clerk-react";
import { isAdmin } from "../lib/admin";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { problemApi } from "../api/problems";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

function ProblemsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* =========================================================
     STATE
  ========================================================= */

  const [allProblems, setAllProblems] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  /* =========================================================
     FETCH DATABASE PROBLEMS
  ========================================================= */

  const {
    data: dbProblems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });

  /* =========================================================
     DELETE PROBLEM
  ========================================================= */

  const deleteMutation = useMutation({
    mutationFn: problemApi.deleteProblem,

    onSuccess: () => {
      toast.success("Problem deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["problems"],
      });
    },

    onError: (error) => {
      console.error("Delete problem error:", error);

      toast.error(error?.response?.data?.message || "Failed to delete problem");
    },
  });

  /* =========================================================
     COMBINE STATIC + DATABASE PROBLEMS
  ========================================================= */

  useEffect(() => {
    const staticProblems = Object.values(PROBLEMS);

    const dynamicProblems = dbProblems?.problems || [];

    /*
     * Static problems:
     *   problem.id
     *
     * Database problems:
     *   problem._id
     *
     * Keep both because static problems don't
     * have a MongoDB _id.
     */

    const combined = [...staticProblems, ...dynamicProblems];

    const problemsWithSequence = combined.map((problem, index) => ({
      ...problem,
      sequenceNumber: index + 1,
      isDatabaseProblem: Boolean(problem._id),
    }));

    setAllProblems(problemsWithSequence);
  }, [dbProblems]);

  /* =========================================================
     GET PROBLEM URL
  ========================================================= */

  const getProblemUrl = (problem) => {
    /*
     * MongoDB problem
     *
     * Backend:
     * Problem.findById(id)
     *
     * Therefore use _id.
     */

    if (problem?._id) {
      return `/problem/${problem._id}`;
    }

    /*
     * Static problem
     *
     * Existing static problem structure
     * uses its own id.
     */

    if (problem?.id) {
      return `/problem/${problem.id}`;
    }

    return "/problems";
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (problem) => {
    if (!problem?._id) {
      return;
    }

    navigate(`/add-problem?edit=${problem._id}`);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (event, problem) => {
    event.preventDefault();
    event.stopPropagation();

    if (!problem?._id) {
      toast.error("Static problems cannot be deleted.");

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${problem.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(problem._id);
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredProblems = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    return allProblems.filter((problem) => {
      const difficultyMatch =
        selectedDifficulty === "all" ||
        problem.difficulty === selectedDifficulty;

      if (!search) {
        return difficultyMatch;
      }

      const title = problem.title?.toLowerCase() || "";

      const category = problem.category?.toLowerCase() || "";

      const description = problem.description?.text?.toLowerCase() || "";

      const matchesSearch =
        title.includes(search) ||
        category.includes(search) ||
        description.includes(search);

      return matchesSearch && difficultyMatch;
    });
  }, [allProblems, searchQuery, selectedDifficulty]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const easy = filteredProblems.filter(
      (problem) => problem.difficulty === "Easy",
    ).length;

    const medium = filteredProblems.filter(
      (problem) => problem.difficulty === "Medium",
    ).length;

    const hard = filteredProblems.filter(
      (problem) => problem.difficulty === "Hard",
    ).length;

    return {
      total: filteredProblems.length,
      easy,
      medium,
      hard,
    };
  }, [filteredProblems]);

  /* =========================================================
     TOTAL STATS
  ========================================================= */

  const totalStats = useMemo(() => {
    return {
      total: allProblems.length,

      easy: allProblems.filter((problem) => problem.difficulty === "Easy")
        .length,

      medium: allProblems.filter((problem) => problem.difficulty === "Medium")
        .length,

      hard: allProblems.filter((problem) => problem.difficulty === "Hard")
        .length,
    };
  }, [allProblems]);

  /* =========================================================
     DIFFICULTY CONFIG
  ========================================================= */

  const difficultyConfig = {
    Easy: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },

    Medium: {
      dot: "bg-yellow-400",
      text: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
    },

    Hard: {
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("all");
  };

  const hasFilters = searchQuery.trim() || selectedDifficulty !== "all";

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading && allProblems.length === 0) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-[#111111]">
              <Code2 className="h-5 w-5 animate-pulse text-yellow-400" />
            </div>

            <span className="mt-4 text-sm text-zinc-500">
              Loading problems...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError && allProblems.length === 0) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10">
              <CircleDot className="h-5 w-5 text-red-400" />
            </div>

            <span className="mt-4 block text-sm font-semibold text-white">
              Unable to load problems
            </span>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Something went wrong while fetching the problem collection.
            </p>

            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["problems"],
                })
              }
              className="
                mt-5
                rounded-lg
                bg-yellow-400
                px-4
                py-2
                text-xs
                font-semibold
                text-black
                transition
                hover:bg-yellow-300
              "
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="border-b border-zinc-800 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10">
                <Code2 className="h-5 w-5 text-yellow-400" />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-white">
                  Practice
                </span>

                <span className="text-xs text-zinc-600">
                  {totalStats.total} coding problems
                </span>
              </div>
            </div>

            {/* ADMIN */}

            {isAdmin(user) && (
              <Link
                to="/add-problem"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-yellow-400
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-black
                  transition
                  hover:bg-yellow-300
                "
              >
                <Code2 className="h-3.5 w-3.5" />
                Add Problem
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        {/* ===================================================
            FILTER BAR
        =================================================== */}

        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-zinc-600
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search problems..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#111111]
                  pl-10
                  pr-10
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-yellow-400/40
                  focus:bg-[#141414]
                "
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-zinc-600
                    transition
                    hover:text-white
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* FILTER ICON */}

            <div className="hidden h-8 w-px bg-zinc-800 lg:block" />

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-600" />

              <span className="text-xs text-zinc-600">Difficulty</span>
            </div>

            {/* DIFFICULTY */}

            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  label: "All",
                  value: "all",
                },
                {
                  label: "Easy",
                  value: "Easy",
                },
                {
                  label: "Medium",
                  value: "Medium",
                },
                {
                  label: "Hard",
                  value: "Hard",
                },
              ].map((filter) => {
                const active = selectedDifficulty === filter.value;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedDifficulty(filter.value)}
                    className={`
                        rounded-lg
                        px-3
                        py-2
                        text-[11px]
                        font-medium
                        transition
                        ${
                          active
                            ? "bg-yellow-400 text-black"
                            : "border border-zinc-800 bg-[#111111] text-zinc-500 hover:border-zinc-700 hover:text-white"
                        }
                      `}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILTER STATUS */}

          {hasFilters && (
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
              <span className="text-[11px] text-zinc-600">
                Showing{" "}
                <span className="text-zinc-300">{filteredProblems.length}</span>{" "}
                of <span className="text-zinc-300">{allProblems.length}</span>{" "}
                problems
              </span>

              <button
                onClick={clearFilters}
                className="
                  text-[11px]
                  font-medium
                  text-yellow-400
                  transition
                  hover:text-yellow-300
                "
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ===================================================
            RESULT SUMMARY
        =================================================== */}

        <div className="mb-3 mt-7 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Problems</span>

            <span className="rounded-md bg-zinc-900 px-2 py-1 text-[10px] text-zinc-500">
              {filteredProblems.length}
            </span>
          </div>

          <span className="text-[11px] text-zinc-600">
            Select a problem to start solving
          </span>
        </div>

        {/* ===================================================
            PROBLEM LIST
        =================================================== */}

        {filteredProblems.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
            {filteredProblems.map((problem) => {
              const difficulty =
                difficultyConfig[problem.difficulty] || difficultyConfig.Easy;

              /*
               * IMPORTANT:
               *
               * DB problem:
               *   /problem/<MongoDB _id>
               *
               * Static problem:
               *   /problem/<static id>
               */

              const problemUrl = getProblemUrl(problem);

              return (
                <Link
                  key={problem._id || problem.id}
                  to={problemUrl}
                  className="
                      group
                      block
                      border-b
                      border-zinc-800
                      last:border-b-0
                      transition
                      hover:bg-[#111111]
                    "
                >
                  <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
                    {/* NUMBER */}

                    <div
                      className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#151515]
                          text-[11px]
                          font-medium
                          text-zinc-500
                          transition
                          group-hover:bg-yellow-400/10
                          group-hover:text-yellow-400
                        "
                    >
                      {String(problem.sequenceNumber).padStart(2, "0")}
                    </div>

                    {/* STATUS */}

                    <div className="hidden shrink-0 sm:block">
                      <div
                        className={`
                            h-2
                            w-2
                            rounded-full
                            ${difficulty.dot}
                          `}
                      />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="
                              truncate
                              text-sm
                              font-medium
                              text-zinc-200
                              transition
                              group-hover:text-white
                            "
                        >
                          {problem.title}
                        </span>

                        <span
                          className={`
                              rounded-md
                              border
                              px-2
                              py-0.5
                              text-[9px]
                              font-medium
                              ${difficulty.bg}
                              ${difficulty.text}
                              ${difficulty.border}
                            `}
                        >
                          {problem.difficulty}
                        </span>

                        {/* DATABASE BADGE */}

                        {problem._id && (
                          <span className="rounded-md border border-blue-400/10 bg-blue-400/5 px-2 py-0.5 text-[9px] font-medium text-blue-400/70">
                            DB
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        {problem.category && (
                          <span
                            className="
                                truncate
                                text-[11px]
                                text-zinc-600
                              "
                          >
                            {problem.category}
                          </span>
                        )}

                        {problem.category && (
                          <span className="text-zinc-800">•</span>
                        )}

                        <span
                          className="
                              hidden
                              truncate
                              text-[11px]
                              text-zinc-700
                              sm:block
                            "
                        >
                          {problem.description?.text || "Practice this problem"}
                        </span>
                      </div>
                    </div>

                    {/* ADMIN ACTIONS */}

                    {isAdmin(user) && (
                      <div
                        className="
                            hidden
                            items-center
                            gap-1
                            sm:flex
                          "
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        {/* EDIT */}

                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            handleEdit(problem);
                          }}
                          disabled={!problem._id}
                          className="
                              rounded-lg
                              p-2
                              text-zinc-600
                              transition
                              hover:bg-blue-400/10
                              hover:text-blue-400
                              disabled:cursor-not-allowed
                              disabled:opacity-30
                            "
                          title={
                            !problem._id ? "Static problem" : "Edit problem"
                          }
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={(event) => handleDelete(event, problem)}
                          disabled={!problem._id || deleteMutation.isPending}
                          className="
                              rounded-lg
                              p-2
                              text-zinc-600
                              transition
                              hover:bg-red-400/10
                              hover:text-red-400
                              disabled:cursor-not-allowed
                              disabled:opacity-30
                            "
                          title={
                            !problem._id ? "Static problem" : "Delete problem"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* SOLVE */}

                    <div
                      className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                          text-zinc-600
                          transition
                          group-hover:text-yellow-400
                        "
                    >
                      <span
                        className="
                            hidden
                            text-[11px]
                            font-medium
                            sm:block
                          "
                      >
                        Solve
                      </span>

                      <ChevronRight
                        className="
                            h-4
                            w-4
                            transition
                            group-hover:translate-x-0.5
                          "
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-zinc-800
              bg-[#0d0d0d]
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-zinc-900
              "
            >
              <Search className="h-5 w-5 text-zinc-600" />
            </div>

            <span
              className="
                mt-4
                block
                text-sm
                font-medium
                text-white
              "
            >
              No problems found
            </span>

            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-xs
                leading-5
                text-zinc-600
              "
            >
              Try changing your search query or selecting a different
              difficulty.
            </p>

            <button
              onClick={clearFilters}
              className="
                mt-5
                rounded-lg
                bg-yellow-400
                px-4
                py-2
                text-xs
                font-semibold
                text-black
                transition
                hover:bg-yellow-300
              "
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >
          {/* TOTAL */}

          <div
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-[#0d0d0d]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">Showing</span>

              <Code2 className="h-4 w-4 text-zinc-700" />
            </div>

            <div className="mt-3 flex items-end gap-2">
              <span
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {stats.total}
              </span>

              <span
                className="
                  mb-1
                  text-[10px]
                  text-zinc-700
                "
              >
                / {totalStats.total}
              </span>
            </div>
          </div>

          {/* EASY */}

          <div
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-[#0d0d0d]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">Easy</span>

              <CheckCircle2
                className="
                  h-4
                  w-4
                  text-emerald-400/60
                "
              />
            </div>

            <span
              className="
                mt-3
                block
                text-2xl
                font-semibold
                tracking-tight
                text-emerald-400
              "
            >
              {stats.easy}
            </span>
          </div>

          {/* MEDIUM */}

          <div
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-[#0d0d0d]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">Medium</span>

              <CircleDot
                className="
                  h-4
                  w-4
                  text-yellow-400/60
                "
              />
            </div>

            <span
              className="
                mt-3
                block
                text-2xl
                font-semibold
                tracking-tight
                text-yellow-400
              "
            >
              {stats.medium}
            </span>
          </div>

          {/* HARD */}

          <div
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-[#0d0d0d]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">Hard</span>

              <Flame
                className="
                  h-4
                  w-4
                  text-red-400/60
                "
              />
            </div>

            <span
              className="
                mt-3
                block
                text-2xl
                font-semibold
                tracking-tight
                text-red-400
              "
            >
              {stats.hard}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProblemsPage;
