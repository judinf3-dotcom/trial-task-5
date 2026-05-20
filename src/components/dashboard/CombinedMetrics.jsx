import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Eye, DollarSign, ShoppingCart, Layers } from "lucide-react";
import StatCard from "./StatCard";
import { getCombinedMonthly, getTotals, channelData, storeData, channelList, storeList } from "@/lib/mockData";

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatCurrency(num) {
  return '$' + formatNumber(num);
}

const COLORS = ['hsl(234, 89%, 64%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(291, 64%, 42%)', 'hsl(0, 84%, 60%)'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function CombinedMetrics() {
  const combined = getCombinedMonthly();
  const totals = getTotals();

  const revenueBreakdown = [
    ...channelList.map(c => ({ name: c.name + ' (YT)', value: channelData[c.id].totalRevenue })),
    ...storeList.map(s => ({ name: s.name, value: storeData[s.id].totalRevenue })),
  ];

  const channelVsStore = [
    { name: 'YouTube Revenue', value: totals.channelRevenue },
    { name: 'Store Revenue', value: totals.storeRevenue },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Combined Overview</h2>
        <p className="text-sm text-muted-foreground">YouTube channels + web stores combined</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={formatNumber(totals.channelViews)} change={11.8} icon={Eye} />
        <StatCard label="Total Revenue" value={formatCurrency(totals.totalRevenue)} change={13.4} icon={DollarSign} />
        <StatCard label="Channel Revenue" value={formatCurrency(totals.channelRevenue)} change={10.2} icon={Layers} />
        <StatCard label="Store Revenue" value={formatCurrency(totals.storeRevenue)} change={14.6} icon={ShoppingCart} />
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Source Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combined}>
              <defs>
                <linearGradient id="channelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="storeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="channelRevenue" name="Channel Revenue" stackId="1" stroke="hsl(234, 89%, 64%)" fill="url(#channelGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="storeRevenue" name="Store Revenue" stackId="1" stroke="hsl(160, 84%, 39%)" fill="url(#storeGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue split pie */}
        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Split: Channels vs Stores</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelVsStore}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="hsl(234, 89%, 64%)" />
                  <Cell fill="hsl(160, 84%, 39%)" />
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Entity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" width={140} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="value" name="Revenue" radius={[0, 6, 6, 0]}>
                  {revenueBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Views vs Units Sold Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combined}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis yAxisId="views" tickFormatter={formatNumber} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis yAxisId="units" orientation="right" tickFormatter={formatNumber} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
                    <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
                    {payload.map((p, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
                        {p.name}: {formatNumber(p.value)}
                      </p>
                    ))}
                  </div>
                );
              }} />
              <Bar yAxisId="views" dataKey="totalViews" name="Total Views" fill="hsl(234, 89%, 64%)" radius={[6, 6, 0, 0]} opacity={0.7} />
              <Bar yAxisId="units" dataKey="unitsSold" name="Units Sold" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}