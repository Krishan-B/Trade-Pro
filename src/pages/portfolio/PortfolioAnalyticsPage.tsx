import React from 'react';
import { usePortfolioAnalytics } from '@/hooks/usePortfolioAnalytics';
import WinRatePieChart from '@/features/analytics/components/WinRatePieChart';
import PnLChart from '@/features/analytics/components/PnLChart';
import AssetPerformanceList from '@/features/analytics/components/AssetPerformanceList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PortfolioAnalyticsPage = () => {
  const { analytics, isLoading, error } = usePortfolioAnalytics();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading analytics: {error.message}</div>;
  }

  if (!analytics) {
    return <div className="p-8">No analytics data available.</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <WinRatePieChart winRate={analytics.win_rate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cumulative P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <PnLChart data={analytics.performance.pnl_history} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetPerformanceList assets={analytics.top_performers} title="Top 5" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Worst Performing Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetPerformanceList assets={analytics.worst_performers} title="Worst 5" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioAnalyticsPage;