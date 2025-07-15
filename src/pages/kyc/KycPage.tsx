import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKycStatus } from '@/hooks/useKycStatus';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import KYCVerification from '@/components/kyc/KYCVerification';
import { useToast } from '@/hooks/use-toast';

export default function KycPage() {
  const { status, loading, refetch } = useKycStatus();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleKycComplete = () => {
    toast({
      title: 'KYC Documents Submitted',
      description: 'Your documents are now under review.',
    });
    refetch();
  };

  const handleKycError = (error: string) => {
    toast({
      title: 'KYC Submission Failed',
      description: error,
      variant: 'destructive',
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading your KYC status...</p>
          ) : status === 'approved' ? (
            <div>
              <p className="text-success font-medium mb-2">Your KYC is approved!</p>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : status === 'pending' ? (
            <p>Your KYC documents are under review. Please wait for approval.</p>
          ) : (
            <div>
              {status === 'rejected' && (
                <p className="text-destructive font-medium mb-2">
                  Your KYC was rejected. Please re-submit your documents.
                </p>
              )}
              <KYCVerification onComplete={handleKycComplete} onError={handleKycError} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
