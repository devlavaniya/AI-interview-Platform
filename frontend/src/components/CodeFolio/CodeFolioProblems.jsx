import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function CodeFolioProblems({ stats = {} }) {
  const easy = Number(stats.easy) || 0;
  const medium = Number(stats.medium) || 0;
  const hard = Number(stats.hard) || 0;

  const totalSolved = easy + medium + hard;

  const problemsData = [
    {
      name: "Easy",
      value: easy,
      color: "#22c55e",
    },
    {
      name: "Medium",
      value: medium,
      color: "#eab308",
    },
    {
      name: "Hard",
      value: hard,
      color: "#ef4444",
    },
  ];

  const getPercentage = (value) => {
    if (!totalSolved) return 0;

    return Math.round((value / totalSolved) * 100);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            Problems Solved
          </span>

          <span className="text-xs text-zinc-500">Difficulty breakdown</span>
        </div>

        <div className="text-right">
          <span className="block text-xl font-bold text-white">
            {totalSolved}
          </span>

          <span className="text-[10px] text-zinc-600">total</span>
        </div>
      </div>

      {/* ================================================= */}
      {/* CONTENT                                           */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 items-center gap-6 px-5 py-6 sm:grid-cols-2">
        {/* ------------------------------------------------ */}
        {/* DONUT                                           */}
        {/* ------------------------------------------------ */}

        <div className="relative mx-auto h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={problemsData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={3}
                stroke="none"
                dataKey="value"
              >
                {problemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#181818",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
                formatter={(value, name) => [`${value} problems`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center */}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-3xl font-bold tracking-tight text-white">
                {totalSolved}
              </span>

              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                solved
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* BREAKDOWN                                        */}
        {/* ------------------------------------------------ */}

        <div className="space-y-2">
          {problemsData.map((item) => {
            const percentage = getPercentage(item.value);

            return (
              <div
                key={item.name}
                className="rounded-xl bg-zinc-900/60 px-3 py-3"
              >
                {/* Top */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span className="text-xs font-medium text-zinc-300">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {item.value}
                    </span>

                    <span className="text-[10px] text-zinc-600">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress */}

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================= */}
      {/* FOOTER                                            */}
      {/* ================================================= */}

      <div className="border-t border-zinc-800 bg-[#0d0d0d] px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-600">
            Difficulty distribution
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <span className="text-[10px] text-zinc-600">Easy</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />

              <span className="text-[10px] text-zinc-600">Medium</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

              <span className="text-[10px] text-zinc-600">Hard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeFolioProblems;
