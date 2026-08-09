import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDifficultyBadgeClass(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-600 text-white";

    case "medium":
      return "bg-yellow-500 text-black";

    case "hard":
      return "bg-red-600 text-white";

    default:
      return "bg-zinc-700 text-white";
  }
}