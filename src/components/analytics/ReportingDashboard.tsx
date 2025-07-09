import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { withErrorBoundary } from "@/components/hoc/withErrorBoundary";

const ReportingDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting Dashboard</CardTitle>
      </CardHeader>
      <CardContent>{/* Dashboard content goes here */}</CardContent>
    </Card>
  );
};

const ReportingDashboardWithErrorBoundary = withErrorBoundary(
  ReportingDashboard,
  "reporting_dashboard"
);
export default ReportingDashboardWithErrorBoundary;
