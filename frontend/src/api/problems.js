import axiosInstance from "../lib/axios";

/*
 * Normalize every possible backend response into
 * one simple array.
 *
 * Supported backend responses:
 *
 * 1. [...]
 *
 * 2. { problems: [...] }
 *
 * 3. { data: [...] }
 *
 * 4. { data: { problems: [...] } }
 */
const normalizeProblemsResponse = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.problems)) {
    return responseData.problems;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.data?.problems)) {
    return responseData.data.problems;
  }

  return [];
};

export const problemApi = {
  // ==========================================================
  // GET ALL PROBLEMS
  // ==========================================================

  getProblems: async () => {
    const response = await axiosInstance.get("/problems");

    console.log("GET /problems:", response.data);

    const problems = normalizeProblemsResponse(response.data);

    console.log("Normalized problems:", problems);

    return {
      problems,
    };
  },

  // ==========================================================
  // GET SINGLE PROBLEM
  // ==========================================================

  getProblemById: async (id) => {
    if (!id) {
      throw new Error("Problem ID is required");
    }

    const response = await axiosInstance.get(`/problems/${id}`);

    return response.data;
  },

  // ==========================================================
  // CREATE PROBLEM
  // ==========================================================

  createProblem: async (data) => {
    const response = await axiosInstance.post("/problems", data);

    return response.data;
  },

  // ==========================================================
  // UPDATE PROBLEM
  // ==========================================================

  updateProblem: async (id, data) => {
    if (!id) {
      throw new Error("Problem ID is required");
    }

    const response = await axiosInstance.put(`/problems/${id}`, data);

    return response.data;
  },

  // ==========================================================
  // DELETE PROBLEM
  // ==========================================================

  deleteProblem: async (id) => {
    if (!id) {
      throw new Error("Problem ID is required");
    }

    const response = await axiosInstance.delete(`/problems/${id}`);

    return response.data;
  },

  // ==========================================================
  // AI GENERATE PROBLEM
  // ==========================================================

  generateCustomProblem: async (topic, difficulty) => {
    if (!topic?.trim()) {
      throw new Error("Topic is required");
    }

    const response = await axiosInstance.post("/grok/problem/generate", {
      topic: topic.trim(),
      difficulty,
    });

    return response.data;
  },
};
