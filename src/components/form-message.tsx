import { cn } from "@/lib/utils";

type Props = {
  message?: string;
  tone?: "error" | "success";
};

export function FormMessage({ message, tone = "error" }: Props) {
  if (!message) return null;

  return (
    <p className={cn("rounded-2xl px-4 py-3 text-sm", tone === "error" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200")}>
      {message}
    </p>
  );
}
