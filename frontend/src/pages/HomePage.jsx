import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Code2,
  Github,
  Linkedin,
  Sparkles,
  Terminal,
  Trophy,
  Video,
  Zap,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

/* =========================================================
   SMOOTH CURSOR GRID
========================================================= */

function CursorGrid() {
  const targetMouse = useRef({ x: -500, y: -500 });
  const currentMouse = useRef({ x: -500, y: -500 });
  const animationFrame = useRef(null);

  const [mouse, setMouse] = useState({
    x: -500,
    y: -500,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      targetMouse.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const current = currentMouse.current;
      const target = targetMouse.current;

      current.x += (target.x - current.x) * 0.85;
      current.y += (target.y - current.y) * 0.85;

      setMouse({
        x: current.x,
        y: current.y,
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden md:block">
      {/* =====================================================
          BASE GRID
      ===================================================== */}

      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.06) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* =====================================================
          CURSOR GLOW GRID
      ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(250,204,21,0.45) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(250,204,21,0.45) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",

          maskImage: `
            radial-gradient(
              circle 220px at ${mouse.x}px ${mouse.y}px,
              black 0%,
              rgba(0,0,0,0.85) 28%,
              rgba(0,0,0,0.45) 50%,
              transparent 78%
            )
          `,

          WebkitMaskImage: `
            radial-gradient(
              circle 220px at ${mouse.x}px ${mouse.y}px,
              black 0%,
              rgba(0,0,0,0.85) 28%,
              rgba(0,0,0,0.45) 50%,
              transparent 78%
            )
          `,
        }}
      />

      {/* =====================================================
          SECONDARY SOFT GRID
      ===================================================== */}

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(250,204,21,0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(250,204,21,0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "96px 96px",
          transform: `
            translate(
              ${mouse.x * 0.003}px,
              ${mouse.y * 0.003}px
            )
          `,
        }}
      />

      {/* =====================================================
          LARGE CURSOR GLOW
      ===================================================== */}

      <div
        className="
          absolute
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-yellow-400/[0.045]
          blur-[90px]
        "
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* =====================================================
          SMALL INNER GLOW
      ===================================================== */}

      <div
        className="
          absolute
          h-[150px]
          w-[150px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-yellow-400/[0.035]
          blur-[40px]
        "
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* =====================================================
          CURSOR CORE
      ===================================================== */}

      <div
        className="
          absolute
          h-2
          w-2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-yellow-300
          shadow-[0_0_12px_rgba(250,204,21,0.9),0_0_30px_rgba(250,204,21,0.45)]
        "
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* =====================================================
          CURSOR RING
      ===================================================== */}

      <div
        className="
          absolute
          h-8
          w-8
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-yellow-400/20
        "
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />
    </div>
  );
}

/* =========================================================
   INTERACTIVE FEATURE CARD
========================================================= */

