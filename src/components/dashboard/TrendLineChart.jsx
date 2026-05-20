import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatCurrency(num) {
  return '$' + formatNumber(num);
}

const CustomTooltip = ({ active, payload, label, metrics }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg min-w-[140px]">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p, i) => {
        const m = metrics?.find(m => m.key === p.dataKey);
        const formatted = m?.format === 'currency' ? formatCurrency(p.value)
          : m?.format === 'percent' ? p.value + '%'
          : formatNumber(p.value);
        return (
          <p key={i} className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span>{p.name}:</span>
            <span className="font-medium text-foreground">{formatted}</span>
          </p>
        );
      })}
    </div>
  );
};

const COLORS = [
  'hsl(234, 89%, 64%)',
  'hsl(160, 84%, 39%)',
  'hsl(38, 92%, 50%)',
  'hsl(291, 64%, 42%)',
];

/**
 * metrics: [{ key, label, format: 'number'|'currency'|'percent', color? }]
 */
export default function TrendLineChart({ data, metrics, height = 240 }) {
  const avg = metrics[0]
    ? data.reduce((s, d) => s + (d[metrics[0].key] || 0), 0) / data.length
    : null;

  // Show every 5th label to avoid crowding
  const tickFormatter = (val, index) => index % 5 === 0 ? val : '';

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11 }}
            stroke="hsl(220, 9%, 46%)"
            tickFormatter={tickFormatter}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="hsl(220, 9%, 46%)"
            tickFormatter={metrics[0]?.format === 'currency' ? formatCurrency : formatNumber}
            width={60}
          />
          <Tooltip content={<CustomTooltip metrics={metrics} />} />
          {avg !== null && (
            <ReferenceLine
              y={avg}
              stroke="hsl(220, 9%, 70%)"
              strokeDasharray="4 4"
              label={{ value: 'avg', position: 'insideTopRight', fontSize: 10, fill: 'hsl(220, 9%, 60%)' }}
            />
          )}
          {metrics.map((m, i) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color || COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}