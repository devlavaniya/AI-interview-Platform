// src/data/problems.js

/*
 * ============================================================
 * STATIC PROBLEMS
 * ============================================================
 *
 * Problems are loaded from the backend/database through:
 *
 *   problemApi.getProblems()
 *
 * Keep this object empty unless you intentionally want to
 * maintain local fallback problems.
 */

export const PROBLEMS = {};

/*
 * ============================================================
 * LANGUAGE CONFIGURATION
 * ============================================================
 *
 * Used by the code editor and problem/session pages.
 */

export const LANGUAGE_CONFIG = {
  python: {
    name: "Python",
    monacoLang: "python",
    extension: "py",
    installed: true,
  },

  java: {
    name: "Java",
    monacoLang: "java",
    extension: "java",
    installed: true,
  },

  cpp: {
    name: "C++",
    monacoLang: "cpp",
    extension: "cpp",
    installed: false,
  },
};
