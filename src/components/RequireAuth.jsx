import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-4 text-lg font-semibold">
          Please log in to access this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ✅ If logged in, render child page and pass user
  return React.cloneElement(children, { user });
};

export default RequireAuth;
