import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKycStatus } from '@/hooks/useKycStatus';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function KycPage() {
  const { status, loading } = useKycStatus();
  const navigate = useNavigate();

  const [idFile, setIdFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'address') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'id') setIdFile(e.target.files[0]);
      else setAddressFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    if (!idFile || !addressFile) {
      setError('Please upload both ID and address documents.');
      return;
    }
    setUploading(true);
    try {
      // Upload ID file
      const { data: idData, error: idError } = await supabase.storage
        .from('kyc')
        .upload(`id/${Date.now()}_${idFile.name}`, idFile, { upsert: true });
      if (idError) throw idError;

      // Upload address file
      const { data: addrData, error: addrError } = await supabase.storage
        .from('kyc')
        .upload(`address/${Date.now()}_${addressFile.name}`, addressFile, { upsert: true });
      if (addrError) throw addrError;

      // Insert or update KYC record in DB
      const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
      if (!user) throw new Error('User not authenticated');
      const { error: upsertError } = await supabase.from('kyc_documents').upsert(
        [
          {
            user_id: user.id,
            id_url: idData?.path ?? '',
            address_url: addrData?.path ?? '',
            status: 'pending',
            submitted_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'user_id' },
      );
      if (upsertError) throw upsertError;

      setSuccess('Documents uploaded successfully! Your KYC is now pending review.');
      setIdFile(null);
      setAddressFile(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
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
              <p className="mb-4">To access all features, please complete your KYC verification.</p>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block font-medium mb-1">Upload Government ID</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'id')}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Upload Proof of Address</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'address')}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                {success && <p className="text-success text-sm">{success}</p>}
              </div>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Submit Documents'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
