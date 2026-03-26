import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//W---------={ Join className For Tailwind }=----------</br>
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
