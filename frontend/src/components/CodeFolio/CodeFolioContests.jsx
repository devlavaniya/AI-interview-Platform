import { useState } from "react";
import { Trophy, ChevronRight, X, ExternalLink } from "lucide-react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";

function CodeFolioContests({
  leetcodeContests = 0,
  codeforcesContests = 0,
  badges = [],
  hasLeetCode = false,
  hasCodeForces = false,
}) {
  const [showAllBadges, setShowAllBadges] = useState(false);

  /* -------------------------------------------------- */
  /* Contest Count                                      */
  /* -------------------------------------------------- */

  const totalContests =
    (hasLeetCode ? Number(leetcodeContests) || 0 : 0) +
    (hasCodeForces ? Number(codeforcesContests) || 0 : 0);

  /* -------------------------------------------------- */
  /* Badges                                             */
  /* -------------------------------------------------- */

  const allBadges = Array.isArray(badges) ? badges : [];

  const displayBadges = allBadges.slice(0, 4);

  /* -------------------------------------------------- */
  /* Badge Name                                         */
  /* -------------------------------------------------- */

  const getBadgeName = (badge) =>
    badge?.displayName || badge?.name || badge?.hoverText || "Achievement";

  return (
    <>
      {/* ================================================= */}
      {/* MAIN CARD                                         */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
        {/* ================================================= */}
        {/* HEADER                                            */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10">
              <Trophy className="h-4 w-4 text-yellow-400" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Contest Activity
              </span>

              <span className="text-xs text-zinc-500">
                Competitive programming
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white">
              {totalContests}
            </span>

            <span className="text-xs text-zinc-500">contests</span>
          </div>
        </div>

        {/* ================================================= */}
        {/* PLATFORM STATS                                    */}
        {/* ================================================= */}

        <div className="px-5 py-4">
          <div className="space-y-1">
            {/* LeetCode */}

            {hasLeetCode && (
              <div className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                    <SiLeetcode className="text-sm text-orange-500" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">
                      LeetCode
                    </span>

                    <span className="text-[11px] text-zinc-500">
                      Contest participation
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {leetcodeContests}
                  </span>

                  <ChevronRight
                    size={15}
                    className="text-zinc-600 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            )}

            {/* Codeforces */}

            {hasCodeForces && (
              <div className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <SiCodeforces className="text-sm text-blue-500" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">
                      Codeforces
                    </span>

                    <span className="text-[11px] text-zinc-500">
                      Contest participation
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {codeforcesContests}
                  </span>

                  <ChevronRight
                    size={15}
                    className="text-zinc-600 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            )}

            {/* No platforms */}

            {!hasLeetCode && !hasCodeForces && (
              <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-6 text-center">
                <span className="text-sm text-zinc-500">
                  No contest platforms connected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* DIVIDER                                           */}
        {/* ================================================= */}

        <div className="mx-5 h-px bg-zinc-800" />

        {/* ================================================= */}
        {/* BADGES                                            */}
        {/* ================================================= */}

        <div className="px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Achievements
              </span>

              <span className="text-[11px] text-zinc-500">
                {allBadges.length} {allBadges.length === 1 ? "badge" : "badges"}{" "}
                earned
              </span>
            </div>

            {/* VIEW ALL */}

            {allBadges.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllBadges(true)}
                className="
                  rounded-md
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-yellow-400
                  transition
                  hover:bg-yellow-400/10
                  hover:text-yellow-300
                "
              >
                View all
              </button>
            )}
          </div>

          {/* Badge Preview */}

          {displayBadges.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {displayBadges.map((badge, index) => {
                const badgeName = getBadgeName(badge);

                return (
                  <div
                    key={badge?.id || index}
                    title={badgeName}
                    className="
                      group
                      relative
                      flex
                      aspect-square
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-zinc-800
                      bg-zinc-900
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-yellow-400/40
                    "
                  >
                    {badge?.icon ? (
                      <img
                        src={badge.icon}
                        alt={badgeName}
                        className="
                          h-12
                          w-12
                          object-contain
                          transition-transform
                          duration-200
                          group-hover:scale-110
                        "
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Trophy className="h-7 w-7 text-yellow-400" />
                    )}

                    {/* Hover overlay */}

                    <div
                      className="
                      pointer-events-none
                      absolute
                      inset-0
                      flex
                      items-end
                      justify-center
                      bg-black/70
                      px-1
                      pb-1
                      opacity-0
                      transition-opacity
                      group-hover:opacity-100
                    "
                    >
                      <span className="w-full truncate text-center text-[9px] text-white">
                        {badgeName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-zinc-900/60 px-4 py-5 text-center">
              <Trophy className="mx-auto h-6 w-6 text-zinc-700" />

              <span className="mt-2 block text-xs text-zinc-500">
                No achievements yet
              </span>

              <span className="mt-1 block text-[11px] text-zinc-600">
                Keep participating in contests
              </span>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* FOOTER                                            */}
        {/* ================================================= */}

        <div className="border-t border-zinc-800 bg-[#0d0d0d] px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-600">
              Competitive profile
            </span>

            <div className="flex items-center gap-1.5">
              {hasLeetCode && (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              )}

              {hasCodeForces && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              )}

              <span className="text-[11px] text-zinc-500">
                {hasLeetCode && hasCodeForces
                  ? "2 platforms"
                  : hasLeetCode || hasCodeForces
                    ? "1 platform"
                    : "No platforms"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ALL BADGES DIALOG                                 */}
      {/* ================================================= */}

      {showAllBadges && (
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
              setShowAllBadges(false);
            }
          }}
        >
          <div
            className="
              flex
              max-h-[80vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-zinc-800
              bg-[#111111]
              shadow-2xl
            "
          >
            {/* Dialog Header */}

            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10">
                  <Trophy size={17} className="text-yellow-400" />
                </div>

                <div>
                  <span className="block text-sm font-semibold text-white">
                    All Achievements
                  </span>

                  <span className="text-[11px] text-zinc-500">
                    {allBadges.length} badges earned
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllBadges(false)}
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
                <X size={17} />
              </button>
            </div>

            {/* Dialog Body */}

            <div className="overflow-y-auto p-5">
              {allBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {allBadges.map((badge, index) => {
                    const badgeName = getBadgeName(badge);

                    return (
                      <div
                        key={badge?.id || index}
                        className="
                          group
                          relative
                          flex
                          min-h-[130px]
                          flex-col
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-zinc-800
                          bg-[#0d0d0d]
                          p-4
                          text-center
                          transition-all
                          duration-200
                          hover:border-yellow-400/40
                          hover:bg-zinc-900
                        "
                      >
                        {/* Badge */}

                        <div
                          className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-xl
                          bg-zinc-900
                        "
                        >
                          {badge?.icon ? (
                            <img
                              src={badge.icon}
                              alt={badgeName}
                              className="
                                h-14
                                w-14
                                object-contain
                                transition-transform
                                duration-200
                                group-hover:scale-110
                              "
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Trophy size={28} className="text-yellow-400" />
                          )}
                        </div>

                        {/* Name */}

                        <span className="mt-3 line-clamp-2 text-[11px] font-medium text-zinc-300">
                          {badgeName}
                        </span>

                        {/* Hover info */}

                        {badge?.hoverText && badge.hoverText !== badgeName && (
                          <div
                            className="
                              pointer-events-none
                              absolute
                              bottom-2
                              left-2
                              right-2
                              rounded-md
                              bg-black/90
                              px-2
                              py-1.5
                              opacity-0
                              transition-opacity
                              group-hover:opacity-100
                            "
                          >
                            <span className="block text-[9px] leading-tight text-zinc-300">
                              {badge.hoverText}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Trophy size={32} className="mx-auto text-zinc-700" />

                  <span className="mt-3 block text-sm text-zinc-500">
                    No achievements available
                  </span>
                </div>
              )}
            </div>

            {/* Dialog Footer */}

            <div className="flex items-center justify-between border-t border-zinc-800 bg-[#0d0d0d] px-5 py-3">
              <span className="text-[11px] text-zinc-600">
                Showing all {allBadges.length} achievements
              </span>

              <button
                type="button"
                onClick={() => setShowAllBadges(false)}
                className="
                  rounded-lg
                  border
                  border-zinc-800
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-zinc-400
                  transition
                  hover:bg-zinc-900
                  hover:text-white
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CodeFolioContests;
