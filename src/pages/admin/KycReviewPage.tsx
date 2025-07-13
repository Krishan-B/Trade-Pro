import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface KycDocument {
  user_id: string;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_id: string | null;
  rejection_reason: string | null;
  questionnaire_answers: {
    tradingObjective: string;
    financialSituation: string;
    investmentExperience: string;
  } | null;
  id_document_type: string | null;
  id_url: string | null;
  id_url_back: string | null;
  address_document_type: string | null;
  address_url: string | null;
  optional_url_1: string | null;
  optional_url_2: string | null;
  optional_docs_comment: string | null;
}

export default function KycReviewPage() {
  const [kycDocs, setKycDocs] = useState<KycDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkRejectDialogOpen, setBulkRejectDialogOpen] = useState(false);
  const [bulkRejectionReason, setBulkRejectionReason] = useState('');
  const bulkRejectInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchKycDocs();
  }, []);

  async function fetchKycDocs() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('status', 'pending');
    if (error) setError(error.message);
    else setKycDocs(data || []);
    setLoading(false);
  }

  async function handleAction(
    user_id: string,
    status: 'approved' | 'rejected',
    rejection_reason?: string,
  ) {
    setActionLoading(user_id + status);
    const { error } = await supabase
      .from('kyc_documents')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        rejection_reason: status === 'rejected' ? rejection_reason || 'Rejected by admin' : null,
      })
      .eq('user_id', user_id);
    setActionLoading(null);
    if (error) setError(error.message);
    else fetchKycDocs();
  }

  function openRejectDialog(user_id: string) {
    setRejectingUserId(user_id);
    setRejectionReason('');
    setRejectDialogOpen(true);
  }

  async function confirmReject() {
    if (rejectingUserId) {
      await handleAction(rejectingUserId, 'rejected', rejectionReason);
      setRejectDialogOpen(false);
      setRejectingUserId(null);
      setRejectionReason('');
    }
  }

  function toggleSelect(user_id: string) {
    setSelected((prev) =>
      prev.includes(user_id) ? prev.filter((id) => id !== user_id) : [...prev, user_id],
    );
  }

  function selectAll() {
    setSelected(kycDocs.map((doc) => doc.user_id));
  }

  function clearSelected() {
    setSelected([]);
  }

  async function handleBulkAction(status: 'approved' | 'rejected', rejection_reason?: string) {
    if (selected.length === 0) return;
    setActionLoading('bulk-' + status);
    const { error } = await supabase
      .from('kyc_documents')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        rejection_reason: status === 'rejected' ? rejection_reason || 'Rejected by admin' : null,
      })
      .in('user_id', selected);
    setActionLoading(null);
    if (error) setError(error.message);
    else {
      toast({
        title: `Bulk ${status === 'approved' ? 'Approval' : 'Rejection'} Successful`,
        description: `${selected.length} submissions updated.`,
      });
      fetchKycDocs();
      clearSelected();
    }
  }

  async function confirmBulkReject() {
    await handleBulkAction('rejected', bulkRejectionReason);
    setBulkRejectDialogOpen(false);
    setBulkRejectionReason('');
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>KYC Review (Admin)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bulk actions UI */}
          <div className="flex items-center gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={selectAll} disabled={kycDocs.length === 0}>
              Select All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearSelected}
              disabled={selected.length === 0}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => handleBulkAction('approved')}
              disabled={selected.length === 0 || !!actionLoading}
            >
              Bulk Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBulkRejectDialogOpen(true)}
              disabled={selected.length === 0 || !!actionLoading}
            >
              Bulk Reject
            </Button>
            <span className="text-xs text-muted-foreground ml-2">{selected.length} selected</span>
          </div>
          <Dialog open={bulkRejectDialogOpen} onOpenChange={setBulkRejectDialogOpen}>
            <DialogContent>
              <h3 className="text-lg font-semibold mb-2">Bulk Reject KYC Submissions</h3>
              <p className="mb-2">
                Please provide a reason for rejection (applies to all selected):
              </p>
              <Input
                ref={bulkRejectInputRef}
                value={bulkRejectionReason}
                onChange={(e) => setBulkRejectionReason(e.target.value)}
                placeholder="Rejection reason"
                className="mb-4"
              />
              <div className="flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => setBulkRejectDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={confirmBulkReject}
                  disabled={!bulkRejectionReason.trim() || !!actionLoading}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject All'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : kycDocs.length === 0 ? (
            <p>No pending KYC submissions.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 border">User ID</th>
                    <th className="p-2 border">Submitted At</th>
                    <th className="p-2 border">Documents</th>
                    <th className="p-2 border">Questionnaire</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kycDocs.map((doc) => (
                    <tr key={doc.user_id}>
                      <td className="p-2 border">
                        <Checkbox
                          checked={selected.includes(doc.user_id)}
                          onCheckedChange={() => toggleSelect(doc.user_id)}
                        />
                        {doc.user_id}
                      </td>
                      <td className="p-2 border">
                        {doc.submitted_at ? new Date(doc.submitted_at).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-2 border text-xs">
                        <div>
                          ID ({doc.id_document_type}):{' '}
                          <a
                            href={supabase.storage.from('kyc').getPublicUrl(doc.id_url!).data.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            Front
                          </a>
                          {doc.id_url_back && (
                            <>
                              {' | '}
                              <a
                                href={
                                  supabase.storage.from('kyc').getPublicUrl(doc.id_url_back).data
                                    .publicUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                Back
                              </a>
                            </>
                          )}
                        </div>
                        <div>
                          Address ({doc.address_document_type}):{' '}
                          <a
                            href={
                              supabase.storage.from('kyc').getPublicUrl(doc.address_url!).data
                                .publicUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            View
                          </a>
                        </div>
                        {doc.optional_url_1 && (
                          <div>
                            Optional 1:{' '}
                            <a
                              href={
                                supabase.storage.from('kyc').getPublicUrl(doc.optional_url_1).data
                                  .publicUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              View
                            </a>
                          </div>
                        )}
                        {doc.optional_url_2 && (
                          <div>
                            Optional 2:{' '}
                            <a
                              href={
                                supabase.storage.from('kyc').getPublicUrl(doc.optional_url_2).data
                                  .publicUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              View
                            </a>
                          </div>
                        )}
                        {doc.optional_docs_comment && (
                          <div>Comment: {doc.optional_docs_comment}</div>
                        )}
                      </td>
                      <td className="p-2 border text-xs">
                        {doc.questionnaire_answers ? (
                          <ul className="list-disc list-inside">
                            <li>
                              Objective: {doc.questionnaire_answers.tradingObjective}
                            </li>
                            <li>
                              Situation: {doc.questionnaire_answers.financialSituation}
                            </li>
                            <li>
                              Experience: {doc.questionnaire_answers.investmentExperience}
                            </li>
                          </ul>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="p-2 border space-x-2">
                        <Button
                          size="sm"
                          variant="default"
                          disabled={!!actionLoading}
                          onClick={() => handleAction(doc.user_id, 'approved')}
                        >
                          {actionLoading === doc.user_id + 'approved' ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!!actionLoading}
                          onClick={() => openRejectDialog(doc.user_id)}
                        >
                          {actionLoading === doc.user_id + 'rejected' ? 'Rejecting...' : 'Reject'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent>
              <h3 className="text-lg font-semibold mb-2">Reject KYC Submission</h3>
              <p className="mb-2">Please provide a reason for rejection:</p>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason"
                className="mb-4"
              />
              <div className="flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim() || !!actionLoading}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
