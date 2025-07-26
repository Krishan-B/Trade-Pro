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
      <div className="p-4 md:p-6">
        {/* KYC Banner Notification */}
        <KycBanner />
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Market Overview</h1>
            <p className="text-muted-foreground">Track, analyze and trade global markets</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <TradeButton size="sm" />
              </DialogTrigger>
              <DialogContent>
                <QuickTradePanel asset={selectedAsset} />
              </DialogContent>
            </Dialog>
            <ConnectionStatus />
          </div>
        </div>

        {/* Market Stats */}
        <MarketStats />
  
        <div className="lg:hidden">
          <Tabs defaultValue="portfolio">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio">
              <PortfolioCard />
            </TabsContent>
            <TabsContent value="watchlist">
              <div className="glass-card rounded-lg p-4">
                <WatchlistTable onAssetSelect={handleAssetSelect} />
              </div>
            </TabsContent>
            <TabsContent value="news">
              <div className="glass-card rounded-lg p-4">
                <EnhancedNewsWidget />
              </div>
            </TabsContent>
          </Tabs>
        </div>
  
        <div className="hidden lg:block">
          {/* Portfolio Overview */}
          <div className="mb-6">
            <PortfolioCard />
          </div>
  
          {/* Watchlist */}
          <div className="glass-card rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Watchlist</h2>
              <Button variant="ghost" size="sm">
                Add Asset
              </Button>
            </div>
            <WatchlistTable onAssetSelect={handleAssetSelect} />
          </div>
        </div>
  
  
        {/* Chart and Trading Panel */}
        <div ref={chartSectionRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 glass-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">{selectedAsset.name} Chart</h2>
                <div className="ml-4 text-sm">
                  <span
                    className={`${selectedAsset.change >= 0 ? 'text-success' : 'text-warning'} font-medium`}
                  >
                    {selectedAsset.change >= 0 ? '+' : ''}
                    {selectedAsset.change}%
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button variant="ghost" size="sm">
                  1D
                </Button>
                <Button variant="ghost" size="sm">
                  1W
                </Button>
                <Button variant="ghost" size="sm" className="bg-secondary text-foreground">
                  1M
                </Button>
                <Button variant="ghost" size="sm">
                  1Y
                </Button>
                <Button variant="ghost" size="sm">
                  ALL
                </Button>
              </div>
            </div>
            <TradingViewChart symbol={selectedAsset.symbol} />
          </div>
  
          <div className="hidden lg:block lg:col-span-1">
            <QuickTradePanel asset={selectedAsset} />
          </div>
        </div>
  
        {/* News and Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Market News</h2>
            <EnhancedNewsWidget />
          </div>
          <div className="glass-card rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Market Alerts</h2>
            <AlertsWidget />
          </div>
        </div>
        <div className="mt-6">
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
