import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  // if it's today, return current time
  // if it's yesterday, return yesterday
  // if it's this year, return day + month

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }

  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
  } else {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}
