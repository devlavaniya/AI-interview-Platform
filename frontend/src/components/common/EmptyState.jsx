import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <Inbox
        size={56}
        className="text-zinc-600"
      />

      <h3 className="mt-5 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-center text-zinc-500">
        {description}
      </p>

    </div>
  );
}