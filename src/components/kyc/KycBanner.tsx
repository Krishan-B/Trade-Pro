import { useKycStatus } from '@/hooks/useKycStatus';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';

export function KycBanner() {
  const { status, loading } = useKycStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (status === 'unverified' || status === 'rejected')) {
      navigate('/dashboard/kyc');
    }
  }, [status, loading, navigate]);

  if (loading || status === 'approved') return null;

  return (
    <Alert variant="default" className="mb-4">
      <ShieldAlert className="h-5 w-5 text-warning mr-2" />
      <div>
        <AlertTitle>KYC Required</AlertTitle>
        <AlertDescription>
          {status === 'pending'
            ? 'Your KYC documents are under review. You will be notified once approved.'
            : 'Please complete KYC verification to access all features.'}
        </AlertDescription>
      </div>
      {status === 'pending' && <Loader2 className="h-4 w-4 ml-2 animate-spin text-warning" />}
    </Alert>
  );
}
