import type { ReactNode } from "react";

type BadgeColor = "zinc" | "emerald" | "amber" | "sky" | "violet" | "red";

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  dot?: boolean;
}

const COLOR_STYLES: Record<
  BadgeColor,
  { bg: string; text: string; dot: string }
> = {
  zinc: { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-500" },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  amber: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  sky: { bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500" },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  red: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

export default function Badge({
  children,
  color = "zinc",
  dot = false,
}: BadgeProps) {
  const styles = COLOR_STYLES[color];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
}
