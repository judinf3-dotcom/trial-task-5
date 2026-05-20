import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, change, icon: Icon, className }) {
  const isPositive = change >= 0;

  return (
    <div className={cn(
      "bg-card rounded-2xl p-5 border border-border/60 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground tracking-wide">{label}</span>
        {Icon && (
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={cn(
            "text-xs font-semibold",
            isPositive ? "text-emerald-500" : "text-red-500"
          )}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-muted-foreground">vs last year</span>
        </div>
      )}
    </div>
  );
}