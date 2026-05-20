// YouTube Channels
const channels = [
  { id: 'ch1', name: 'TechVault', avatar: '🔧' },
  { id: 'ch2', name: 'PixelDrift', avatar: '🎮' },
  { id: 'ch3', name: 'NovaCook', avatar: '🍳' },
];

// Web Stores
const stores = [
  { id: 'st1', name: 'TechVault Merch', icon: '🛍️' },
  { id: 'st2', name: 'PixelDrift Gear', icon: '👕' },
  { id: 'st3', name: 'NovaCook Supplies', icon: '🥄' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateMonthlyData(baseViews, baseRevenue, volatility = 0.2) {
  return months.map((month, i) => {
    const trend = 1 + (i * 0.04);
    const noise = 1 + (Math.sin(i * 1.7) * volatility);
    return {
      month,
      views: Math.round(baseViews * trend * noise),
      revenue: Math.round(baseRevenue * trend * noise),
    };
  });
}

function generateStoreMonthlyData(baseUnits, baseRevenue, baseConversion) {
  return months.map((month, i) => {
    const trend = 1 + (i * 0.03);
    const noise = 1 + (Math.sin(i * 2.1) * 0.15);
    const seasonal = 1 + (i >= 9 ? 0.3 : 0); // Q4 bump
    return {
      month,
      unitsSold: Math.round(baseUnits * trend * noise * seasonal),
      revenue: Math.round(baseRevenue * trend * noise * seasonal),
      conversionRate: +(baseConversion * (1 + Math.sin(i * 0.8) * 0.1)).toFixed(2),
    };
  });
}

export const channelData = {
  ch1: {
    ...channels[0],
    monthly: generateMonthlyData(520000, 18400),
    totalViews: 7_840_000,
    totalRevenue: 264_300,
    avgViewsPerMonth: 653_000,
    growthRate: 12.4,
  },
  ch2: {
    ...channels[1],
    monthly: generateMonthlyData(310000, 9200),
    totalViews: 4_200_000,
    totalRevenue: 128_500,
    avgViewsPerMonth: 350_000,
    growthRate: 8.7,
  },
  ch3: {
    ...channels[2],
    monthly: generateMonthlyData(180000, 5600),
    totalViews: 2_400_000,
    totalRevenue: 76_800,
    avgViewsPerMonth: 200_000,
    growthRate: 15.2,
  },
};

export const storeData = {
  st1: {
    ...stores[0],
    monthly: generateStoreMonthlyData(1200, 42000, 3.2),
    totalUnits: 17_400,
    totalRevenue: 608_000,
    avgConversion: 3.2,
    growthRate: 9.8,
  },
  st2: {
    ...stores[1],
    monthly: generateStoreMonthlyData(800, 28000, 2.8),
    totalUnits: 11_200,
    totalRevenue: 392_000,
    avgConversion: 2.8,
    growthRate: 6.3,
  },
  st3: {
    ...stores[2],
    monthly: generateStoreMonthlyData(450, 15000, 4.1),
    totalUnits: 6_300,
    totalRevenue: 210_000,
    avgConversion: 4.1,
    growthRate: 18.5,
  },
};

export const channelList = channels;
export const storeList = stores;

// 30-day daily data
function generateDailyChannelData(baseViews, baseRevenue) {
  const days = [];
  const now = new Date(2026, 4, 20); // May 20, 2026
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const noise = 1 + (Math.sin(i * 1.3) * 0.25 + Math.cos(i * 0.7) * 0.15);
    const weekendBoost = [0, 6].includes(d.getDay()) ? 1.2 : 1;
    days.push({
      day: label,
      views: Math.round((baseViews / 30) * noise * weekendBoost),
      revenue: Math.round((baseRevenue / 30) * noise * weekendBoost),
    });
  }
  return days;
}

function generateDailyStoreData(baseUnits, baseRevenue, baseConversion) {
  const days = [];
  const now = new Date(2026, 4, 20);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const noise = 1 + (Math.sin(i * 2.1) * 0.2 + Math.cos(i * 0.9) * 0.1);
    const weekendBoost = [0, 6].includes(d.getDay()) ? 1.3 : 1;
    days.push({
      day: label,
      unitsSold: Math.round((baseUnits / 30) * noise * weekendBoost),
      revenue: Math.round((baseRevenue / 30) * noise * weekendBoost),
      conversionRate: +(baseConversion * (1 + Math.sin(i * 0.5) * 0.12)).toFixed(2),
    });
  }
  return days;
}

export const channelDaily = {
  ch1: generateDailyChannelData(653000, 22000),
  ch2: generateDailyChannelData(350000, 10700),
  ch3: generateDailyChannelData(200000, 6400),
};

export const storeDaily = {
  st1: generateDailyStoreData(1450, 50000, 3.2),
  st2: generateDailyStoreData(930, 32000, 2.8),
  st3: generateDailyStoreData(525, 18000, 4.1),
};

export function getCombinedDaily() {
  return channelDaily.ch1.map((_, i) => {
    let totalViews = 0, channelRevenue = 0, storeRevenue = 0, unitsSold = 0;
    Object.values(channelDaily).forEach(ch => {
      totalViews += ch[i].views;
      channelRevenue += ch[i].revenue;
    });
    Object.values(storeDaily).forEach(st => {
      storeRevenue += st[i].revenue;
      unitsSold += st[i].unitsSold;
    });
    return { day: channelDaily.ch1[i].day, totalViews, channelRevenue, storeRevenue, unitsSold };
  });
}

// Combined monthly for overview
export function getCombinedMonthly() {
  return months.map((month, i) => {
    let totalViews = 0, channelRevenue = 0, storeRevenue = 0, unitsSold = 0;
    Object.values(channelData).forEach(ch => {
      totalViews += ch.monthly[i].views;
      channelRevenue += ch.monthly[i].revenue;
    });
    Object.values(storeData).forEach(st => {
      storeRevenue += st.monthly[i].revenue;
      unitsSold += st.monthly[i].unitsSold;
    });
    return {
      month,
      totalViews,
      channelRevenue,
      storeRevenue,
      totalRevenue: channelRevenue + storeRevenue,
      unitsSold,
    };
  });
}

export function getTotals() {
  const channelViews = Object.values(channelData).reduce((s, c) => s + c.totalViews, 0);
  const channelRev = Object.values(channelData).reduce((s, c) => s + c.totalRevenue, 0);
  const storeUnits = Object.values(storeData).reduce((s, c) => s + c.totalUnits, 0);
  const storeRev = Object.values(storeData).reduce((s, c) => s + c.totalRevenue, 0);
  return {
    channelViews,
    channelRevenue: channelRev,
    storeUnits,
    storeRevenue: storeRev,
    totalRevenue: channelRev + storeRev,
  };
}