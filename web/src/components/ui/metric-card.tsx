import { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "accent" | "success" | "warning" | "danger";
  footer?: ReactNode;
};

const accentMap = {
  accent: "from-[rgba(120,82,255,0.3)] to-[rgba(146,102,255,0.1)]",
  success: "from-[rgba(67,201,132,0.24)] to-[rgba(67,201,132,0.05)]",
  warning: "from-[rgba(255,190,92,0.26)] to-[rgba(255,190,92,0.06)]",
  danger: "from-[rgba(255,102,128,0.24)] to-[rgba(255,102,128,0.06)]",
};

export function MetricCard({
  label,
  value,
  hint,
  accent = "accent",
  footer,
}: MetricCardProps) {
  return (
    <article className="glass-panel relative overflow-hidden rounded-[24px] p-6">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentMap[accent]} opacity-90`}
      />
      <div className="relative z-10 flex flex-col gap-4 text-white">
        <span className="text-xs uppercase tracking-[0.22em] text-white/60">
          {label}
        </span>
        <div className="text-2xl font-semibold">{value}</div>
        {hint ? <p className="text-sm text-white/60">{hint}</p> : null}
        {footer ? <div className="pt-2 text-xs text-white/65">{footer}</div> : null}
      </div>
    </article>
  );
}
