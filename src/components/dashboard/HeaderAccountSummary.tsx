import React from 'react';
import { useAccountMetrics } from '@/hooks/useAccountMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MetricDisplayProps {
  label: string;
  value: number | undefined;
  isCurrency?: boolean;
  isPercentage?: boolean;
  showTrend?: boolean;
  isPositive?: boolean;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  isCurrency = true, 
  isPercentage = false,
  showTrend = false,
  isPositive = true 
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
    <div className="flex items-center space-x-2">
      <span className={`text-lg font-bold ${showTrend ? (isPositive ? 'text-success' : 'text-destructive') : 'text-foreground'}`}>
        {isCurrency && '$'}
        {typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        {isPercentage && '%'}
      </span>
      {showTrend && (
        isPositive ? (
          <TrendingUp className="w-4 h-4 text-success" />
        ) : (
          <TrendingDown className="w-4 h-4 text-destructive" />
        )
      )}
    </div>
  </div>
);

const HeaderAccountSummary: React.FC = () => {
  const { data: metrics, isLoading, refetch } = useAccountMetrics();
  
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    );
  }

  const totalPL = (metrics?.unrealized_pl || 0) + (metrics?.realized_pl || 0);
  const isPlPositive = totalPL >= 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <MetricDisplay 
            label="Account Balance" 
            value={metrics?.balance} 
            isCurrency={true}
          />
          <MetricDisplay 
            label="Account Equity" 
            value={metrics?.account_equity} 
            isCurrency={true}
          />
          <MetricDisplay 
            label="Total P&L" 
            value={totalPL} 
            isCurrency={true}
            showTrend={true}
            isPositive={isPlPositive}
          />
          <MetricDisplay 
            label="Margin Level" 
            value={metrics?.margin_level} 
            isCurrency={false}
            isPercentage={true}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default HeaderAccountSummary;