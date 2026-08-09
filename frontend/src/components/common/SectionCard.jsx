import { Card } from "@/components/ui/card";

export default function SectionCard({
  title,
  children,
  action,
}) {
  return (
    <Card className="border-zinc-800 bg-[#181818]">

      {(title || action) && (
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          {action}

        </div>
      )}

      {children}

    </Card>
  );
}