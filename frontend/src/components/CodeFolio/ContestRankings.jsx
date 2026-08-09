import { SiLeetcode, SiCodeforces } from "react-icons/si";
import { TrendingUp } from "lucide-react";

function ContestRankings({
  leetcodeRating,
  leetcodeMaxRating,
  codeforcesRating,
  codeforcesMaxRating,
  codeforcesRank,
  hasLeetCode,
  hasCodeForces,
}) {
  const hasPlatform = hasLeetCode || hasCodeForces;

  if (!hasPlatform) {
    return null;
  }

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
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="block text-sm font-semibold text-white">
            Contest Rankings
          </span>

          <span className="text-[11px] text-zinc-500">
            Your competitive ratings
          </span>
        </div>

        <TrendingUp size={16} className="text-yellow-400" />
      </div>

      <div className="space-y-3">
        {/* ================= LEETCODE ================= */}
        {hasLeetCode && (
          <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-4 transition-colors hover:border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
                  <SiLeetcode size={19} className="text-orange-400" />
                </div>

                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-white">
                    LeetCode
                  </span>

                  <span className="text-[10px] text-zinc-600">
                    Contest Rating
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xl font-bold text-white">
                  {leetcodeRating || 0}
                </span>

                <span className="text-[10px] text-zinc-600">
                  max {leetcodeMaxRating || leetcodeRating || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= CODEFORCES ================= */}
        {hasCodeForces && (
          <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-4 transition-colors hover:border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <SiCodeforces size={19} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-white">
                    Codeforces
                  </span>

                  <span className="block text-[10px] text-zinc-600">
                    {codeforcesRank || "Unrated"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xl font-bold text-white">
                  {codeforcesRating || 0}
                </span>

                <span className="text-[10px] text-zinc-600">
                  max {codeforcesMaxRating || codeforcesRating || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestRankings;
