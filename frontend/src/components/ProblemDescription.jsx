import { useState, useRef } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Play,
  Search,
  Sparkles,
} from "lucide-react";

import { getDifficultyBadgeClass } from "../lib/utils";
import { getHintFromGrok } from "../lib/grok";
import Popover from "./Popover";
import { fetchYoutubeVideo } from "../api/youtube";

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
  isAccepted,
}) {
  /* =========================================================
     VIDEO STATE
  ========================================================= */

  const [videoPopoverOpen, setVideoPopoverOpen] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");

  const [videoLoading, setVideoLoading] = useState(false);

  const [videoError, setVideoError] = useState("");

  const videoBtnRef = useRef(null);

  /* =========================================================
     HINT STATE
  ========================================================= */

  const [hintPopoverOpen, setHintPopoverOpen] = useState(false);

  const [hintLoading, setHintLoading] = useState(false);

  const [hints, setHints] = useState([]);

  const [hintError, setHintError] = useState("");

  const [openHint, setOpenHint] = useState(null);

  const hintBtnRef = useRef(null);

  /* =========================================================
     VIDEO
  ========================================================= */

  const handleVideoClick = async (event) => {
    event.preventDefault();

    if (videoPopoverOpen) {
      setVideoPopoverOpen(false);
      return;
    }

    setVideoPopoverOpen(true);
    setVideoLoading(true);
    setVideoError("");
    setVideoUrl("");

    try {
      const url = await fetchYoutubeVideo(
        `${problem.title} programming tutorial`,
      );

      if (url) {
        setVideoUrl(url);
      } else {
        setVideoError("No tutorial video found for this problem.");
      }
    } catch (error) {
      console.error("Failed to fetch YouTube video:", error);

      setVideoError("Unable to fetch a tutorial video.");
    } finally {
      setVideoLoading(false);
    }
  };

  /* =========================================================
     HINT
  ========================================================= */

  const handleHintClick = async (event) => {
    event.preventDefault();

    if (hintPopoverOpen) {
      setHintPopoverOpen(false);
      return;
    }

    setHintPopoverOpen(true);
    setHintLoading(true);
    setHintError("");
    setHints([]);
    setOpenHint(null);

    try {
      const description = problem?.description?.text || "";

      if (!description) {
        throw new Error("Problem description unavailable");
      }

      const result = await getHintFromGrok(description);

      if (Array.isArray(result)) {
        setHints(result);
      } else if (result && Array.isArray(result.hints)) {
        setHints(result.hints);
      } else if (typeof result === "string") {
        setHints([result]);
      } else {
        setHints([
          "Think about the data structure that can help you solve this efficiently.",
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch hint:", error);

      setHintError("Unable to generate hints right now.");
    } finally {
      setHintLoading(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const difficulty = problem?.difficulty?.toLowerCase();

  const difficultyStyles = {
    easy: {
      badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
      dot: "bg-emerald-400",
    },

    medium: {
      badge: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
      dot: "bg-yellow-400",
    },

    hard: {
      badge: "border-red-400/20 bg-red-400/10 text-red-400",
      dot: "bg-red-400",
    },
  };

  const currentDifficulty =
    difficultyStyles[difficulty] || difficultyStyles.medium;

  /* =========================================================
     SAFETY
  ========================================================= */

  if (!problem) {
    return (
      <div
        className="
        flex
        h-full
        items-center
        justify-center
        bg-[#090909]
        text-center
      "
      >
        <div>
          <span
            className="
            block
            text-sm
            font-medium
            text-zinc-300
          "
          >
            Problem not found
          </span>

          <p
            className="
            mt-2
            text-xs
            text-zinc-600
          "
          >
            The requested coding problem could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        h-full
        overflow-y-auto
        bg-[#090909]
        text-white
        [scrollbar-color:#27272a_#090909]
        [scrollbar-width:thin]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
        sticky
        top-0
        z-20
        border-b
        border-zinc-800
        bg-[#090909]/95
        px-5
        py-4
        backdrop-blur-xl
      "
      >
        {/* TOP ROW */}

        <div
          className="
          flex
          items-start
          justify-between
          gap-4
        "
        >
          {/* LEFT */}

          <div
            className="
            min-w-0
            flex-1
          "
          >
            <div
              className="
              mb-3
              flex
              flex-wrap
              items-center
              gap-2
            "
            >
              {/* NUMBER */}

              <span
                className="
                inline-flex
                items-center
                rounded-lg
                border
                border-yellow-400/20
                bg-yellow-400/10
                px-2.5
                py-1
                text-[10px]
                font-semibold
                text-yellow-400
              "
              >
                #{problem.sequenceNumber || problem.id}
              </span>

              {/* DIFFICULTY */}

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  ${currentDifficulty.badge}
                `}
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${currentDifficulty.dot}
                  `}
                />

                {problem.difficulty}
              </span>

              {/* CATEGORY */}

              {problem.category && (
                <span
                  className="
                  inline-flex
                  items-center
                  rounded-lg
                  border
                  border-zinc-800
                  bg-zinc-900
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  text-zinc-500
                "
                >
                  {problem.category}
                </span>
              )}
            </div>

            {/* TITLE */}

            <span
              className="
              block
              truncate
              text-xl
              font-semibold
              tracking-tight
              text-zinc-100
              sm:text-2xl
            "
            >
              {problem.title}
            </span>
          </div>

          {/* ACTIONS */}

          <div
            className="
            flex
            shrink-0
            items-center
            gap-2
          "
          >
            {/* ACCEPTED */}

            {isAccepted && (
              <div
                className="
                hidden
                items-center
                gap-1.5
                rounded-lg
                border
                border-emerald-400/20
                bg-emerald-400/10
                px-2.5
                py-2
                text-[10px]
                font-semibold
                text-emerald-400
                sm:flex
              "
              >
                <Check
                  className="
                  h-3.5
                  w-3.5
                "
                />
                Accepted
              </div>
            )}

            {/* VIDEO */}

            <button
              ref={videoBtnRef}
              type="button"
              onClick={handleVideoClick}
              title="Watch tutorial"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                text-zinc-500
                transition
                hover:border-red-400/30
                hover:bg-red-400/10
                hover:text-red-400
              "
            >
              <Play
                className="
                h-4
                w-4
                fill-current
              "
              />
            </button>

            {/* HINT */}

            <button
              ref={hintBtnRef}
              type="button"
              onClick={handleHintClick}
              title="Get a hint"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                text-zinc-500
                transition
                hover:border-yellow-400/30
                hover:bg-yellow-400/10
                hover:text-yellow-400
              "
            >
              <Lightbulb
                className="
                h-4
                w-4
              "
              />
            </button>
          </div>
        </div>

        {/* ACCEPTED MOBILE */}

        {isAccepted && (
          <div
            className="
            mt-3
            flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-emerald-400/20
            bg-emerald-400/10
            px-3
            py-2
            text-[10px]
            font-semibold
            text-emerald-400
            sm:hidden
          "
          >
            <Check
              className="
              h-3.5
              w-3.5
            "
            />
            All tests passed
          </div>
        )}

        {/* PROBLEM SELECTOR */}

        <div className="mt-4">
          <div className="relative">
            <select
              value={currentProblemId}
              onChange={(event) => onProblemChange(event.target.value)}
              className="
                h-10
                w-full
                appearance-none
                rounded-xl
                border
                border-zinc-800
                bg-[#111111]
                px-3
                pr-10
                text-xs
                text-zinc-400
                outline-none
                transition
                hover:border-zinc-700
                focus:border-yellow-400/40
              "
            >
              {allProblems.map((item) => (
                <option key={item.id} value={item.id} className="bg-[#111111]">
                  #{item.sequenceNumber || item.id}
                  {" - "}
                  {item.title}
                  {" - "}
                  {item.difficulty}
                </option>
              ))}
            </select>

            <ChevronDown
              className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-zinc-600
            "
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
        space-y-4
        p-5
      "
      >
        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <section
          className="
          rounded-2xl
          border
          border-zinc-800
          bg-[#111111]
          p-5
        "
        >
          <div
            className="
            mb-4
            flex
            items-center
            gap-2
          "
          >
            <span
              className="
              h-5
              w-1
              rounded-full
              bg-yellow-400"
            />

            <span
              className="
              text-sm
              font-semibold
              text-zinc-100
            "
            >
              Description
            </span>
          </div>

          <div
            className="
            space-y-4
            text-sm
            leading-6
            text-zinc-400
          "
          >
            <p>{problem.description?.text}</p>

            {problem.description?.notes?.map((note, index) => (
              <div
                key={index}
                className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-[#0d0d0d]
                    px-4
                    py-3
                    text-xs
                    leading-5
                    text-zinc-500
                  "
              >
                <span
                  className="
                    mr-2
                    text-yellow-400
                  "
                >
                  •
                </span>

                {note}
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            EXAMPLES
        =================================================== */}

        <section
          className="
          rounded-2xl
          border
          border-zinc-800
          bg-[#111111]
          p-5
        "
        >
          <div
            className="
            mb-5
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
                h-5
                w-1
                rounded-full
                bg-blue-400"
              />

              <span
                className="
                text-sm
                font-semibold
                text-zinc-100
              "
              >
                Examples
              </span>
            </div>

            <span
              className="
              text-[10px]
              text-zinc-600
            "
            >
              {problem.examples?.length || 0} examples
            </span>
          </div>

          <div className="space-y-4">
            {problem.examples?.map((example, index) => (
              <div
                key={index}
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-zinc-800
                    bg-[#0d0d0d]
                  "
              >
                {/* EXAMPLE HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-zinc-800
                    px-4
                    py-3
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
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-md
                        bg-zinc-800
                        text-[10px]
                        font-semibold
                        text-zinc-400
                      "
                    >
                      {index + 1}
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        text-zinc-300
                      "
                    >
                      Example {index + 1}
                    </span>
                  </div>
                </div>

                {/* INPUT */}

                <div
                  className="
                    border-b
                    border-zinc-800
                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      mb-1.5
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-blue-400
                      "
                    >
                      Input
                    </span>
                  </div>

                  <code
                    className="
                      block
                      whitespace-pre-wrap
                      break-words
                      text-xs
                      leading-5
                      text-zinc-300
                    "
                  >
                    {example.input}
                  </code>
                </div>

                {/* OUTPUT */}

                <div
                  className="
                    border-b
                    border-zinc-800
                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      mb-1.5
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-emerald-400
                      "
                    >
                      Output
                    </span>
                  </div>

                  <code
                    className="
                      block
                      whitespace-pre-wrap
                      break-words
                      text-xs
                      leading-5
                      text-zinc-300
                    "
                  >
                    {example.output}
                  </code>
                </div>

                {/* EXPLANATION */}

                {example.explanation && (
                  <div
                    className="
                      px-4
                      py-3
                    "
                  >
                    <span
                      className="
                        mb-1.5
                        block
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-yellow-400
                      "
                    >
                      Explanation
                    </span>

                    <p
                      className="
                        text-xs
                        leading-5
                        text-zinc-500
                      "
                    >
                      {example.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            CONSTRAINTS
        =================================================== */}

        <section
          className="
          rounded-2xl
          border
          border-zinc-800
          bg-[#111111]
          p-5
        "
        >
          <div
            className="
            mb-5
            flex
            items-center
            gap-2
          "
          >
            <span
              className="
              h-5
              w-1
              rounded-full
              bg-purple-400"
            />

            <span
              className="
              text-sm
              font-semibold
              text-zinc-100
            "
            >
              Constraints
            </span>
          </div>

          <div
            className="
            overflow-hidden
            rounded-xl
            border
            border-zinc-800
            bg-[#0d0d0d]
          "
          >
            {problem.constraints?.map((constraint, index) => (
              <div
                key={index}
                className="
                    flex
                    items-start
                    gap-3
                    border-b
                    border-zinc-800
                    px-4
                    py-3
                    last:border-b-0
                  "
              >
                <span
                  className="
                    mt-1.5
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-purple-400"
                />

                <code
                  className="
                    whitespace-pre-wrap
                    break-words
                    text-xs
                    leading-5
                    text-zinc-400
                  "
                >
                  {constraint}
                </code>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* =====================================================
          VIDEO POPOVER
      ===================================================== */}

      <Popover
        open={videoPopoverOpen}
        anchorRef={videoBtnRef}
        onClose={() => setVideoPopoverOpen(false)}
      >
        <div
          className="
          w-[320px]
          max-w-[calc(100vw-32px)]
        "
        >
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
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-red-400/10
              "
              >
                <Play
                  className="
                  h-3.5
                  w-3.5
                  fill-current
                  text-red-400
                "
                />
              </span>

              <div>
                <span
                  className="
                  block
                  text-xs
                  font-semibold
                  text-zinc-100
                "
                >
                  Tutorial
                </span>

                <span
                  className="
                  block
                  text-[10px]
                  text-zinc-500
                "
                >
                  Learn this problem
                </span>
              </div>
            </div>
          </div>

          {videoLoading && (
            <div
              className="
              flex
              min-h-[180px]
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-[#0d0d0d]
            "
            >
              <div
                className="
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-zinc-700
                border-t-red-400
              "
              />

              <span
                className="
                mt-3
                text-xs
                text-zinc-500
              "
              >
                Finding tutorial...
              </span>
            </div>
          )}

          {videoError && !videoLoading && (
            <div
              className="
              rounded-xl
              border
              border-zinc-800
              bg-[#0d0d0d]
              p-5
              text-center
            "
            >
              <span
                className="
                block
                text-xs
                text-zinc-500
              "
              >
                {videoError}
              </span>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${problem.title} programming tutorial`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-red-500
                  px-3
                  py-2
                  text-[10px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-400
                "
              >
                Search YouTube
                <ExternalLink
                  className="
                  h-3
                  w-3
                "
                />
              </a>
            </div>
          )}

          {videoUrl && !videoLoading && (
            <div
              className="
              overflow-hidden
              rounded-xl
              border
              border-zinc-800
              bg-black
            "
            >
              <div
                className="
                aspect-video
                w-full
              "
              >
                <iframe
                  className="
                    h-full
                    w-full
                  "
                  src={videoUrl
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "www.youtube.com/embed/")}
                  title="Problem tutorial"
                  frameBorder="0"
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                    web-share
                  "
                  allowFullScreen
                />
              </div>

              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  border-t
                  border-zinc-800
                  px-4
                  py-3
                  text-[10px]
                  font-medium
                  text-zinc-400
                  transition
                  hover:bg-zinc-900
                  hover:text-red-400
                "
              >
                Watch on YouTube
                <ExternalLink
                  className="
                  h-3
                  w-3
                "
                />
              </a>
            </div>
          )}
        </div>
      </Popover>

      {/* =====================================================
          HINT POPOVER
      ===================================================== */}

      <Popover
        open={hintPopoverOpen}
        anchorRef={hintBtnRef}
        onClose={() => setHintPopoverOpen(false)}
      >
        <div
          className="
          w-[340px]
          max-w-[calc(100vw-32px)]
        "
        >
          {/* HINT HEADER */}

          <div
            className="
            mb-4
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
              <Sparkles
                className="
                h-4
                w-4
                text-yellow-400
              "
              />
            </span>

            <div>
              <span
                className="
                block
                text-xs
                font-semibold
                text-zinc-100
              "
              >
                Smart Hints
              </span>

              <span
                className="
                block
                text-[10px]
                text-zinc-500
              "
              >
                Get guidance without the solution
              </span>
            </div>
          </div>

          {/* LOADING */}

          {hintLoading && (
            <div
              className="
              flex
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-[#0d0d0d]
              px-5
              py-8
            "
            >
              <div
                className="
                h-7
                w-7
                animate-spin
                rounded-full
                border-2
                border-zinc-700
                border-t-yellow-400
              "
              />

              <span
                className="
                mt-3
                text-xs
                text-zinc-500
              "
              >
                Thinking about the problem...
              </span>
            </div>
          )}

          {/* ERROR */}

          {hintError && !hintLoading && (
            <div
              className="
              rounded-xl
              border
              border-red-400/10
              bg-red-400/5
              px-4
              py-4
            "
            >
              <span
                className="
                text-xs
                text-red-400
              "
              >
                {hintError}
              </span>
            </div>
          )}

          {/* HINTS */}

          {!hintLoading && !hintError && hints.length > 0 && (
            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-[#0d0d0d]
              "
            >
              {hints.map((hint, index) => {
                const isOpen = openHint === index;

                return (
                  <div
                    key={index}
                    className="
                          border-b
                          border-zinc-800
                          last:border-b-0
                        "
                  >
                    <button
                      type="button"
                      onClick={() => setOpenHint(isOpen ? null : index)}
                      className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-3
                            py-3
                            text-left
                            transition
                            hover:bg-zinc-900
                          "
                    >
                      <span
                        className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-yellow-400/10
                            text-yellow-400
                          "
                      >
                        <Lightbulb
                          className="
                              h-3
                              w-3
                            "
                        />
                      </span>

                      <span
                        className="
                            flex-1
                            text-xs
                            font-medium
                            text-zinc-300
                          "
                      >
                        Hint {index + 1}
                      </span>

                      <ChevronRight
                        className={`
                              h-3.5
                              w-3.5
                              text-zinc-600
                              transition-transform
                              ${isOpen ? "rotate-90" : ""}
                            `}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="
                            border-t
                            border-zinc-800
                            px-4
                            py-4
                          "
                      >
                        <p
                          className="
                              whitespace-pre-line
                              text-xs
                              leading-5
                              text-zinc-500
                            "
                        >
                          {hint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* NO HINT */}

          {!hintLoading && !hintError && hints.length === 0 && (
            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-[#0d0d0d]
                px-4
                py-5
                text-center
              "
            >
              <span
                className="
                  text-xs
                  text-zinc-500
                "
              >
                No hints available.
              </span>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
}

export default ProblemDescription;
