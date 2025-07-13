import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useKycStatus } from "../../hooks/useKycStatus";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const KycBanner = () => {
  const { status: kycStatus, loading: isLoading } = useKycStatus();
  const navigate = useNavigate();

  const handleVerifyNow = () => {
    navigate("/dashboard/kyc");
  };

  const shouldShowBanner =
    !isLoading &&
    kycStatus &&
    ["unverified", "pending resubmission", "failed"].includes(kycStatus);

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <Alert variant="destructive" className="my-4">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Account Verification Required</AlertTitle>
      <AlertDescription>
        Complete your verification to access all features.
        <Button onClick={handleVerifyNow} className="ml-4">
          Verify Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};
