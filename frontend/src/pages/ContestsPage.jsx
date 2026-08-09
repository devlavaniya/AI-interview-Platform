import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  RefreshCw,
  Search,
  Trophy,
  X,
} from "lucide-react";

function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* =========================================================
     FETCH CODEFORCES CONTESTS
  ========================================================= */

  const fetchCodeforcesContests = async () => {
    try {
      const response = await fetch("https://codeforces.com/api/contest.list");

      if (!response.ok) {
        throw new Error("Failed to fetch contests");
      }

      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error("Codeforces API returned an error");
      }

      const upcoming = data.result
        .filter((contest) => contest.phase === "BEFORE")
        .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
        .slice(0, 30)
        .map((contest) => ({
          id: contest.id,
          name: contest.name,
          startTime: new Date(contest.startTimeSeconds * 1000),
          durationMinutes: contest.durationSeconds / 60,
          link: `https://codeforces.com/contests/${contest.id}`,
          platform: "Codeforces",
          type: contest.type || "Contest",
        }));

      return upcoming;
    } catch (error) {
      console.error("Codeforces API error:", error);

      return [];
    }
  };

  /* =========================================================
     LOAD CONTESTS
  ========================================================= */

  const loadContests = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await fetchCodeforcesContests();

      setContests(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContests();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredContests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return contests;
    }

    return contests.filter((contest) =>
      contest.name.toLowerCase().includes(query),
    );
  }, [contests, searchQuery]);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  /* =========================================================
     RELATIVE START TIME
  ========================================================= */

  const getRelativeTime = (date) => {
    const now = new Date();

    const difference = date.getTime() - now.getTime();

    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes <= 0) {
      return "Starting soon";
    }

    const days = Math.floor(minutes / (60 * 24));

    const hours = Math.floor((minutes % (60 * 24)) / 60);

    const remainingMinutes = minutes % 60;

    if (days > 0) {
      return `In ${days}d ${hours}h`;
    }

    if (hours > 0) {
      return `In ${hours}h ${remainingMinutes}m`;
    }

    return `In ${remainingMinutes}m`;
  };

  /* =========================================================
     FORMAT DURATION
  ========================================================= */

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = Math.round(minutes % 60);

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  };

  /* =========================================================
     CONTEST CARD
  ========================================================= */

  const ContestCard = ({ contest, index }) => {
    return (
      <div
        className="
          group
          flex
          min-h-[285px]
          flex-col
          rounded-2xl
          border
          border-zinc-800
          bg-[#111111]
          p-5
          transition-all
          duration-200
          hover:-translate-y-1
          hover:border-yellow-400/30
          hover:bg-[#141414]
          hover:shadow-xl
          hover:shadow-black/20
        "
      >
        {/* TOP */}

        <div
          className="
          flex
          items-start
          justify-between
        "
        >
          <div
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-yellow-400/10
          "
          >
            <Trophy
              className="
              h-5
              w-5
              text-yellow-400
            "
            />
          </div>

          <span
            className="
            rounded-full
            border
            border-emerald-400/10
            bg-emerald-400/10
            px-2.5
            py-1
            text-[10px]
            font-medium
            text-emerald-400
          "
          >
            Upcoming
          </span>
        </div>

        {/* PLATFORM */}

        <div
          className="
          mt-5
          flex
          items-center
          gap-2
        "
        >
          <span
            className="
            rounded-md
            bg-blue-400/10
            px-2
            py-1
            text-[10px]
            font-medium
            text-blue-400
          "
          >
            Codeforces
          </span>

          <span
            className="
            text-[10px]
            text-zinc-600
          "
          >
            #{contest.id}
          </span>
        </div>

        {/* NAME */}

        <div
          className="
          mt-3
          min-h-[42px]
        "
        >
          <span
            className="
            line-clamp-2
            text-sm
            font-semibold
            leading-5
            text-zinc-100
          "
          >
            {contest.name}
          </span>
        </div>

        {/* START TIME */}

        <div
          className="
          mt-5
          space-y-3
        "
        >
          <div
            className="
            flex
            items-center
            justify-between
          "
          >
            <div
              className="
              flex
              items-center
              gap-2
            "
            >
              <CalendarDays
                className="
                h-3.5
                w-3.5
                text-zinc-600
              "
              />

              <span
                className="
                text-xs
                text-zinc-500
              "
              >
                {formatDate(contest.startTime)}
              </span>
            </div>

            <span
              className="
              text-xs
              font-medium
              text-yellow-400
            "
            >
              {getRelativeTime(contest.startTime)}
            </span>
          </div>

          <div
            className="
            flex
            items-center
            gap-2
          "
          >
            <Clock3
              className="
              h-3.5
              w-3.5
              text-zinc-600
            "
            />

            <span
              className="
              text-xs
              text-zinc-500
            "
            >
              {formatTime(contest.startTime)}
            </span>

            <span
              className="
              text-[10px]
              text-zinc-700
            "
            >
              •
            </span>

            <span
              className="
              text-xs
              text-zinc-500
            "
            >
              {formatDuration(contest.durationMinutes)}
            </span>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
          mt-auto
          flex
          items-center
          justify-between
          border-t
          border-zinc-800
          pt-4
        "
        >
          <span
            className="
            text-[10px]
            text-zinc-600
          "
          >
            Competitive programming
          </span>

          <a
            href={contest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-1.5
              rounded-lg
              bg-yellow-400
              px-3
              py-2
              text-[10px]
              font-semibold
              text-black
              transition
              hover:bg-yellow-300
            "
          >
            Open
            <ExternalLink
              className="
                h-3
                w-3
              "
            />
          </a>
        </div>
      </div>
    );
  };

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div
      className="
      min-h-screen
      bg-[#090909]
      text-white
    "
    >
      <main
        className="
        mx-auto
        max-w-7xl
        px-6
        py-8
      "
      >
        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div
          className="
          mb-8
          flex
          flex-col
          gap-5
          border-b
          border-zinc-800
          pb-7
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
        >
          <div>
            <div
              className="
              mb-3
              flex
              items-center
              gap-2
            "
            >
              <span
                className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-yellow-400/10
              "
              >
                <Trophy
                  className="
                  h-4
                  w-4
                  text-yellow-400
                "
                />
              </span>

              <span
                className="
                rounded-full
                border
                border-yellow-400/20
                bg-yellow-400/10
                px-2.5
                py-1
                text-[10px]
                font-medium
                text-yellow-400
              "
              >
                Competitive Programming
              </span>
            </div>

            <span
              className="
              block
              text-2xl
              font-bold
              tracking-tight
              text-white
              sm:text-3xl
            "
            >
              Upcoming Contests
            </span>

            <p
              className="
              mt-2
              max-w-xl
              text-xs
              leading-5
              text-zinc-500
            "
            >
              Find upcoming competitive programming contests and jump directly
              into the competition.
            </p>
          </div>

          {/* RIGHT CONTROLS */}

          <div
            className="
            flex
            w-full
            flex-col
            gap-2
            sm:flex-row
            lg:w-auto
          "
          >
            {/* SEARCH */}

            <div
              className="
              relative
              w-full
              sm:w-64
            "
            >
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
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search contests..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#111111]
                  pl-9
                  pr-9
                  text-xs
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                  focus:border-yellow-400/40
                "
              />

              {searchQuery && (
                <button
                  type="button"
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
                  <X
                    className="
                    h-3.5
                    w-3.5
                  "
                  />
                </button>
              )}
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => loadContests(true)}
              disabled={refreshing}
              className="
                flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                px-4
                text-xs
                font-medium
                text-zinc-400
                transition
                hover:border-zinc-700
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                className={`
                  h-3.5
                  w-3.5
                  ${refreshing ? "animate-spin" : ""}
                `}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ===================================================
            STATS
        =================================================== */}

        {!loading && contests.length > 0 && (
          <div
            className="
              mb-7
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
            "
          >
            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                px-4
                py-3
              "
            >
              <span
                className="
                  block
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-zinc-600
                "
              >
                Upcoming
              </span>

              <span
                className="
                  mt-1
                  block
                  text-xl
                  font-semibold
                  text-white
                "
              >
                {contests.length}
              </span>
            </div>

            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                px-4
                py-3
              "
            >
              <span
                className="
                  block
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-zinc-600
                "
              >
                Platform
              </span>

              <span
                className="
                  mt-1
                  block
                  text-sm
                  font-semibold
                  text-blue-400
                "
              >
                Codeforces
              </span>
            </div>

            <div
              className="
                hidden
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                px-4
                py-3
                sm:block
              "
            >
              <span
                className="
                  block
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-zinc-600
                "
              >
                Showing
              </span>

              <span
                className="
                  mt-1
                  block
                  text-sm
                  font-semibold
                  text-yellow-400
                "
              >
                {filteredContests.length}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <div
            className="
            flex
            min-h-[450px]
            items-center
            justify-center
          "
          >
            <div
              className="
              flex
              flex-col
              items-center
              text-center
            "
            >
              <div
                className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-zinc-800
                bg-[#111111]
              "
              >
                <RefreshCw
                  className="
                  h-6
                  w-6
                  animate-spin
                  text-yellow-400
                "
                />
              </div>

              <span
                className="
                mt-4
                text-sm
                font-medium
                text-zinc-300
              "
              >
                Loading contests
              </span>

              <span
                className="
                mt-1
                text-xs
                text-zinc-600
              "
              >
                Fetching upcoming Codeforces contests...
              </span>
            </div>
          </div>
        ) : filteredContests.length > 0 ? (
          <>
            {/* SECTION BAR */}

            <div
              className="
              mb-4
              flex
              items-center
              justify-between
            "
            >
              <div
                className="
                flex
                items-center
                gap-2
              "
              >
                <span
                  className="
                  h-2
                  w-2
                  rounded-full
                  bg-blue-400"
                />

                <span
                  className="
                  text-sm
                  font-semibold
                  text-white
                "
                >
                  Codeforces
                </span>

                <span
                  className="
                  rounded-md
                  bg-zinc-900
                  px-2
                  py-1
                  text-[10px]
                  text-zinc-500
                "
                >
                  {filteredContests.length}
                </span>
              </div>

              <span
                className="
                text-[10px]
                text-zinc-600
              "
              >
                Sorted by start time
              </span>
            </div>

            {/* =================================================
                CONTEST GRID
            ================================================= */}

            <div
              className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
            >
              {filteredContests.map((contest, index) => (
                <ContestCard key={contest.id} contest={contest} index={index} />
              ))}
            </div>
          </>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            className="
            flex
            min-h-[400px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-zinc-800
            bg-[#111111]
            px-6
            text-center
          "
          >
            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-zinc-900
            "
            >
              <Trophy
                className="
                h-6
                w-6
                text-zinc-600
              "
              />
            </div>

            <span
              className="
              mt-4
              text-sm
              font-semibold
              text-white
            "
            >
              {searchQuery ? "No contests found" : "No upcoming contests"}
            </span>

            <p
              className="
              mt-2
              max-w-sm
              text-xs
              leading-5
              text-zinc-600
            "
            >
              {searchQuery
                ? "Try another search term."
                : "Codeforces did not return any upcoming contests right now."}
            </p>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
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
                Clear search
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ContestsPage;
