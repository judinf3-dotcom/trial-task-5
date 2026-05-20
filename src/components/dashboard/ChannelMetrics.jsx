import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Eye, DollarSign, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import MiniSelector from "./MiniSelector";
import { channelData, channelList, channelDaily } from "@/lib/mockData";
import TrendLineChart from "./TrendLineChart";

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatCurrency(num) {
  return '$' + formatNumber(num);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: {p.name.toLowerCase().includes('revenue') ? formatCurrency(p.value) : formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function ChannelMetrics() {
  const [selectedChannel, setSelectedChannel] = useState('all');

  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    ...channelList.map(c => ({ value: c.id, label: c.name })),
  ];

  const dailyData = selectedChannel === 'all'
    ? channelDaily.ch1.map((_, i) => {
        let views = 0, revenue = 0;
        Object.values(channelDaily).forEach(ch => {
          views += ch[i].views;
          revenue += ch[i].revenue;
        });
        return { day: channelDaily.ch1[i].day, views, revenue };
      })
    : channelDaily[selectedChannel] || [];

  const data = selectedChannel === 'all'
    ? channelList[0] && channelData[channelList[0].id].monthly.map((_, i) => {
        let views = 0, revenue = 0;
        Object.values(channelData).forEach(ch => {
          views += ch.monthly[i].views;
          revenue += ch.monthly[i].revenue;
        });
        return { month: channelData[channelList[0].id].monthly[i].month, views, revenue };
      })
    : channelData[selectedChannel]?.monthly || [];

  const totals = selectedChannel === 'all'
    ? {
        views: Object.values(channelData).reduce((s, c) => s + c.totalViews, 0),
        revenue: Object.values(channelData).reduce((s, c) => s + c.totalRevenue, 0),
        growth: +(Object.values(channelData).reduce((s, c) => s + c.growthRate, 0) / Object.keys(channelData).length).toFixed(1),
      }
    : {
        views: channelData[selectedChannel]?.totalViews || 0,
        revenue: channelData[selectedChannel]?.totalRevenue || 0,
        growth: channelData[selectedChannel]?.growthRate || 0,
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">YouTube Channels</h2>
          <p className="text-sm text-muted-foreground">Views & revenue performance</p>
        </div>
        <MiniSelector options={channelOptions} value={selectedChannel} onChange={setSelectedChannel} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Views" value={formatNumber(totals.views)} change={totals.growth} icon={Eye} />
        <StatCard label="Total Revenue" value={formatCurrency(totals.revenue)} change={totals.growth + 1.2} icon={DollarSign} />
        <StatCard label="Avg Growth" value={`${totals.growth}%`} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Views Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke="hsl(234, 89%, 64%)" fill="url(#viewsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(234, 89%, 64%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Last 30 Days Trend</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">Daily</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Views</p>
            <TrendLineChart
              data={dailyData}
              metrics={[{ key: 'views', label: 'Views', format: 'number' }]}
              height={200}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Revenue</p>
            <TrendLineChart
              data={dailyData}
              metrics={[{ key: 'revenue', label: 'Revenue', format: 'currency', color: 'hsl(160, 84%, 39%)' }]}
              height={200}
            />
          </div>
        </div>
      </div>

      {selectedChannel === 'all' && (
        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Channel Breakdown</h3>
          <div className="space-y-3">
            {channelList.map(ch => {
              const d = channelData[ch.id];
              const revShare = ((d.totalRevenue / totals.revenue) * 100).toFixed(0);
              return (
                <div key={ch.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <span className="text-2xl">{ch.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{ch.name}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(d.totalViews)} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(d.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">{revShare}% of total</p>
                  </div>
                  <div className="hidden sm:block w-24">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${revShare}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}