import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

import { ArrowRight, Sparkles, Zap, Brain, Trophy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WelcomeSection({ onCreateSession, hasActiveSession }) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#111111] via-[#151515] to-[#0b0b0b] p-10 shadow-2xl">
      {/* Background Glow */}

      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-yellow-500/5 blur-3xl" />

      {/* Grid */}

      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right,#ffffff12 1px,transparent 1px),linear-gradient(to bottom,#ffffff12 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT */}

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-400">
            <Sparkles className="h-4 w-4" />
            IntelliView Dashboard
          </div>

          <h2 className="mt-6 text-2xl font-bold leading-tight text-white">
            Welcome back,
            <span className="text-yellow-400">
              {" "}
              {user?.firstName || "Developer"}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Practice coding interviews, collaborate with developers in
            real-time, generate AI-powered problems, and improve your interview
            performance through an immersive coding platform.
          </p>

          {/* Feature Pills */}

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
              <Users className="h-5 w-5 text-yellow-400" />

              <span className="text-sm text-white">Live Coding Sessions</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
              <Brain className="h-5 w-5 text-yellow-400" />

              <span className="text-sm text-white">AI Mock Interviews</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
              <Trophy className="h-5 w-5 text-yellow-400" />

              <span className="text-sm text-white">Progress Tracking</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0f0f0f]/80 p-8 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-white">Quick Actions</h2>

          <p className="mt-2 text-sm text-zinc-500">
            Start practicing or collaborate with your teammates.
          </p>

          <div className="mt-8 space-y-4">
            <Button
              onClick={onCreateSession}
              disabled={hasActiveSession}
              className="h-14 w-full rounded-2xl bg-yellow-400 text-lg font-semibold text-black transition-all hover:scale-[1.02] hover:bg-yellow-300"
            >
              <Zap className="mr-2 h-5 w-5" />

              {hasActiveSession
                ? "Session Already Running"
                : "Create Live Session"}
            </Button>

            <Button
              onClick={() => navigate("/mock-interview")}
              variant="outline"
              className="h-14 w-full rounded-2xl border-zinc-700 bg-zinc-900 text-lg text-white hover:border-yellow-400 hover:bg-zinc-800"
            >
              <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
              Start Mock Interview
              <ArrowRight className="ml-auto h-5 w-5" />
            </Button>
          </div>

          {/* Status */}

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111111] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Current Session</span>

              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    hasActiveSession ? "bg-green-500" : "bg-zinc-500"
                  }`}
                />

                <span
                  className={`font-medium ${
                    hasActiveSession ? "text-green-400" : "text-zinc-400"
                  }`}
                >
                  {hasActiveSession ? "Running" : "No Active Session"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
