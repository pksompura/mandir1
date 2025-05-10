import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import {
  useSentOtpMutation,
  useVerifyOtpMutation,
} from "../redux/services/campaignApi";

const LoginModel = ({
  open,
  onClose,
  isDonation,
  setDonationuser,
  setIsDonationModalVisible,
}) => {
  const [stepCount, setStepCount] = useState(null);
  const [sendOtp, { isLoading: sendOtpLoading, isSuccess, reset }] =
    useSentOtpMutation();
  const [sendOtpInSeconds, setSendOtpInSeconds] = useState(60); // 60 seconds resend
  const [otpValidDuration, setOtpValidDuration] = useState(300); // 5 minutes OTP validity
  const [timerActive, setTimerActive] = useState(false);

  const [
    verifyOtp,
    {
      data,
      isLoading: verifyOtpLoading,
      isSuccess: verifyOtpSuccess,
      reset: verifyOtpReset,
      error: verifyOtpError,
    },
  ] = useVerifyOtpMutation();
  function removeCountryCode(phoneNumber) {
    return phoneNumber.replace(/^\+\d{1,2}/, "");
  }

  useEffect(() => {
    if (isSuccess) {
      setStepCount(1);
      setSendOtpInSeconds(60); // Reset to 60 seconds for resend
      setOtpValidDuration(300); // Reset to 5 minutes
      setTimerActive(true);
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    let resendTimer;
    if (timerActive && sendOtpInSeconds > 0) {
      resendTimer = setInterval(() => {
        setSendOtpInSeconds((prev) => prev - 1);
      }, 1000);
    } else if (sendOtpInSeconds === 0) {
      setTimerActive(false); // Stop the timer when it reaches 0
    }
    return () => clearInterval(resendTimer);
  }, [timerActive, sendOtpInSeconds]);

  const handleResendOtp = async () => {
    const phoneNumber = removeCountryCode(phoneForm.values.mobile_number);
    if (phoneNumber.length === 10) {
      await sendOtp({ mobile_number: phoneNumber }); // Resend OTP API Call
      setSendOtpInSeconds(60); // Reset countdown timer to 60s
      setOtpValidDuration(300); // Reset OTP validity to 5 mins
      setTimerActive(true); // Restart the timer
    }
  };

  useEffect(() => {
    let otpTimer;
    if (otpValidDuration > 0) {
      otpTimer = setInterval(() => {
        setOtpValidDuration((prev) => prev - 1);
      }, 1000);
    } else {
      setStepCount(null); // Reset to phone input after OTP expires
    }
    return () => clearInterval(otpTimer);
  }, [otpValidDuration]);

  useEffect(() => {
    if (verifyOtpSuccess) {
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data?.token);
        if (!isDonation) {
          window.location.reload();
        } else {
          setDonationuser(data?.user);
          setIsDonationModalVisible(true);
        }
      }
      onClose();
    }
  }, [verifyOtpSuccess, data?.token, onClose]);

  const phoneForm = useFormik({
    initialValues: { mobile_number: "" },
    validate: (values) => {
      const errors = {};
      const phoneNumber = removeCountryCode(values.mobile_number);
      if (!phoneNumber) {
        errors.mobile_number = "Enter 10 digit phone number to login";
      } else if (phoneNumber.length !== 10) {
        errors.mobile_number = "Enter 10 digit phone number to login";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const phoneNumber = removeCountryCode(values.mobile_number);
      if (phoneNumber.length === 10) {
        await sendOtp({ mobile_number: phoneNumber });
      }
    },
  });

  const otpForm = useFormik({
    initialValues: { otp: "" },
    validate: (values) => {
      const errors = {};
      if (!values.otp) errors.otp = "OTP is required";
      else if (values.otp.length < 6) errors.otp = "OTP must be 6 digits";
      return errors;
    },
    onSubmit: async (values) => {
      await verifyOtp({
        otp: values.otp,
        mobile_number: removeCountryCode(phoneForm.values.mobile_number),
      });
    },
  });

  const handleClose = () => {
    phoneForm.resetForm(); // Reset phone input form completely
    otpForm.resetForm(); // Reset OTP input form completely
    verifyOtpReset(); // Reset backend errors
    setStepCount(null); // Go back to phone input step
    onClose(); // Close the modal
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px", // Ensures the dialog itself is rounded
          overflow: "hidden", // Prevents stretching on content change
        },
      }}
      className="rounded-lg" // Tailwind class for extra rounded effect
    >
      <form
        onSubmit={stepCount ? otpForm.handleSubmit : phoneForm.handleSubmit}
      >
        <DialogTitle className="font-bold text-center">
          {stepCount ? (
            <>
              Verify OTP
              <br />
              <p className="text-sm font-thin pt-2">
                Sent to {phoneForm.values?.mobile_number}{" "}
                <span
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => {
                    otpForm.resetForm(); // Reset the OTP form
                    verifyOtpReset(); // Clear backend error
                    setStepCount(null); // Go back to phone number input
                  }}
                >
                  Change
                </span>
              </p>
            </>
          ) : (
            "Login / Sign up"
          )}
        </DialogTitle>

        <DialogContent>
          <div className="flex w-full justify-center items-center rounded-full space-x-2 py-1">
            {stepCount ? (
              <CaptureOtp
                form={otpForm}
                backendError={verifyOtpError?.data?.error}
              />
            ) : (
              <CapturePhoneNumber form={phoneForm} />
            )}
          </div>

          {/* {!stepCount && (
            <div className="w-full text-xs text-center text-gray-400 mt-6">
              Enter 10 digit phone number to login
            </div>
          )} */}
        </DialogContent>

        <DialogActions
          sx={{
            flexDirection: "column",
            // padding: "2px 0",
          }}
        >
          {stepCount ? (
            <>
              <Button
                type="button"
                onClick={() => otpForm.handleSubmit()}
                variant="contained"
                className="w-[57%] md:w-[40%] !mx-auto"
                sx={{
                  height: "40px",
                  minWidth: "120px",
                  maxWidth: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffdd04",
                  color: "#000",
                  "&:hover": { backgroundColor: "#e6c703" },
                  marginTop: "-8px",
                }}
              >
                {verifyOtpLoading ? (
                  <CircularProgress size={20} sx={{ color: "#000" }} />
                ) : (
                  "Verify"
                )}
              </Button>
              <div className="text-center text-sm mt-1 mb-2">
                {sendOtpInSeconds > 0 ? (
                  <span className="text-gray-500">
                    Resend OTP in {sendOtpInSeconds}s
                  </span>
                ) : (
                  <button
                    className="text-blue-500 cursor-pointer underline"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => phoneForm.handleSubmit()}
              variant="contained"
              className="w-[50%] md:w-[40%] !mx-auto font-bold"
              sx={{
                height: "40px",
                minWidth: "160px",
                maxWidth: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#d6573d",
                color: "#fff",
                fontWeight: "bold", // Makes text bold
                "&:hover": { backgroundColor: "#b84c32" },
                // marginTop: "-2px",
              }}
            >
              {sendOtpLoading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Request OTP"
              )}
            </Button>
          )}

          {/* Error message (Fixed height to prevent modal stretch) */}
          {/* {verifyOtpError && (
            <div className="h-[16px] text-xs text-red-500 text-center">
              {verifyOtpError?.data?.error}
            </div>
          )} */}
        </DialogActions>
      </form>

      <p className="text-[10px] md:text-xs text-center pb-1 px-3">
        *By continuing, I agree to the{" "}
        <a href="/terms" className="text-blue-500">
          Terms Of Use
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-blue-500">
          Privacy Policy
        </a>
        .
      </p>
      <p className="text-[10px] md:text-xs text-center pb-3 px-6">
        and receiving SMS/Whatsapp updates and notifications.
      </p>
    </Dialog>
  );
};

