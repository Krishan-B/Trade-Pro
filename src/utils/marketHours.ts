
// Market hours utility to determine if markets are open

interface MarketHoursConfig {
  openTime: number; // Hour in UTC (0-23)
  closeTime: number; // Hour in UTC (0-23)
  isOpen24Hours: boolean;
  openDays: number[]; // Days of week when market is open (0 = Sunday, 6 = Saturday)
}

export const marketConfig: Record<string, MarketHoursConfig> = {
  "Crypto": {
    openTime: 0,
    closeTime: 24,
    isOpen24Hours: true,
    openDays: [0, 1, 2, 3, 4, 5, 6] // Open every day
  },
  "Forex": {
    openTime: 22, // Sunday 10 PM UTC
    closeTime: 21, // Friday 9 PM UTC
    isOpen24Hours: false,
    openDays: [0, 1, 2, 3, 4, 5] // Sunday to Friday
  },
  "Stock": {
    openTime: 13, // 9 AM EST = 1 PM UTC
    closeTime: 20, // 4 PM EST = 8 PM UTC
    isOpen24Hours: false,
    openDays: [1, 2, 3, 4, 5] // Monday to Friday
  },
  "Index": {
    openTime: 13, // 9 AM EST = 1 PM UTC
    closeTime: 20, // 4 PM EST = 8 PM UTC
    isOpen24Hours: false,
    openDays: [1, 2, 3, 4, 5] // Monday to Friday
  },
  "Commodity": {
    openTime: 22, // Sunday 10 PM UTC (similar to Forex for overnight trading)
    closeTime: 21, // Friday 9 PM UTC
    isOpen24Hours: false,
    openDays: [0, 1, 2, 3, 4, 5] // Sunday to Friday
  }
};

export const isMarketOpen = (marketType: string): boolean => {
  if (!marketConfig[marketType]) {
    console.warn(`Unknown market type: ${marketType}`);
    return false;
  }

  const config = marketConfig[marketType];
  if (config.isOpen24Hours) {
    return true;
  }

  const now = new Date();
  const currentDay = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const currentHour = now.getUTCHours();

  // Special handling for markets that trade continuously across days (like Forex)
  if (marketType === "Forex" || marketType === "Commodity") {
    // Opens Sunday 22:00 UTC, closes Friday 21:00 UTC
    if (currentDay === 5 && currentHour >= 21) { // After Friday close
      return false;
    }
    if (currentDay === 6) { // Saturday
      return false;
    }
    if (currentDay === 0 && currentHour < 22) { // Before Sunday open
      return false;
    }
    return true;
  }

  // Standard daily check for other markets
  if (!config.openDays.includes(currentDay)) {
    return false;
  }

  return currentHour >= config.openTime && currentHour < config.closeTime;
};

export const getMarketHoursMessage = (marketType: string): string => {
  if (!marketConfig[marketType]) {
    return "Trading hours information unavailable";
  }
  
  const config = marketConfig[marketType];
  
  if (config.isOpen24Hours) {
    return "This market trades 24/7, every day of the week.";
  }
  
  const days = config.openDays.map(day => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[day];
  }).join(", ");
  
  return `${marketType} markets trade from ${config.openTime}:00 to ${config.closeTime}:00 UTC on ${days}.`;
};
