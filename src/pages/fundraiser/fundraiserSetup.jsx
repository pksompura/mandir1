import React, { useEffect, useState } from "react";
import FundraiserSetup from "../../components/FundraiserSetup";
import { Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function FundraiserSetupPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    console.log(storedUser);

    if (!storedUser) {
      // If no user → go home
      navigate("/");
      return;
    }

    // Parse user and set
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

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
