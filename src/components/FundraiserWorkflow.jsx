"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
import FundraiserModal from "./FundraiserModal";
import LoginModel from "./LoginModel";
import { useNavigate } from "react-router-dom";

const FundraiserWorkflow = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginMobile, setLoginMobile] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const [isFromFundraiser, setFromFundraiser] = useState(false);

  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openRegister = () => {
    if (user) {
      // ✅ Already logged in → go directly to fundraiser setup
      navigate("/fundraiser-setup");
      return;
    }
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    setFromFundraiser(true); // ✅ mark flow as fundraisers
  };

  const openLogin = (mobile) => {
    setLoginMobile(mobile || "");
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setFromFundraiser(isFromFundraiser); // track flow
  };

  const handleSuccess = (userData) => {
    localStorage.setItem("authToken", userData.token);
    dispatch(setUserData(userData.user));
    setLoginMobile(""); // ✅ clear mobile after success
    navigate("/fundraiser-setup");
  };

  if (!mounted) return null;

  return (
    <>
      {/* ✅ Only "Start Fundraiser" button here */}
      <button
        className="border border-yellow-400 text-black px-4 py-[6px] rounded-full text-sm font-semibold transition duration-300 hover:bg-yellow-400 hover:text-black"
        onClick={openRegister}
      >
        Start Fundraiser
      </button>

      <FundraiserModal
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleSuccess}
        openLogin={openLogin}
      />
      {/* 
      <LoginModel
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        prefilledMobile={loginMobile}
        onOtpVerified={handleSuccess}
      /> */}
      <LoginModel
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        prefilledMobile={loginMobile}
        onOtpVerified={handleSuccess}
        fromFundraiser={isFromFundraiser} // dynamic
        reopenFundraiser={() => setIsRegisterOpen(true)}
      />
    </>
  );
};

export default FundraiserWorkflow;
