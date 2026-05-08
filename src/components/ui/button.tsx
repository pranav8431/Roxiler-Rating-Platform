import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

const variants = {
  primary: "bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800",
  secondary: "bg-white/10 text-slate-100 ring-1 ring-white/10 hover:bg-white/15",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({ className, variant = "primary", size = "md", asChild = false, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn("inline-flex items-center justify-center rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-60", variants[variant], sizes[size], className)} {...props} />;
}
