import { useState } from "react";
import { Activity, Clock3, Users, Trophy, ChevronDown } from "lucide-react";

export default function StatsCards({
  activeSessionsCount,
  recentSessionsCount,
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className="grid grid-cols-2 gap-3">
      {/* Live Sessions */}
      <div className="rounded-xl border border-zinc-800 bg-[#111] p-4 transition-all hover:border-yellow-400/40">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10">
            <Activity className="h-4 w-4 text-yellow-400" />
          </div>

          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
            Live
          </span>
        </div>

        <p className="mt-3 text-base text-zinc-500">Live Sessions</p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          {activeSessionsCount}
        </h2>
      </div>

      {/* Your Sessions */}
      <div className="rounded-xl border border-zinc-800 bg-[#111] p-4 transition-all hover:border-yellow-400/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10">
          <Clock3 className="h-4 w-4 text-yellow-400" />
        </div>

        <p className="mt-3 text-base text-zinc-500">Your Sessions</p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          {recentSessionsCount}
        </h2>
      </div>

      {/* Interview Rooms */}
      <div className="rounded-xl border border-zinc-800 bg-[#111] p-4 transition-all hover:border-yellow-400/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10">
          <Users className="h-4 w-4 text-yellow-400" />
        </div>

        <p className="mt-3 text-base text-zinc-500">Room Capacity</p>

        <h2 className="mt-1 text-2xl font-bold text-white">2</h2>
      </div>

      {/* Success Score */}
      <div className="rounded-xl border border-zinc-800 bg-[#111] p-4 transition-all hover:border-yellow-400/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10">
          <Trophy className="h-4 w-4 text-yellow-400" />
        </div>

        <p className="mt-3 text-base text-zinc-500">Success Score</p>

        <h2 className="mt-1 text-2xl font-bold text-white">94%</h2>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-[94%] rounded-full bg-yellow-400" />
        </div>
      </div>
    </section>
  );
}
