import { cn } from "@/lib/utils";

export default function MiniSelector({ options, value, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-muted p-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
            value === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}