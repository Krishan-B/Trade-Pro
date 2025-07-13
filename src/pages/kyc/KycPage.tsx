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
  const [idFileBack, setIdFileBack] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [optionalFile1, setOptionalFile1] = useState<File | null>(null);
  const [optionalFile2, setOptionalFile2] = useState<File | null>(null);
  const [optionalDocsComment, setOptionalDocsComment] = useState('');

  const [idType, setIdType] = useState('passport');
  const [addressType, setAddressType] = useState('bank_statement');

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [questionnaire, setQuestionnaire] = useState({
    tradingObjective: '',
    financialSituation: '',
    investmentExperience: '',
  });

  const handleQuestionnaireChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestionnaire((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'id' | 'id_back' | 'address' | 'optional1' | 'optional2',
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('File size cannot exceed 5MB.');
        return;
      }
      switch (type) {
        case 'id':
          setIdFile(file);
          break;
        case 'id_back':
          setIdFileBack(file);
          break;
        case 'address':
          setAddressFile(file);
          break;
        case 'optional1':
          setOptionalFile1(file);
          break;
        case 'optional2':
          setOptionalFile2(file);
          break;
      }
    }
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    if (!idFile || !addressFile || (idType === 'national_id' && !idFileBack)) {
      setError('Please upload all mandatory documents.');
      return;
    }
    setUploading(true);
    try {
      const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
      if (!user) throw new Error('User not authenticated');

      const uploadFile = async (file: File, folder: string) => {
        const { data, error } = await supabase.storage
          .from('kyc')
          .upload(`${user.id}/${folder}/${Date.now()}_${file.name}`, file, { upsert: true });
        if (error) throw error;
        return data.path;
      };

      const id_url = await uploadFile(idFile, 'identity');
      const id_url_back = idFileBack ? await uploadFile(idFileBack, 'identity') : null;
      const address_url = await uploadFile(addressFile, 'address');
      const optional_url_1 = optionalFile1 ? await uploadFile(optionalFile1, 'optional') : null;
      const optional_url_2 = optionalFile2 ? await uploadFile(optionalFile2, 'optional') : null;

      const { error: upsertError } = await supabase.from('kyc_documents').upsert(
        {
          user_id: user.id,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          questionnaire_answers: questionnaire,
          id_document_type: idType,
          id_url: id_url,
          id_url_back: id_url_back,
          address_document_type: addressType,
          address_url: address_url,
          optional_url_1: optional_url_1,
          optional_url_2: optional_url_2,
          optional_docs_comment: optionalDocsComment,
        },
        { onConflict: 'user_id' },
      );

      if (upsertError) throw upsertError;

      setSuccess('Documents uploaded successfully! Your KYC is now pending review.');
      // Reset form
      setIdFile(null);
      setIdFileBack(null);
      setAddressFile(null);
      setOptionalFile1(null);
      setOptionalFile2(null);
      setOptionalDocsComment('');
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
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Step 1: Profiling Questionnaire</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    This information helps us tailor your experience.
                  </p>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block font-medium mb-1">Trading Objective</label>
                      <select
                        name="tradingObjective"
                        value={questionnaire.tradingObjective}
                        onChange={handleQuestionnaireChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select...</option>
                        <option value="speculation">Speculation</option>
                        <option value="hedging">Hedging</option>
                        <option value="income">Income Generation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Financial Situation</label>
                      <select
                        name="financialSituation"
                        value={questionnaire.financialSituation}
                        onChange={handleQuestionnaireChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select...</option>
                        <option value="stable">Stable</option>
                        <option value="improving">Improving</option>
                        <option value="declining">Declining</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Investment Experience</label>
                      <select
                        name="investmentExperience"
                        value={questionnaire.investmentExperience}
                        onChange={handleQuestionnaireChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select...</option>
                        <option value="none">None</option>
                        <option value="limited">Limited</option>
                        <option value="experienced">Experienced</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={() => setStep(2)}>Next</Button>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Step 2: Document Upload</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Accepted formats: JPG, PNG, PDF. Max size: 5MB.
                  </p>
                  <div className="space-y-6 mb-4">
                    {/* Identity Verification */}
                    <div className="p-4 border rounded-md">
                      <h4 className="font-semibold mb-2">Identity Verification (Mandatory)</h4>
                      <label className="block font-medium mb-1">Document Type</label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                      >
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID</option>
                      </select>

                      {idType === 'national_id' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium mb-1">Front Side</label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, 'id')}
                            />
                          </div>
                          <div>
                            <label className="block font-medium mb-1">Back Side</label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, 'id_back')}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block font-medium mb-1">Upload Document</label>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileChange(e, 'id')}
                          />
                        </div>
                      )}
                    </div>

                    {/* Address Verification */}
                    <div className="p-4 border rounded-md">
                      <h4 className="font-semibold mb-2">Address Verification (Mandatory)</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Statement must be dated within the last 3 months.
                      </p>
                      <label className="block font-medium mb-1">Document Type</label>
                      <select
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                      >
                        <option value="bank_statement">Bank Statement</option>
                        <option value="credit_card_statement">Credit Card Statement</option>
                        <option value="tax_statement">Tax Statement</option>
                      </select>
                      <label className="block font-medium mb-1">Upload Document</label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'address')}
                      />
                    </div>

                    {/* Optional Documents */}
                    <div className="p-4 border rounded-md">
                      <h4 className="font-semibold mb-2">Optional Documents</h4>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange(e, 'optional1')}
                        />
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange(e, 'optional2')}
                        />
                      </div>
                      <textarea
                        value={optionalDocsComment}
                        onChange={(e) => setOptionalDocsComment(e.target.value)}
                        placeholder="Specify the nature of the optional documents"
                        className="w-full p-2 border rounded"
                        rows={2}
                      />
                    </div>

                    {error && <p className="text-destructive text-sm">{error}</p>}
                    {success && <p className="text-success text-sm">{success}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={handleUpload} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Submit Documents'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
