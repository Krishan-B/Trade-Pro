import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardUser {
  username: string;
  total_pnl: number;
  rank: number;
}

export const useLeaderboardData = () => {
  const fetchLeaderboard = async (): Promise<LeaderboardUser[]> => {
    const { data, error } = await supabase.functions.invoke('leaderboard');

    if (error) {
      console.error("Error fetching leaderboard:", error);
      throw new Error(error.message);
    }

    return data?.data || [];
  };

  const {
    data: leaderboard,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
  };
};
