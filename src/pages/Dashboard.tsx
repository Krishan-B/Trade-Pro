import { useEffect, useState, useRef, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/contexts/AppContext';
import { useRealtimeMarketData } from '@/hooks/useRealtimeMarketData';
import type { Asset } from '@/hooks/useMarketData';
import { MainLayout } from '@/components/MainLayout';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Enhanced Dashboard Components
import HeaderAccountSummary from '@/components/dashboard/HeaderAccountSummary';
import EnhancedAlertBanner from '@/components/dashboard/EnhancedAlertBanner';
import EnhancedPortfolioSummary from '@/components/dashboard/EnhancedPortfolioSummary';
import EnhancedMarketOverview from '@/components/dashboard/EnhancedMarketOverview';
import EnhancedWatchlist from '@/components/dashboard/EnhancedWatchlist';
import EnhancedTradingChart from '@/components/dashboard/EnhancedTradingChart';
import EnhancedQuickTradePanel from '@/components/dashboard/EnhancedQuickTradePanel';
import EnhancedNewsAnalysis from '@/components/dashboard/EnhancedNewsAnalysis';

const Dashboard = () => {
  const { state } = useContext(AppContext);
  const { user } = state.auth;
  const { marketData, loading, error } = useRealtimeMarketData();

  const [selectedAsset, setSelectedAsset] = useState({
    name: 'Bitcoin',
    symbol: 'BTCUSD',
    price: 67543.21,
    change_percentage: 2.4,
    change: 2.4,
    market_type: 'Crypto',
    live_price: 67543.21,
    buy_price: 67543.21,
    sell_price: 67543.21,
    change_percent_24h: 2.4,
    volume: 1000000,
  });
  const { toast } = useToast();
  const chartSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show welcome toast when dashboard loads
    toast({
      title: `Welcome, ${user?.username || 'Trader'}!`,
      description: 'Your enhanced dashboard is ready with real-time market data',
      duration: 5000,
    });
  }, [toast, user]);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset({
      ...asset,
      change:
        typeof asset.change === 'number'
          ? asset.change
          : asset.change_percentage,
    });

    // Scroll to chart section
    if (chartSectionRef.current) {
      chartSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    toast({
      title: `${asset.name} selected`,
      description: 'Chart and trade panel updated',
      duration: 2000,
    });
  };

  return (
    <MainLayout>
      {/* Header Account Summary */}
      <HeaderAccountSummary />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Alert Banner */}
          <EnhancedAlertBanner />

          {/* Mobile Layout */}
          <div className="lg:hidden">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="trade">Trade</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <EnhancedMarketOverview onAssetSelect={handleAssetSelect} />
                <EnhancedNewsAnalysis />
              </TabsContent>
              
              <TabsContent value="portfolio">
                <EnhancedPortfolioSummary />
              </TabsContent>
              
              <TabsContent value="watchlist">
                <EnhancedWatchlist onAssetSelect={handleAssetSelect} />
              </TabsContent>
              
              <TabsContent value="trade" className="space-y-6">
                <div ref={chartSectionRef}>
                  <EnhancedTradingChart selectedAsset={selectedAsset} />
                </div>
                <EnhancedQuickTradePanel asset={selectedAsset} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            {/* Top Row - Portfolio and Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <EnhancedPortfolioSummary />
              <EnhancedMarketOverview onAssetSelect={handleAssetSelect} />
            </div>

            {/* Middle Row - Watchlist */}
            <div className="mb-6">
              <EnhancedWatchlist onAssetSelect={handleAssetSelect} />
            </div>

            {/* Chart and Trading Section */}
            <div ref={chartSectionRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <EnhancedTradingChart selectedAsset={selectedAsset} />
              </div>
              <div className="lg:col-span-1">
                <EnhancedQuickTradePanel asset={selectedAsset} />
              </div>
            </div>

            {/* News and Analysis Section */}
            <EnhancedNewsAnalysis />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
