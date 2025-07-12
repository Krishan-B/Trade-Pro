import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type KycStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export function useKycStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<KycStatus>('unverified');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    if (!user) {
      setStatus('unverified');
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('kyc_documents')
      .select('status')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setStatus('unverified' as KycStatus);
        } else {
          setStatus((data?.status as KycStatus) || 'unverified');
        }
        setLoading(false);
      });

    // Subscribe to realtime changes for this user's KYC document
    channel = supabase
      .channel('kyc-status')
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

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user]);

  return { status, loading, error };
}
