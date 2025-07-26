import React from 'react';
import { useAccountMetrics } from '@/hooks/useAccountMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface PortfolioMetricProps {
  icon?: React.ReactNode;
  label: string;
  value: number | undefined;
  isCurrency?: boolean;
  isPercentage?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const PortfolioMetric: React.FC<PortfolioMetricProps> = ({
  icon,
  label,
  value,
  isCurrency = true,
  isPercentage = false,
  trend = 'neutral',
  className = ''
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <span className="text-sm text-muted-foreground font-medium">{label}</span>
        </div>
        {getTrendIcon()}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-2xl font-bold ${getTrendColor()}`}>
          {isCurrency && '$'}
          {typeof value === 'number' ? value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) : '0.00'}
          {isPercentage && '%'}
        </span>
      </div>
    </div>
  );
};

const EnhancedPortfolioSummary: React.FC = () => {
  const { data: metrics, isLoading, refetch } = useAccountMetrics();

  if (isLoading) {
    return (
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const availableFunds = (metrics?.balance || 0) - (metrics?.used_margin || 0);
  const totalPL = (metrics?.unrealized_pl || 0) + (metrics?.realized_pl || 0);
  const marginLevel = metrics?.margin_level || 0;

  // Determine trends
  const getMarginTrend = (level: number): 'up' | 'down' | 'neutral' => {
    if (level > 200) return 'up';
    if (level < 100) return 'down';
    return 'neutral';
  };

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Portfolio Summary</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PortfolioMetric
          icon={<Wallet className="w-4 h-4" />}
          label="Available"
          value={availableFunds}
          isCurrency={true}
          trend={availableFunds > 1000 ? 'up' : 'neutral'}
        />
        
        <PortfolioMetric
          label="Used Margin"
          value={metrics?.used_margin}
          isCurrency={true}
          trend={metrics?.used_margin && metrics.used_margin > 0 ? 'down' : 'neutral'}
        />
        
        <PortfolioMetric
          label="Free Margin"
          value={metrics?.available_margin}
          isCurrency={true}
          trend='up'
        />
        
        <PortfolioMetric
          label="Margin Level"
          value={marginLevel}
          isCurrency={false}
          isPercentage={true}
          trend={getMarginTrend(marginLevel)}
        />
      </div>
    </div>
  );
};

export default EnhancedPortfolioSummary;