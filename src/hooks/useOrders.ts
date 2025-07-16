import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Order {
  id: string;
  asset_id: string;
  asset_name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  created_at: string;
}

async function fetchOrders(userId: string | undefined): Promise<{ openOrders: Order[], orderHistory: Order[] }> {
  if (!userId) {
    return { openOrders: [], orderHistory: [] };
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      asset_id,
      assets ( name ),
      type,
      quantity,
      price,
      status,
      created_at
    `)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const orders = data.map((order: any) => ({
    ...order,
    asset_name: order.assets.name,
  }));

  const openOrders = orders.filter((order: Order) => order.status === 'OPEN');
  const orderHistory = orders.filter((order: Order) => order.status !== 'OPEN');

  return { openOrders, orderHistory };
}

export function useOrders() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchOrders(user?.id),
    enabled: !!user,
  });

  return {
    openOrders: data?.openOrders ?? [],
    orderHistory: data?.orderHistory ?? [],
    isLoading,
    error,
  };
}