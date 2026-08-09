import { useEffect } from "react";

import {
  useUser,
  useAuth,
} from "@clerk/clerk-react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { Toaster } from "react-hot-toast";

import AppLayout from "./components/AppLayout";

// Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import AddProblem from "./pages/AddProblem";
import ContestsPage from "./pages/ContestsPage";
import ResourcesPage from "./pages/ResourcesPage";
import CodeFolioPage from "./pages/CodeFolioPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import SessionPage from "./pages/SessionPage";

// Axios / Clerk token connection
import { setClerkTokenGetter } from "./lib/axios";

function App() {
  const { isLoaded, isSignedIn } = useUser();

  // Get Clerk session token function
  const { getToken } = useAuth();

  // =========================================================
  // CONNECT CLERK WITH AXIOS
  // =========================================================

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  // Prevent flickering while Clerk initializes
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={
            !isSignedIn ? (
              <HomePage />
            ) : (
              <Navigate
                to="/dashboard"
                replace
              />
            )
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          element={
            isSignedIn ? (
              <AppLayout />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/problems"
            element={<ProblemsPage />}
          />

          <Route
            path="/problem/:id"
            element={<ProblemPage />}
          />

          <Route
            path="/add-problem"
            element={<AddProblem />}
          />

          <Route
            path="/contests"
            element={<ContestsPage />}
          />

          <Route
            path="/resources"
            element={<ResourcesPage />}
          />

          <Route
            path="/codefolio"
            element={<CodeFolioPage />}
          />

          <Route
            path="/mock-interview"
            element={<MockInterviewPage />}
          />

          {/* Sessions list */}
          <Route
            path="/sessions"
            element={<SessionPage />}
          />

          {/* Settings */}
          {/* <Route
            path="/settings"
            element={<SettingsPage />}
          /> */}
        </Route>

        {/* ================= FULL SCREEN SESSION ================= */}

        <Route
          path="/session/:id"
          element={
            isSignedIn ? (
              <SessionPage />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      {/* ================= TOAST ================= */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;