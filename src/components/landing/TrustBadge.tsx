
import React from "react";
import { Shield } from "lucide-react";

interface TrustBadgeProps {
  text: string;
}

const TrustBadge = ({ text }: TrustBadgeProps) => {
  return (
    <div className="flex items-center text-lg">
      <Shield className="h-6 w-6 text-success mr-3" />
      <span>{text}</span>
    </div>
  );
};

export default TrustBadge;