function FeatureCard({ feature }) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  const Icon = feature.icon;

  const handleMouseMove = (event) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPosition({
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setPosition({
      x: 50,
      y: 50,
    });
  };

  return (
    <SignInButton mode="modal">
      <button
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          group
          relative
          min-h-[270px]
          overflow-hidden
          bg-[#101010]
          p-6
          text-left
          transition-all
          duration-300
          hover:bg-[#141414]
          sm:p-8
        "
      >
        {/* Cursor spotlight inside card */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
          style={{
            background: `
              radial-gradient(
                circle 180px at ${position.x}% ${position.y}%,
                rgba(250,204,21,0.09),
                transparent 70%
              )
            `,
          }}
        />

        {/* Border glow */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
          style={{
            background: `
              radial-gradient(
                circle 120px at ${position.x}% ${position.y}%,
                rgba(250,204,21,0.25),
                transparent 70%
              )
            `,
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900
              transition-all
              duration-300
              group-hover:border-yellow-400/30
              group-hover:bg-yellow-400/10
              group-hover:shadow-[0_0_25px_rgba(250,204,21,0.08)]
            "
          >
            <Icon
              className="
                h-5
                w-5
                text-zinc-500
                transition
                duration-300
                group-hover:text-yellow-400
              "
            />
          </div>

          <span
            className="
              font-mono
              text-[10px]
              text-zinc-700
              transition
              group-hover:text-yellow-400/50
            "
          >
            {feature.number}
          </span>
        </div>

        <span
          className="
            relative
            z-10
            mt-8
            block
            text-lg
            font-semibold
            text-zinc-100
          "
        >
          {feature.title}
        </span>

        <p
          className="
            relative
            z-10
            mt-3
            max-w-md
            text-xs
            leading-6
            text-zinc-600
            transition
            group-hover:text-zinc-500
          "
        >
          {feature.description}
        </p>

        <div
          className="
            relative
            z-10
            mt-8
            flex
            items-center
            gap-2
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-zinc-700
            transition
            group-hover:text-yellow-400
          "
        >
          Explore
          <ArrowUpRight
            className="
              h-3.5
              w-3.5
              transition-transform
              group-hover:translate-x-1
              group-hover:-translate-y-1
            "
          />
        </div>
      </button>
    </SignInButton>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  const features = [
    {
      number: "01",
      icon: BrainCircuit,
      title: "AI Mock Interviews",
      description:
        "Practice realistic technical interviews with AI-generated questions, follow-ups, and feedback based on your performance.",
    },
    {
      number: "02",
      icon: Code2,
      title: "Live Coding",
      description:
        "Solve real coding problems in a collaborative editor with language support, execution, and instant results.",
    },
    {
      number: "03",
      icon: Video,
      title: "Video Collaboration",
      description:
        "Practice interviews with another developer using live video, screen collaboration, chat, and shared coding.",
    },
    {
      number: "04",
      icon: Trophy,
      title: "Performance Tracking",
      description:
        "Track your solved problems, contest activity, interview performance, and technical progress in one place.",
    },
  ];

  const stats = [
    {
      value: "100+",
      label: "Coding Problems",
    },
    {
      value: "24/7",
      label: "Practice Access",
    },
    {
      value: "AI",
      label: "Powered Feedback",
    },
    {
      value: "Live",
      label: "Collaboration",
    },
  ];

  const workflow = [
    {
      step: "01",
      title: "Choose your challenge",
      description:
        "Pick a coding problem, interview mode, or practice track based on your goals.",
    },
    {
      step: "02",
      title: "Code and communicate",
      description:
        "Solve problems while explaining your thinking just like a real technical interview.",
    },
    {
      step: "03",
      title: "Review your performance",
      description:
        "Use results, feedback, hints, and analytics to identify what you should improve next.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
      <CursorGrid />

      <div className="relative z-10">
        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <nav
          className="
            fixed
            inset-x-0
            top-0
            z-50
            border-b
            border-zinc-800/70
            bg-[#090909]/75
            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto
              flex
              h-20
              max-w-7xl
              items-center
              justify-between
              px-5
              lg:px-8
            "
          >
            <Link
              to="/"
              className="
                group
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/10
                  transition
                  group-hover:border-yellow-400/40
                  group-hover:shadow-[0_0_25px_rgba(250,204,21,0.1)]
                "
              >
                <img
                  src="/logo.png"
                  alt="IntelliView"
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div>
                <span
                  className="
                    block
                    text-sm
                    font-bold
                    tracking-[0.18em]
                    text-white
                  "
                >
                  INTELLIVIEW
                </span>

                <span
                  className="
                    block
                    text-[9px]
                    tracking-[0.2em]
                    text-zinc-600
                  "
                >
                  CODE • INTERVIEW • GROW
                </span>
              </div>
            </Link>

            <div
              className="
                hidden
                items-center
                gap-8
                md:flex
              "
            >
              <a
                href="#features"
                className="
                  text-xs
                  text-zinc-500
                  transition
                  hover:text-yellow-400
                "
              >
                Features
              </a>

              <a
                href="#workflow"
                className="
                  text-xs
                  text-zinc-500
                  transition
                  hover:text-yellow-400
                "
              >
                How it works
              </a>

              <a
                href="#about"
                className="
                  text-xs
                  text-zinc-500
                  transition
                  hover:text-yellow-400
                "
              >
                Platform
              </a>
            </div>

            <SignInButton mode="modal">
              <button
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-yellow-400
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-black
                  transition-all
                  hover:bg-yellow-300
                  hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]
                "
              >
                Get Started
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </SignInButton>
          </div>
        </nav>

        {/* =====================================================
            HERO
        ===================================================== */}

        <main>
          <section
            className="
              relative
              min-h-screen
              overflow-hidden
              pt-20
            "
          >
            {/* Background glow */}

            <div
              className="
                pointer-events-none
                absolute
                -left-40
                top-20
                h-96
                w-96
                rounded-full
                bg-yellow-400/10
                blur-[120px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-40
                top-40
                h-[500px]
                w-[500px]
                rounded-full
                bg-blue-500/5
                blur-[140px]
              "
            />

            <div
              className="
                relative
                mx-auto
                grid
                min-h-[calc(100vh-80px)]
                max-w-7xl
                items-center
                gap-12
                px-5
                py-16
                lg:grid-cols-[1.05fr_0.95fr]
                lg:px-8
                lg:py-24
              "
            >
              {/* HERO COPY */}

              <div>
                <div
                  className="
                    mb-7
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-yellow-400/20
                    bg-yellow-400/5
                    px-3
                    py-1.5
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-pulse
                      rounded-full
                      bg-yellow-400
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-medium
                      tracking-[0.15em]
                      text-yellow-400
                    "
                  >
                    AI-POWERED INTERVIEW PLATFORM
                  </span>
                </div>

                <span
                  className="
                    block
                    max-w-4xl
                    text-5xl
                    font-bold
                    leading-[0.98]
                    tracking-[-0.04em]
                    text-white
                    sm:text-6xl
                    lg:text-7xl
                    xl:text-[82px]
                  "
                >
                  Prepare smarter.
                  <br />
                  <span className="text-yellow-400">Perform better.</span>
                </span>

                <p
                  className="
                    mt-7
                    max-w-2xl
                    text-base
                    leading-7
                    text-zinc-500
                    sm:text-lg
                  "
                >
                  IntelliView helps developers prepare for technical interviews
                  through coding practice, AI-powered mock interviews, live
                  collaboration, and actionable feedback.
                </p>

                <div
                  className="
                    mt-9
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                  "
                >
                  <SignInButton mode="modal">
                    <button
                      className="
                        group
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-yellow-400
                        px-6
                        py-3.5
                        text-sm
                        font-semibold
                        text-black
                        transition-all
                        hover:bg-yellow-300
                        hover:shadow-[0_0_35px_rgba(250,204,21,0.18)]
                      "
                    >
                      Start Practicing
                      <ArrowRight
                        className="
                          h-4
                          w-4
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    </button>
                  </SignInButton>

                  <Link
                    to="/resources"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-6
                      py-3.5
                      text-sm
                      font-medium
                      text-zinc-300
                      transition-all
                      hover:border-yellow-400/20
                      hover:bg-[#151515]
                      hover:text-white
                    "
                  >
                    Explore Resources
                  </Link>
                </div>

                {/* TRUST */}

                <div
                  className="
                    mt-10
                    flex
                    flex-wrap
                    items-center
                    gap-x-6
                    gap-y-3
                  "
                >
                  {[
                    "Real coding environment",
                    "AI feedback",
                    "Live collaboration",
                  ].map((item) => (
                    <div
                      key={item}
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-zinc-600
                      "
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-400" />

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* HERO PRODUCT PREVIEW */}

              <div
                className="
                  relative
                  mx-auto
                  w-full
                  max-w-xl
                "
              >
                <div
                  className="
                    absolute
                    -inset-5
                    rounded-[32px]
                    bg-yellow-400/5
                    blur-2xl
                  "
                />

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    shadow-2xl
                    transition-all
                    duration-500
                    hover:border-yellow-400/20
                    hover:shadow-[0_0_70px_rgba(250,204,21,0.07)]
                  "
                >
                  {/* Window top */}

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
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    </div>

                    <span
                      className="
                        text-[9px]
                        tracking-[0.15em]
                        text-zinc-600
                      "
                    >
                      INTELLIVIEW / INTERVIEW
                    </span>
                  </div>

                  {/* Interview header */}

                  <div
                    className="
                      border-b
                      border-zinc-800
                      px-5
                      py-4
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="
                            block
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-zinc-600
                          "
                        >
                          Technical Interview
                        </span>

                        <span
                          className="
                            mt-1
                            block
                            text-sm
                            font-semibold
                            text-zinc-200
                          "
                        >
                          Two Sum
                        </span>
                      </div>

                      <span
                        className="
                          rounded-lg
                          bg-emerald-400/10
                          px-2
                          py-1
                          text-[9px]
                          font-medium
                          text-emerald-400
                        "
                      >
                        LIVE
                      </span>
                    </div>
                  </div>

                  {/* Editor */}

                  <div
                    className="
                      grid
                      grid-cols-[44px_1fr]
                      bg-[#0c0c0c]
                    "
                  >
                    <div
                      className="
                        border-r
                        border-zinc-800
                        py-4
                        text-center
                        font-mono
                        text-[10px]
                        leading-5
                        text-zinc-700
                      "
                    >
                      1
                      <br />
                      2
                      <br />
                      3
                      <br />
                      4
                      <br />
                      5
                      <br />
                      6
                      <br />
                      7
                      <br />8
                    </div>

                    <div
                      className="
                        overflow-hidden
                        p-4
                        font-mono
                        text-[11px]
                        leading-5
                        sm:text-xs
                      "
                    >
                      <span className="text-purple-400">def</span>{" "}
                      <span className="text-blue-300">two_sum</span>
                      <span className="text-zinc-400">(nums, target):</span>
                      <br />
                      <span className="text-zinc-500">
                        {"    "}seen = {"{}"}
                      </span>
                      <br />
                      <span className="text-purple-400">{"    "}for</span>{" "}
                      <span className="text-zinc-300">i, num</span>{" "}
                      <span className="text-purple-400">in</span>{" "}
                      <span className="text-zinc-300">enumerate(nums):</span>
                      <br />
                      <span className="text-zinc-500">
                        {"        "}
                        complement = target - num
                      </span>
                      <br />
                      <span className="text-purple-400">
                        {"        "}if
                      </span>{" "}
                      <span className="text-yellow-300">complement</span>{" "}
                      <span className="text-zinc-400">in seen:</span>
                      <br />
                      <span className="text-zinc-500">
                        {"            "}
                        return [seen[complement], i]
                      </span>
                      <br />
                      <span className="text-zinc-500">
                        {"        "}
                        seen[num] = i
                      </span>
                      <br />
                      <span className="text-purple-400">
                        {"    "}return
                      </span>{" "}
                      <span className="text-zinc-500">[]</span>
                    </div>
                  </div>

                  {/* AI feedback */}

                  <div
                    className="
                      border-t
                      border-zinc-800
                      bg-[#111111]
                      p-4
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-yellow-400/10
                        "
                      >
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </div>

                      <div>
                        <span
                          className="
                            block
                            text-xs
                            font-semibold
                            text-zinc-200
                          "
                        >
                          AI Feedback
                        </span>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            leading-4
                            text-zinc-500
                          "
                        >
                          Good approach. Your solution uses a hash map and
                          achieves O(n) time complexity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom status */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-t
                      border-zinc-800
                      px-4
                      py-3
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        text-zinc-600
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-emerald-400
                        "
                      />
                      Connected
                    </span>

                    <span className="text-[10px] text-zinc-600">
                      18:42 remaining
                    </span>
                  </div>
                </div>

                {/* Floating performance */}

                <div
                  className="
                    absolute
                    -bottom-5
                    -left-5
                    hidden
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#111111]
                    p-4
                    shadow-2xl
                    sm:block
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-400/10
                      "
                    >
                      <Zap className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <span
                        className="
                          block
                          text-[9px]
                          uppercase
                          tracking-wider
                          text-zinc-600
                        "
                      >
                        Performance
                      </span>

                      <span
                        className="
                          block
                          text-lg
                          font-bold
                          text-white
                        "
                      >
                        92%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll */}

            <button
              onClick={() =>
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                })
              }
              className="
                absolute
                bottom-8
                left-1/2
                hidden
                -translate-x-1/2
                flex-col
                items-center
                gap-2
                text-zinc-600
                transition
                hover:text-yellow-400
                md:flex
              "
            >
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                "
              >
                Explore
              </span>

              <ArrowDown className="h-4 w-4 animate-bounce" />
            </button>
          </section>

          {/* =====================================================
              STATS
          ===================================================== */}

          <section
            className="
              border-y
              border-zinc-800
              bg-[#0d0d0d]
            "
          >
            <div
              className="
                mx-auto
                grid
                max-w-7xl
                grid-cols-2
                lg:grid-cols-4
              "
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`
                    px-5
                    py-8
                    lg:px-8
                    lg:py-10
                    ${index !== 3 ? "border-r border-zinc-800" : ""}
                  `}
                >
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
                    {stat.value}
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                      text-zinc-600
                    "
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================
              ABOUT
          ===================================================== */}

          <section
            id="about"
            className="
              border-b
              border-zinc-800
              bg-[#090909]
              px-5
              py-24
              lg:px-8
              lg:py-32
            "
          >
            <div className="mx-auto max-w-7xl">
              <div
                className="
                  grid
                  gap-12
                  lg:grid-cols-[0.8fr_1.2fr]
                  lg:items-end
                "
              >
                <div>
                  <span
                    className="
                      inline-flex
                      rounded-full
                      border
                      border-zinc-800
                      bg-[#111111]
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-wider
                      text-yellow-400
                    "
                  >
                    Built for developers
                  </span>

                  <span
                    className="
                      mt-5
                      block
                      text-4xl
                      font-bold
                      leading-tight
                      tracking-tight
                      text-white
                      sm:text-5xl
                    "
                  >
                    Everything you need
                    <br />
                    <span className="text-zinc-600">to interview better.</span>
                  </span>
                </div>

                <p
                  className="
                    max-w-2xl
                    text-base
                    leading-7
                    text-zinc-500
                    lg:text-lg
                  "
                >
                  Interviews are not only about solving a problem. You need to
                  communicate your approach, write clean code, understand
                  trade-offs, and perform under pressure. IntelliView brings all
                  of that into one focused workspace.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              FEATURES
          ===================================================== */}

          <section
            id="features"
            className="
              border-b
              border-zinc-800
              bg-[#0d0d0d]
              px-5
              py-20
              lg:px-8
              lg:py-28
            "
          >
            <div className="mx-auto max-w-7xl">
              <div
                className="
                  mb-12
                  flex
                  flex-col
                  justify-between
                  gap-5
                  sm:flex-row
                  sm:items-end
                "
              >
                <div>
                  <span
                    className="
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-yellow-400
                    "
                  >
                    The platform
                  </span>

                  <span
                    className="
                      mt-2
                      block
                      text-3xl
                      font-bold
                      tracking-tight
                      text-white
                      sm:text-4xl
                    "
                  >
                    One workspace.
                    <br />
                    Multiple ways to improve.
                  </span>
                </div>

                <span
                  className="
                    max-w-sm
                    text-xs
                    leading-5
                    text-zinc-600
                  "
                >
                  From your first coding problem to your final mock interview,
                  IntelliView keeps your preparation focused.
                </span>
              </div>

              <div
                className="
                  grid
                  gap-px
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-800
                  md:grid-cols-2
                "
              >
                {features.map((feature) => (
                  <FeatureCard key={feature.number} feature={feature} />
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================
              WORKFLOW
          ===================================================== */}

          <section
            id="workflow"
            className="
              border-b
              border-zinc-800
              bg-[#090909]
              px-5
              py-24
              lg:px-8
              lg:py-32
            "
          >
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 max-w-2xl">
                <span
                  className="
                    block
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-yellow-400
                  "
                >
                  Simple workflow
                </span>

                <span
                  className="
                    mt-3
                    block
                    text-3xl
                    font-bold
                    tracking-tight
                    text-white
                    sm:text-4xl
                  "
                >
                  Practice like it's
                  <br />
                  the real interview.
                </span>
              </div>

              <div
                className="
                  grid
                  gap-px
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-800
                  lg:grid-cols-3
                "
              >
                {workflow.map((item, index) => (
                  <div
                    key={item.step}
                    className="
                      group
                      relative
                      bg-[#111111]
                      p-7
                      transition
                      hover:bg-[#141414]
                      lg:p-9
                    "
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-yellow-400/10
                          text-[10px]
                          font-semibold
                          text-yellow-400
                        "
                      >
                        {item.step}
                      </span>

                      {index < workflow.length - 1 && (
                        <ArrowRight
                          className="
                            hidden
                            h-4
                            w-4
                            text-zinc-800
                            transition
                            group-hover:text-yellow-400/40
                            lg:block
                          "
                        />
                      )}
                    </div>

                    <span
                      className="
                        mt-8
                        block
                        text-lg
                        font-semibold
                        text-white
                      "
                    >
                      {item.title}
                    </span>

                    <p
                      className="
                        mt-3
                        text-xs
                        leading-6
                        text-zinc-600
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================
              CTA
          ===================================================== */}

          <section
            className="
              relative
              overflow-hidden
              border-b
              border-zinc-800
              bg-[#0d0d0d]
              px-5
              py-20
              lg:px-8
              lg:py-28
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-96
                w-96
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-yellow-400/5
                blur-[100px]
              "
            />

            <div
              className="
                relative
                mx-auto
                max-w-5xl
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/10
                "
              >
                <Terminal className="h-6 w-6 text-yellow-400" />
              </div>

              <span
                className="
                  mt-7
                  block
                  text-4xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Stop preparing randomly.
                <br />
                <span className="text-yellow-400">
                  Start preparing intentionally.
                </span>
              </span>

              <p
                className="
                  mx-auto
                  mt-6
                  max-w-2xl
                  text-sm
                  leading-6
                  text-zinc-500
                  sm:text-base
                "
              >
                Build consistency through structured practice, realistic
                interview simulations, and feedback that tells you exactly where
                to improve.
              </p>

              <div
                className="
                  mt-9
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  sm:flex-row
                "
              >
                <SignInButton mode="modal">
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-yellow-400
                      px-6
                      py-3.5
                      text-sm
                      font-semibold
                      text-black
                      transition-all
                      hover:bg-yellow-300
                      hover:shadow-[0_0_40px_rgba(250,204,21,0.2)]
                    "
                  >
                    Start Your Preparation
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignInButton>

                <Link
                  to="/problems"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-zinc-800
                    px-6
                    py-3.5
                    text-sm
                    text-zinc-400
                    transition
                    hover:border-yellow-400/20
                    hover:text-white
                  "
                >
                  Browse Problems
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer
          className="
            bg-[#090909]
            px-5
            py-16
            lg:px-8
          "
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="
                grid
                gap-12
                md:grid-cols-[1.3fr_0.7fr]
              "
            >
              {/* BRAND */}

              <div>
                <Link
                  to="/"
                  className="
                    inline-flex
                    items-center
                    gap-3
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
                      border
                      border-yellow-400/20
                      bg-yellow-400/10
                    "
                  >
                    <img
                      src="/logo.png"
                      alt="IntelliView"
                      className="h-6 w-6 object-contain"
                    />
                  </div>

                  <span
                    className="
                      text-sm
                      font-bold
                      tracking-[0.18em]
                      text-white
                    "
                  >
                    INTELLIVIEW
                  </span>
                </Link>

                <p
                  className="
                    mt-5
                    max-w-md
                    text-xs
                    leading-6
                    text-zinc-600
                  "
                >
                  A focused workspace for developers who want to practice
                  coding, simulate interviews, collaborate, and improve with
                  confidence.
                </p>

                {/* Dev */}

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    gap-3
                  "
                >
                  <img
                    src="/profile.png"
                    alt="Dev Lavaniya"
                    className="
                      h-10
                      w-10
                      rounded-full
                      border
                      border-zinc-800
                      object-cover
                    "
                  />

                  <div>
                    <span
                      className="
                        block
                        text-base
                        font-medium
                        text-zinc-400
                      "
                    >
                      Dev Lavaniya
                    </span>

                    <span
                      className="
                        block
                        text-[12px]
                        text-zinc-500
                      "
                    >
                      Creator of IntelliView
                    </span>
                  </div>
                </div>
              </div>

              {/* LINKS */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-8
                  sm:grid-cols-3
                  md:grid-cols-2
                "
              >
                <div>
                  <span
                    className="
                      block
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-zinc-700
                    "
                  >
                    Platform
                  </span>

                  <div className="mt-4 space-y-3">
                    <Link
                      to="/problems"
                      className="
                        block
                        text-xs
                        text-zinc-500
                        transition
                        hover:text-yellow-400
                      "
                    >
                      Problems
                    </Link>

                    <Link
                      to="/resources"
                      className="
                        block
                        text-xs
                        text-zinc-500
                        transition
                        hover:text-yellow-400
                      "
                    >
                      Resources
                    </Link>

                    <Link
                      to="/contests"
                      className="
                        block
                        text-xs
                        text-zinc-500
                        transition
                        hover:text-yellow-400
                      "
                    >
                      Contests
                    </Link>
                  </div>
                </div>

                <div>
                  <span
                    className="
                      block
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-zinc-700
                    "
                  >
                    Connect
                  </span>

                  <div className="mt-4 flex gap-2">
                    <a
                      href="https://github.com/devlavaniya"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-zinc-800
                        text-zinc-600
                        transition
                        hover:border-yellow-400/20
                        hover:bg-yellow-400/10
                        hover:text-yellow-400
                      "
                    >
                      <Github className="h-4 w-4" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/dev-lavaniya/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-zinc-800
                        text-zinc-600
                        transition
                        hover:border-yellow-400/20
                        hover:bg-yellow-400/10
                        hover:text-yellow-400
                      "
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
                mt-14
                flex
                flex-col
                gap-3
                border-t
                border-zinc-800
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <span
                className="
                  text-base
                  uppercase
                  tracking-[0.15em]
                  text-zinc-400
                "
              >
                © {new Date().getFullYear()} IntelliView
              </span>

              <span
                className="
                  text-base
                  uppercase
                  tracking-[0.15em]
                  text-zinc-400
                "
              >
                Built by Dev Lavaniya
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
