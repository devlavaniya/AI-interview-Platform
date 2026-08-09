import { Activity, Code2, TrendingUp } from "lucide-react";

function CodeFolioStats({ stats }) {
  const statCards = [
    {
      label: "Total Questions",
      value: stats?.totalQuestions || 0,
      icon: Code2,
      description: "Problems solved",
    },
    {
      label: "Active Days",
      value: stats?.totalActivedays || 0,
      icon: Activity,
      description: "Days of practice",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-zinc-800
              bg-[#111111]
              p-5
              transition-all
              duration-200
              hover:border-zinc-700
            "
          >
            {/* Subtle background glow */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-400/5 blur-2xl transition-all group-hover:bg-yellow-400/10" />

            <div className="relative">
              {/* Top */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  {card.label}
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                  <Icon size={15} className="text-yellow-400" />
                </div>
              </div>

              {/* Value */}
              <div className="mt-4 flex items-end gap-2">
                <span className="text-3xl font-bold tracking-tight text-white">
                  {card.value.toLocaleString()}
                </span>

                <TrendingUp size={14} className="mb-1 text-green-400" />
              </div>

              {/* Description */}
              <span className="mt-1 block text-[11px] text-zinc-600">
                {card.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CodeFolioStats;
