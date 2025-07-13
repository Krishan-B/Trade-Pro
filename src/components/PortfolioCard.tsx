import { useAccountMetrics } from '@/hooks/useAccountMetrics';
import { Skeleton } from '@/components/ui/skeleton';

const MetricItem = ({ label, value, isCurrency = true, isPercentage = false }: { label: string; value: number | undefined; isCurrency?: boolean; isPercentage?: boolean }) => (
  <div className="flex justify-between py-2 border-b border-gray-200/10">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">
      {isCurrency && '$'}
      {typeof value === 'number' ? value.toFixed(2) : '0.00'}
      {isPercentage && '%'}
    </span>
  </div>
);

const PortfolioCard = () => {
  const { data: metrics, isLoading } = useAccountMetrics();

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Portfolio</h2>
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">My Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        <MetricItem label="Balance" value={metrics?.balance} />
        <MetricItem label="Bonus" value={metrics?.bonus} />
        <MetricItem label="Available Margin" value={metrics?.available_margin} />
        <MetricItem label="Used Margin" value={metrics?.used_margin} />
        <MetricItem label="Unrealized P&L" value={metrics?.unrealized_pl} />
        <MetricItem label="Realized P&L" value={metrics?.realized_pl} />
        <MetricItem label="Account Equity" value={metrics?.account_equity} />
        <MetricItem label="Buying Power" value={metrics?.buying_power} />
        <MetricItem label="Exposure" value={metrics?.exposure} />
        <MetricItem label="Margin Level" value={metrics?.margin_level} isPercentage />
      </div>
    </div>
  );
};

export default PortfolioCard;