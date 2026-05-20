import { useState } from "react";
import { cn } from "@/lib/utils";
import { Youtube, Store, Layers3 } from "lucide-react";
import ChannelMetrics from "@/components/dashboard/ChannelMetrics";
import StoreMetrics from "@/components/dashboard/StoreMetrics";
import CombinedMetrics from "@/components/dashboard/CombinedMetrics";

const tabs = [
  { id: 'combined', label: 'Combined', icon: Layers3 },
  { id: 'channel', label: 'YouTube', icon: Youtube },
  { id: 'store', label: 'Web Store', icon: Store },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('combined');

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Performance across all channels and stores</p>
            </div>
            <nav className="flex items-center gap-1 rounded-xl bg-muted p-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      activeTab === tab.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'combined' && <CombinedMetrics />}
        {activeTab === 'channel' && <ChannelMetrics />}
        {activeTab === 'store' && <StoreMetrics />}
      </main>
    </div>
  );
}