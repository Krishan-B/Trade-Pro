import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Settings } from 'lucide-react';
import TradingViewChart from '@/components/TradingViewChart';

interface TimeframeOption {
  label: string;
  value: string;
  active?: boolean;
}

interface EnhancedTradingChartProps {
  selectedAsset?: {
    name: string;
    symbol: string;
    price: number;
    change_percentage: number;
    change: number;
    market_type: string;
  };
}

const EnhancedTradingChart: React.FC<EnhancedTradingChartProps> = ({ selectedAsset }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [showIndicators, setShowIndicators] = useState(false);

  const timeframes: TimeframeOption[] = [
    { label: '1M', value: '1M' },
    { label: '5M', value: '5M' },
    { label: '15M', value: '15M' },
    { label: '1H', value: '1H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1Mo' },
  ];

  const asset = selectedAsset || {
    name: 'Bitcoin',
    symbol: 'BTCUSD',
    price: 67543.21,
    change_percentage: 2.4,
    change: 2.4,
    market_type: 'Crypto',
  };

  const isPositive = asset.change_percentage >= 0;

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <span>{asset.name}</span>
              <Badge variant="secondary" className="text-xs">
                {asset.market_type}
              </Badge>
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-2xl font-bold text-foreground">
                ${asset.price.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
              <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{asset.change_percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIndicators(!showIndicators)}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Indicators
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Timeframe Controls */}
      <div className="flex flex-wrap gap-1 mb-6 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe.value}
            variant={activeTimeframe === timeframe.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTimeframe(timeframe.value)}
            className={`text-xs px-3 py-1 h-8 ${
              activeTimeframe === timeframe.value 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="relative bg-slate-800/30 rounded-lg border border-slate-700 overflow-hidden" style={{ height: '400px' }}>
        <TradingViewChart symbol={asset.symbol} />
        
        {/* Chart Overlay Info */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="text-xs text-muted-foreground mb-1">Live Price</div>
          <div className="font-semibold text-foreground">
            ${asset.price.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
        </div>

        {/* Volume Info */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
          <div className="font-semibold text-foreground">$1.2B</div>
        </div>
      </div>

      {/* Chart Controls Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            Fullscreen
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTradingChart;