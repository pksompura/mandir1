import React from "react";
import FundraiserDashboard from "../../components/FundraiserDashboard";
import RequireAuth from "../../components/RequireAuth";

export default function FundraiserDashboardPage() {
  return (
    <RequireAuth>
      <FundraiserDashboard />
    </RequireAuth>
  );
}
