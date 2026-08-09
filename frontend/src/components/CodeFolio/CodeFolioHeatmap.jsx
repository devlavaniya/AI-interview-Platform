import { CalendarDays } from "lucide-react";

function CodeFolioHeatmap({ submissionCalendar }) {
  /* ================================================== */
  /* Parse submission data                              */
  /* ================================================== */

  const parseSubmissionCalendar = () => {
    if (!submissionCalendar) return {};

    try {
      return typeof submissionCalendar === "string"
        ? JSON.parse(submissionCalendar)
        : submissionCalendar;
    } catch (error) {
      console.error("Error parsing submission calendar:", error);

      return {};
    }
  };

  const calendarData = parseSubmissionCalendar();

  /* ================================================== */
  /* Activity level                                     */
  /* ================================================== */

  const getActivityLevel = (count) => {
    if (!count || count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;

    return 4;
  };

  /* ================================================== */
  /* Activity colors                                    */
  /* ================================================== */

  const getActivityColor = (level) => {
    const colors = [
      "bg-zinc-800",
      "bg-yellow-400/20",
      "bg-yellow-400/40",
      "bg-yellow-400/70",
      "bg-yellow-400",
    ];

    return colors[level] || colors[0];
  };

  /* ================================================== */
  /* Generate last year                                */
  /* ================================================== */

  const generateYearData = () => {
    const weeks = [];

    const today = new Date();

    const startDate = new Date(today);

    startDate.setFullYear(today.getFullYear() - 1);

    /*
      Move to Sunday so every column represents
      a complete week.
    */

    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(startDate);

    while (currentDate <= today) {
      const week = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate);

        const timestamp = Math.floor(date.getTime() / 1000).toString();

        const count = Number(calendarData[timestamp]) || 0;

        week.push({
          date,
          count,
          level: getActivityLevel(count),
          timestamp,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
    }

    return weeks;
  };

  const weekData = generateYearData();

  /* ================================================== */
  /* Month positions                                    */
  /* ================================================== */

  const getMonthLabels = () => {
    const labels = [];

    let lastMonth = -1;

    weekData.forEach((week, index) => {
      const firstDay = week[0]?.date;

      if (!firstDay) return;

      const month = firstDay.getMonth();

      if (month !== lastMonth) {
        labels.push({
          index,
          label: firstDay.toLocaleDateString("en-US", {
            month: "short",
          }),
        });

        lastMonth = month;
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  /* ================================================== */
  /* Total activity                                     */
  /* ================================================== */

  const totalSubmissions = Object.values(calendarData).reduce(
    (total, count) => total + (Number(count) || 0),
    0,
  );

  /* ================================================== */
  /* UI                                                 */
  /* ================================================== */

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10">
            <CalendarDays size={17} className="text-yellow-400" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Activity</span>

            <span className="text-xs text-zinc-500">
              Your coding activity over the last year
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="block text-lg font-bold text-white">
            {totalSubmissions.toLocaleString()}
          </span>

          <span className="text-[10px] text-zinc-600">submissions</span>
        </div>
      </div>

      {/* ================================================= */}
      {/* CALENDAR                                          */}
      {/* ================================================= */}

      <div className="px-5 py-5">
        <div className="overflow-x-auto pb-2">
          <div
            className="relative"
            style={{
              minWidth: `${weekData.length * 13}px`,
            }}
          >
            {/* ----------------------------------------- */}
            {/* Month labels                              */}
            {/* ----------------------------------------- */}

            <div className="relative mb-2 h-4">
              {monthLabels.map((month, index) => (
                <span
                  key={`${month.label}-${index}`}
                  className="absolute text-[10px] text-zinc-600"
                  style={{
                    left: `${month.index * 13}px`,
                  }}
                >
                  {month.label}
                </span>
              ))}
            </div>

            {/* ----------------------------------------- */}
            {/* Heatmap                                   */}
            {/* ----------------------------------------- */}

            <div className="flex gap-[3px]">
              {weekData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${day.timestamp}-${dayIndex}`}
                      className={`
                            h-[10px]
                            w-[10px]
                            rounded-[2px]
                            ${getActivityColor(day.level)}
                            cursor-pointer
                            transition-all
                            duration-150
                            hover:scale-125
                            hover:ring-1
                            hover:ring-yellow-400
                          `}
                      title={`${day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })} • ${day.count} submission${
                        day.count === 1 ? "" : "s"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* LEGEND                                           */}
      {/* ================================================= */}

      <div className="border-t border-zinc-800 bg-[#0d0d0d] px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-600">Less</span>

          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`
                    h-[10px]
                    w-[10px]
                    rounded-[2px]
                    ${getActivityColor(level)}
                  `}
              />
            ))}
          </div>

          <span className="text-[10px] text-zinc-600">More</span>
        </div>
      </div>
    </div>
  );
}

export default CodeFolioHeatmap;
