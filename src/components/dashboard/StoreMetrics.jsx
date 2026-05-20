import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { ShoppingCart, DollarSign, Percent } from "lucide-react";
import StatCard from "./StatCard";
import MiniSelector from "./MiniSelector";
import { storeData, storeList, storeDaily } from "@/lib/mockData";
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
          {p.name}: {p.name.toLowerCase().includes('revenue') ? formatCurrency(p.value) : p.name.toLowerCase().includes('conversion') ? p.value + '%' : formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function StoreMetrics() {
  const [selectedStore, setSelectedStore] = useState('all');

  const storeOptions = [
    { value: 'all', label: 'All Stores' },
    ...storeList.map(s => ({ value: s.id, label: s.name })),
  ];

  const dailyData = selectedStore === 'all'
    ? storeDaily.st1.map((_, i) => {
        let unitsSold = 0, revenue = 0, convSum = 0;
        Object.values(storeDaily).forEach(st => {
          unitsSold += st[i].unitsSold;
          revenue += st[i].revenue;
          convSum += st[i].conversionRate;
        });
        return {
          day: storeDaily.st1[i].day,
          unitsSold,
          revenue,
          conversionRate: +(convSum / Object.keys(storeDaily).length).toFixed(2),
        };
      })
    : storeDaily[selectedStore] || [];

  const data = selectedStore === 'all'
    ? storeData[storeList[0].id].monthly.map((_, i) => {
        let unitsSold = 0, revenue = 0, convSum = 0;
        Object.values(storeData).forEach(st => {
          unitsSold += st.monthly[i].unitsSold;
          revenue += st.monthly[i].revenue;
          convSum += st.monthly[i].conversionRate;
        });
        return {
          month: storeData[storeList[0].id].monthly[i].month,
          unitsSold,
          revenue,
          conversionRate: +(convSum / Object.keys(storeData).length).toFixed(2),
        };
      })
    : storeData[selectedStore]?.monthly || [];

  const totals = selectedStore === 'all'
    ? {
        units: Object.values(storeData).reduce((s, st) => s + st.totalUnits, 0),
        revenue: Object.values(storeData).reduce((s, st) => s + st.totalRevenue, 0),
        avgConversion: +(Object.values(storeData).reduce((s, st) => s + st.avgConversion, 0) / Object.keys(storeData).length).toFixed(1),
        growth: +(Object.values(storeData).reduce((s, st) => s + st.growthRate, 0) / Object.keys(storeData).length).toFixed(1),
      }
    : {
        units: storeData[selectedStore]?.totalUnits || 0,
        revenue: storeData[selectedStore]?.totalRevenue || 0,
        avgConversion: storeData[selectedStore]?.avgConversion || 0,
        growth: storeData[selectedStore]?.growthRate || 0,
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Web Stores</h2>
          <p className="text-sm text-muted-foreground">Units sold, revenue & conversion rates</p>
        </div>
        <MiniSelector options={storeOptions} value={selectedStore} onChange={setSelectedStore} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Units Sold" value={formatNumber(totals.units)} change={totals.growth} icon={ShoppingCart} />
        <StatCard label="Store Revenue" value={formatCurrency(totals.revenue)} change={totals.growth + 2.1} icon={DollarSign} />
        <StatCard label="Avg Conversion" value={`${totals.avgConversion}%`} change={1.3} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Units Sold & Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis yAxisId="left" tickFormatter={formatNumber} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="unitsSold" name="Units Sold" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="hsl(234, 89%, 64%)" radius={[6, 6, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Conversion Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="conversionRate" name="Conversion Rate" stroke="hsl(38, 92%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(38, 92%, 50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Last 30 Days Trend</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">Daily</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Units Sold</p>
            <TrendLineChart
              data={dailyData}
              metrics={[{ key: 'unitsSold', label: 'Units Sold', format: 'number', color: 'hsl(160, 84%, 39%)' }]}
              height={200}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Revenue</p>
            <TrendLineChart
              data={dailyData}
              metrics={[{ key: 'revenue', label: 'Revenue', format: 'currency' }]}
              height={200}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Conversion Rate</p>
            <TrendLineChart
              data={dailyData}
              metrics={[{ key: 'conversionRate', label: 'Conv. Rate', format: 'percent', color: 'hsl(38, 92%, 50%)' }]}
              height={200}
            />
          </div>
        </div>
      </div>

      {selectedStore === 'all' && (
        <div className="bg-card rounded-2xl border border-border/60 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Store Breakdown</h3>
          <div className="space-y-3">
            {storeList.map(st => {
              const d = storeData[st.id];
              const revShare = ((d.totalRevenue / totals.revenue) * 100).toFixed(0);
              return (
                <div key={st.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <span className="text-2xl">{st.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{st.name}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(d.totalUnits)} units · {d.avgConversion}% conv.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(d.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">{revShare}% of total</p>
                  </div>
                  <div className="hidden sm:block w-24">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${revShare}%` }} />
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