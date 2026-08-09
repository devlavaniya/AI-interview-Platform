import {
  ArrowRight,
  Clock3,
  Copy,
  Users,
  User,
  Check,
} from "lucide-react";
import { useState } from "react";

export default function OngoingSession({
  session,
  onRejoin,
  isLoading,
}) {
  const [copied, setCopied] = useState(false);

  if (!session) return null;

  const participantCount = session.participant ? 2 : 1;
  const waiting = !session.participant;

  const copyCode = () => {
    navigator.clipboard.writeText(session.sessionCode);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-green-500/20
      bg-gradient-to-br
      from-[#151515]
      via-[#101010]
      to-[#0b0b0b]
      p-8
      shadow-2xl
      "
    >
      {/* Glow */}

      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

      {/* Header */}

      <div className="relative flex items-center justify-between">

        <div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">

            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            <span className="text-xs font-semibold tracking-[0.25em] text-green-400 uppercase">
              Live Session
            </span>

          </div>

          <h2 className="text-4xl font-bold text-white">
            {session.problem}
          </h2>

          <p className="mt-2 text-zinc-500">
            Continue collaborating with your teammate.
          </p>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4">

          <Clock3 className="mx-auto mb-2 h-8 w-8 text-yellow-400" />

          <p className="text-center text-sm text-zinc-400">
            Session Active
          </p>

        </div>

      </div>

      {/* Info */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        {/* Host */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

          <User className="mb-3 h-7 w-7 text-yellow-400" />

          <p className="text-sm text-zinc-500">
            Host
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {session.host?.name || "You"}
          </h3>

        </div>

        {/* Participants */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

          <Users className="mb-3 h-7 w-7 text-green-400" />

          <p className="text-sm text-zinc-500">
            Participants
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {participantCount}/2
          </h3>

        </div>

        {/* Code */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

          <p className="text-sm text-zinc-500">
            Session Code
          </p>

          <div className="mt-3 flex items-center justify-between">

            <span className="font-mono text-lg font-bold tracking-widest text-yellow-400">
              {session.sessionCode}
            </span>

            <button
              onClick={copyCode}
              className="rounded-lg bg-zinc-800 p-2 transition hover:bg-zinc-700"
            >
              {copied ? (
                <Check
                  size={18}
                  className="text-green-400"
                />
              ) : (
                <Copy
                  size={18}
                  className="text-zinc-400"
                />
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Waiting */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

        {waiting ? (
          <div className="flex items-center gap-3">

            <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400" />

            <span className="text-zinc-300">
              Waiting for another participant to join...
            </span>

          </div>
        ) : (
          <div className="flex items-center gap-3">

            <div className="h-3 w-3 rounded-full bg-green-400" />

            <span className="text-green-400">
              Both participants are connected.
            </span>

          </div>
        )}

      </div>

      {/* Button */}

      <button
        onClick={onRejoin}
        disabled={isLoading}
        className="
        mt-8
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        bg-yellow-400
        py-4
        text-lg
        font-semibold
        text-black
        transition
        hover:bg-yellow-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        "
      >
        <ArrowRight size={22} />

        {isLoading
          ? "Joining..."
          : "Rejoin Session"}
      </button>
    </section>
  );
}