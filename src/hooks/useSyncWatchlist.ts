import { useEffect } from 'react';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { supabase } from '../lib/supabaseClient'; // Assuming you have a supabase client instance

export const useSyncWatchlist = (userId: string | undefined) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

  // Fetch initial watchlist from DB
  useEffect(() => {
    if (!userId) return;

    const fetchWatchlist = async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('symbol')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching watchlist:', error);
      } else {
        const symbols = data.map(item => item.symbol);
        useWatchlistStore.setState({ watchlist: symbols });
      }
    };

    fetchWatchlist();
  }, [userId]);

  // Sync local additions to DB
  useEffect(() => {
    if (!userId) return;

    const syncAdditions = async (symbol: string) => {
      const { error } = await supabase
        .from('watchlist')
        .insert({ user_id: userId, symbol: symbol });

      if (error) {
        console.error('Error adding to watchlist:', error);
        // Revert state on error
        removeFromWatchlist(symbol);
      }
    };

    const unsub = useWatchlistStore.subscribe(
      (state, prevState) => {
        const added = state.watchlist.filter(s => !prevState.watchlist.includes(s));
        added.forEach(syncAdditions);
      }
    );

    return unsub;
  }, [userId, removeFromWatchlist]);

  // Sync local removals to DB
  useEffect(() => {
    if (!userId) return;

    const syncRemovals = async (symbol: string) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .match({ user_id: userId, symbol: symbol });

      if (error) {
        console.error('Error removing from watchlist:', error);
        // Revert state on error
        addToWatchlist(symbol);
      }
    };

    const unsub = useWatchlistStore.subscribe(
      (state, prevState) => {
        const removed = prevState.watchlist.filter(s => !state.watchlist.includes(s));
        removed.forEach(syncRemovals);
      }
    );

    return unsub;
  }, [userId, addToWatchlist]);
};