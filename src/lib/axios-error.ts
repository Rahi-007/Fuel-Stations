import axios from "axios";

export function axiosMessage(e: unknown): string | null {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as
      | { message?: string | string[] }
      | undefined;
    if (data?.message != null) {
      return Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message;
    }
  }
  if (e instanceof Error) return e.message;
  return null;
}
