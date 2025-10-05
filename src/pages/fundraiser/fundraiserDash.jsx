import React, { useEffect, useState } from "react";
import FundraiserDashboard from "../../components/FundraiserDashboard";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FundraiserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/"); // redirect to home if not logged in
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/get-user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (err) {
        console.error("Auth failed:", err);
        localStorage.removeItem("authToken");
        navigate("/"); // send home if token invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
