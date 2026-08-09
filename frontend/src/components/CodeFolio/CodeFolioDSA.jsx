import { BarChart3, TrendingUp, Target } from "lucide-react";

function CodeFolioDSA() {
  const dsaData = [
    { name: "Arrays", value: 480, max: 500 },
    { name: "Strings", value: 320, max: 400 },
    { name: "HashMaps", value: 280, max: 350 },
    { name: "Sorting", value: 245, max: 300 },
    { name: "Math", value: 198, max: 250 },
    { name: "Greedy", value: 156, max: 200 },
    { name: "Dynamic Prog.", value: 124, max: 200 },
    { name: "Binary Search", value: 98, max: 150 },
    { name: "DFS", value: 87, max: 150 },
    { name: "BFS", value: 76, max: 150 },
  ];

  const totalSolved = dsaData.reduce((sum, item) => sum + item.value, 0);

  const totalTarget = dsaData.reduce((sum, item) => sum + item.max, 0);

  const overallProgress = Math.round((totalSolved / totalTarget) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10">
            <BarChart3 className="h-4.5 w-4.5 text-yellow-400" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              DSA Progress
            </span>

            <span className="text-xs text-zinc-500">
              Topic-wise problem solving
            </span>
          </div>
        </div>

        {/* Overall */}

        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400" />

          <span className="text-sm font-semibold text-white">
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY                                           */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 border-b border-zinc-800">
        <div className="border-r border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Problems Solved</span>
          </div>

          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{totalSolved}</span>

            <span className="text-xs text-zinc-600">/ {totalTarget}</span>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Target size={13} className="text-yellow-400" />

            <span className="text-xs text-zinc-500">Overall Target</span>
          </div>

          <span className="mt-1 block text-xl font-bold text-white">
            {totalTarget}
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* TOPICS                                           */}
      {/* ================================================= */}

      <div className="px-5 py-5">
        <div className="space-y-4">
          {dsaData.map((topic) => {
            const progress = Math.round((topic.value / topic.max) * 100);

            return (
              <div key={topic.name}>
                {/* Topic Header */}

                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">
                    {topic.name}
                  </span>

                  <span className="text-[11px] text-zinc-500">
                    {topic.value}
                    <span className="text-zinc-700"> / {topic.max}</span>
                  </span>
                </div>

                {/* Progress */}

                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================= */}
      {/* FOOTER                                           */}
      {/* ================================================= */}

      <div className="border-t border-zinc-800 bg-[#0d0d0d] px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-600">DSA topic coverage</span>

          <span className="text-[11px] font-medium text-yellow-400">
            {overallProgress}% complete
          </span>
        </div>
      </div>
    </div>
  );
}

export default CodeFolioDSA;
