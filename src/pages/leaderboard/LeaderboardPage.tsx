import React from 'react';
import { useLeaderboardData } from '@/hooks/useLeaderboardData';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LeaderboardPage = () => {
  const { leaderboard, isLoading, error } = useLeaderboardData();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading leaderboard: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top Traders</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardTable users={leaderboard || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;