import React, { useEffect, useState } from "react";
import FundraiserSetup from "../../components/FundraiserSetup";
import { Spin, Typography } from "antd";

const { Title } = Typography;

export default function FundraiserSetupPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in via OTP
    const storedUser = localStorage.getItem("authUser"); // stored on login
    if (!storedUser) {
      // Redirect to home/login if not logged in
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-12">
      <Title level={2} className="text-center mb-6">
        Setup Your Fundraiser
      </Title>
      <FundraiserSetup user={user} />
    </div>
  );
}
