import { SiCodeforces } from "react-icons/si";
import { Trophy, TrendingUp } from "lucide-react";

function CompetitiveProgramming({ codeforcesProblems }) {
  const problems = codeforcesProblems || 0;

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-[#111111]
        p-5
      "
    >
      {/* Subtle glow */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <SiCodeforces className="text-blue-400" size={18} />
          </div>

          <div>
            <span className="block text-sm font-semibold text-white">
              Competitive Programming
            </span>

            <span className="text-[11px] text-zinc-500">
              Codeforces activity
            </span>
          </div>
        </div>

        <Trophy size={16} className="text-yellow-400" />
      </div>

      {/* Main statistic */}
      <div className="relative mt-6 flex items-end justify-between">
        <div>
          <span className="text-4xl font-bold tracking-tight text-white">
            {problems.toLocaleString()}
          </span>

          <span className="ml-2 text-xs text-zinc-500">solved</span>
        </div>

        <div className="flex items-center gap-1 pb-1 text-xs text-green-400">
          <TrendingUp size={13} />
          <span>Problems</span>
        </div>
      </div>

      {/* Progress */}
      <div className="relative mt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${Math.min((problems / 500) * 100, 100)}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
          <span>0 solved</span>
          <span>500 target</span>
        </div>
      </div>
    </div>
  );
}

export default CompetitiveProgramming;
