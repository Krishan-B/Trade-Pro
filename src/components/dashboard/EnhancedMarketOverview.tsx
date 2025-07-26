import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, Bitcoin, DollarSign } from 'lucide-react';
import { useRealtimeMarketData } from '@/hooks/useRealtimeMarketData';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketInstrument {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change_percentage: number;
  market_type: string;
  icon?: React.ReactNode;
  description?: string;
}

interface MarketCardProps {
  instrument: MarketInstrument;
  onTrade: (instrument: MarketInstrument) => void;
}

const getMarketIcon = (symbol: string, marketType: string) => {
  const iconClass = "w-6 h-6";
  
  switch (symbol) {
    case 'BTCUSD':
      return <div className="bg-orange-500 rounded-full p-1.5">
        <Bitcoin className={`${iconClass} text-white`} />
      </div>;
    case 'EURUSD':
      return <div className="bg-blue-500 rounded-full p-1.5">
        <DollarSign className={`${iconClass} text-white`} />
      </div>;
    case 'ETHUSD':
      return <div className="bg-purple-500 rounded-full p-1.5">
        <span className={`${iconClass} text-white font-bold flex items-center justify-center text-xs`}>Ξ</span>
      </div>;
    case 'SPX500':
      return <div className="bg-green-500 rounded-full p-1.5">
        <span className={`${iconClass} text-white font-bold flex items-center justify-center text-xs`}>S&P</span>
      </div>;
    case 'XAUUSD':
      return <div className="bg-yellow-500 rounded-full p-1.5">
        <span className={`${iconClass} text-white font-bold flex items-center justify-center text-xs`}>Au</span>
      </div>;
    default:
      return <div className="bg-slate-500 rounded-full p-1.5">
        <TrendingUpIcon className={`${iconClass} text-white`} />
      </div>;
  }
};

const MarketCard: React.FC<MarketCardProps> = ({ instrument, onTrade }) => {
  const isPositive = instrument.change_percentage >= 0;
  
  return (
    <div className="bg-slate-800/80 rounded-lg border border-slate-700 p-4 hover:bg-slate-800 transition-colors duration-200 cursor-pointer group"
         onClick={() => onTrade(instrument)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getMarketIcon(instrument.symbol, instrument.market_type)}
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {instrument.symbol}
            </h3>
            <p className="text-xs text-muted-foreground">{instrument.name}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{instrument.change_percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <span className="text-lg font-bold text-foreground">
            ${instrument.price.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </span>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onTrade(instrument);
          }}
        >
          Trade
        </Button>
      </div>
    </div>
  );
};

interface EnhancedMarketOverviewProps {
  onAssetSelect?: (asset: any) => void;
}

const EnhancedMarketOverview: React.FC<EnhancedMarketOverviewProps> = ({ onAssetSelect }) => {
  const { marketData, loading } = useRealtimeMarketData();

  // Mock data based on the design specifications
  const mockInstruments: MarketInstrument[] = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTCUSD',
      price: 67543,
      change_percentage: 2.4,
      market_type: 'Crypto'
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETHUSD',
      price: 3211,
      change_percentage: -1.2,
      market_type: 'Crypto'
    },
    {
      id: '3',
      name: 'S&P 500',
      symbol: 'SPX500',
      price: 5204,
      change_percentage: 0.4,
      market_type: 'Index'
    },
    {
      id: '4',
      name: 'Gold',
      symbol: 'XAUUSD',
      price: 2326,
      change_percentage: 1.3,
      market_type: 'Commodity'
    }
  ];

  const handleTrade = (instrument: MarketInstrument) => {
    if (onAssetSelect) {
      onAssetSelect({
        name: instrument.name,
        symbol: instrument.symbol,
        price: instrument.price,
        change_percentage: instrument.change_percentage,
        change: instrument.change_percentage,
        market_type: instrument.market_type,
        live_price: instrument.price,
        buy_price: instrument.price,
        sell_price: instrument.price,
        change_percent_24h: instrument.change_percentage,
        volume: 1000000,
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
              <Skeleton className="h-6 w-6 rounded-full mb-3" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Market Overview</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockInstruments.map((instrument) => (
          <MarketCard
            key={instrument.id}
            instrument={instrument}
            onTrade={handleTrade}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedMarketOverview;