export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white ${className ?? ""}`}
      role="status"
    >
      <span className="sr-only">Loading</span>
    </span>
  );
}
