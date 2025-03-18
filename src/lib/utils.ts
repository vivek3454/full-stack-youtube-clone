import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(duration / 60000);
  
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// export function snakeCaseToTitle(str:string) {
//   return str.replace(/_/g, "").replace(/\b\w/g, (char) => char.toUpperCase());
// }

export function snakeCaseToTitle(str: string): string {
  return str
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

