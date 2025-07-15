import { useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type KycStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export function useKycStatus() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<KycStatus>('unverified');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!user) {
      setStatus('unverified');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore 'not found' error
        throw error;
      }
      
      setStatus((data?.status as KycStatus) || 'unverified');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setStatus('unverified');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    void fetchStatus();

    let channel: RealtimeChannel | null = null;
    if (user) {
      channel = supabase
        .channel(`kyc-status-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'kyc_documents',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newStatus =
              payload.new && typeof (payload.new as { status?: string }).status === 'string'
                ? ((payload.new as { status: string }).status as KycStatus)
                : undefined;
            if (newStatus) setStatus(newStatus);
          },
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [user, authLoading, fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}
