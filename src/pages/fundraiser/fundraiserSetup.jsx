import React from "react";
import FundraiserSetup from "../../components/FundraiserSetup";
import { Typography } from "antd";
import RequireAuth from "../../components/RequireAuth";

const { Title } = Typography;

export default function FundraiserSetupPage() {
  return (
    <RequireAuth>
      <div className="max-w-5xl mx-auto px-4 py-8 mt-12">
        <Title level={2} className="text-center mb-6">
          Setup Your Fundraiser
        </Title>
        <FundraiserSetup />
      </div>
    </RequireAuth>
  );
}
