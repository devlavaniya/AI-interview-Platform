import { Button } from "@/components/ui/button";

export default function DashboardHeader({
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-2 text-zinc-400">
          {description}
        </p>

      </div>

      {buttonText && (
        <Button
          onClick={onClick}
          className="bg-yellow-400 text-black hover:bg-yellow-300"
        >
          {buttonText}
        </Button>
      )}

    </div>
  );
}