export default LoginModel;

const CapturePhoneNumber = ({ form }) => {
  return (
    <div className="w-full md:w-[250px] lg:w-[300px] relative px-2">
      <div className="flex items-center border border-gray-300 rounded-md px-4 py-2">
        {/* +91 Country Code */}
        <span className="text-gray-500 font-medium pr-1">+91</span>
        <div className="h-5 w-[1px] bg-gray-300"></div> {/* Vertical Border */}
        {/* Phone Number Input */}
        <input
          type="tel"
          value={form.values?.mobile_number}
          onChange={(e) => {
            const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            if (inputValue.length <= 10) {
              form.setFieldValue("mobile_number", inputValue);
            }
          }}
          className="w-full pl-2 outline-none bg-transparent"
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
        />
      </div>

      {/* Error Message Below */}
      {form.errors.mobile_number && (
        <div className="absolute text-red-500 text-xs mt-1">
          {form.errors.mobile_number}
        </div>
      )}
    </div>
  );
};

const CaptureOtp = ({ form, backendError }) => (
  <div className="w-full relative flex flex-col items-center">
    <TextField
      variant="outlined"
      placeholder="Enter OTP"
      fullWidth
      inputProps={{
        maxLength: 6,
        style: { padding: "8px 10px", height: "30px" },
      }}
      value={form.values.otp}
      onChange={(e) => form.setFieldValue("otp", e.target.value)}
      error={
        Boolean(form.touched.otp && form.errors.otp) || Boolean(backendError)
      }
      helperText={""} // Disable built-in helper text to avoid shifting
      sx={{
        "& input": {
          textAlign: "center",
          letterSpacing: "0.3em",
        },
      }}
    />
    {/* Fixed height ensures no stretching */}
    <div className="h-[2px] text-xs text-red-500 mt-1 text-center">
      {form.touched.otp && form.errors.otp
        ? form.errors.otp
        : backendError || ""}
    </div>
  </div>
);
