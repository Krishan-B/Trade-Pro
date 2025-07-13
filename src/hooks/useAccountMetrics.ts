import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAccountMetrics = () => {
  const { user } = useAuth();

  const fetchAccountMetrics = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('account_metrics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no row is found, it's a new user. Return default zero values.
      if (error.code === 'PGRST116') {
        return {
          balance: 0,
          bonus: 0,
          available_margin: 0,
          used_margin: 0,
          unrealized_pl: 0,
          realized_pl: 0,
          account_equity: 0,
          buying_power: 0,
          exposure: 0,
          margin_level: 0,
        };
      }
      throw error;
    }
    return data;
  };

  return useQuery({
    queryKey: ['account_metrics', user?.id],
    queryFn: fetchAccountMetrics,
    enabled: !!user,
  });
};