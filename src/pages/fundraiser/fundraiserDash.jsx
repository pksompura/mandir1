import React, { useEffect, useState } from "react";
import FundraiserDashboard from "../../components/FundraiserDashboard";
import { Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function FundraiserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in via OTP
    const storedUser = localStorage.getItem("authUser"); // stored on login
    if (!storedUser) {
      // Redirect to home/login if not logged in
      navigate("/login");
      return;
    }
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

  return <FundraiserDashboard user={user} />;
}
