import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Typography } from "antd";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../redux/services/fundraiserApi";

const { Text } = Typography;

export default function FundraiserLoginModal({
  open,
  onClose,
  onLoginSuccess,
  openRegister,
  initialMobile = "",
}) {
  const [mobile, setMobile] = useState(initialMobile || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(initialMobile ? "verify" : "send");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [source, setSource] = useState(initialMobile ? "register" : "login"); // track source

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  // Reset when modal opens
  useEffect(() => {
    setMobile(initialMobile || "");
    setOtp("");
    setStep(initialMobile ? "verify" : "send");
    setError("");
    setResendTimer(0);
    setSource(initialMobile ? "register" : "login");
  }, [open, initialMobile]);

  // Resend OTP timer
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!mobile.trim()) {
      setError("Mobile number is required");
      return;
    }
    setError("");
    try {
      await sendOtp({ mobile_number: mobile }).unwrap();
      setStep("verify");
      setResendTimer(60);
      setSource("login"); // ✅ explicitly mark as login flow
    } catch (err) {
      setError(err?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Enter OTP");
      return;
    }
    setError("");
    try {
      const res = await verifyOtp({
        mobile_number: mobile,
        otp,
      }).unwrap();

      if (res?.token) {
        localStorage.setItem("authToken", res.token);
      }
      if (onLoginSuccess) onLoginSuccess(res?.fundraiser);
      onClose();
    } catch (err) {
      setError(err?.data?.error || "OTP verification failed");
    }
  };
  // Change mobile button
  const handleChangeMobile = () => {
    if (source === "register" && openRegister) {
      onClose(); // close login modal
      openRegister(); // reopen registration modal
    } else {
      // Reset login modal to send OTP step
      setOtp("");
      setStep("send");
      setError("");
      setResendTimer(0);
      setSource("login"); // mark as login source
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="100%"
      style={{ maxWidth: 420 }}
      destroyOnClose
      maskClosable
      keyboard
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Login via OTP</h2>

      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      {/* Step 1: Send OTP */}
      {step === "send" && (
        <>
          <Input
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="mb-3"
          />
          <Button
            type="primary"
            block
            onClick={handleSendOtp}
            loading={sending}
            style={{
              backgroundColor: "#facc15",
              borderColor: "#facc15",
              color: "#000",
            }}
          >
            {sending ? "Sending..." : "Send OTP"}
          </Button>
        </>
      )}

      {/* Step 2: Verify OTP */}
      {step === "verify" && (
        <>
          <Text className="block text-center text-gray-600 mb-2">
            Enter the OTP sent to <strong>{mobile}</strong>
          </Text>

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-3"
          />
          <Button
            type="primary"
            block
            onClick={handleVerifyOtp}
            loading={verifying}
            style={{
              backgroundColor: "#facc15",
              borderColor: "#facc15",
              color: "#000",
            }}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="flex justify-between text-sm text-gray-600 mb-3">
            {/* Resend OTP with countdown */}
            <Button
              type="link"
              disabled={resendTimer > 0}
              onClick={handleSendOtp}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </Button>
            <Button type="link" onClick={handleChangeMobile}>
              Change Mobile
            </Button>
          </div>
        </>
      )}

      <p className="text-sm text-gray-600 mt-4 text-center">
        Want to start a fundraiser?{" "}
        <Button
          type="link"
          onClick={() => {
            onClose();
            if (openRegister) openRegister();
          }}
        >
          Click here
        </Button>
      </p>
    </Modal>
  );
}
