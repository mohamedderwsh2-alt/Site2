import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "outline";
  className?: string;
}) {
  const variants = {
    default:
      "bg-white/10 text-white border border-white/20",
    success:
      "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
    warning:
      "bg-amber-500/20 text-amber-200 border border-amber-400/40",
    outline: "bg-transparent text-white border border-white/25",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
