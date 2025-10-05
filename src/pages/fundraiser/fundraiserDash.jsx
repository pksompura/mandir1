import React, { useEffect, useState } from "react";
import FundraiserDashboard from "../../components/FundraiserDashboard";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

export default function FundraiserDashboardPage() {
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
