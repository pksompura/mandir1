import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "@mui/material";
import { message } from "antd";
import {
  useLoginUserMutation,
  useVerifyOtpMutation,
  useUpdateUserMutation,
} from "../../redux/services/campaignApi";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { setUserData } from "../../redux/slices/userSlice";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../redux/services/transactionApi";
import { Spin } from "antd";
import ThankYouModal from "./ThankYouModel";
import { flushSync } from "react-dom";

const DonationForm = ({
  open,
  handleClose,
  setIsDonationModalVisible,
  donation_campaign_id,
  donationuser,
  donation_amounts,
  campaign_title,
  minimum_amount,
  target_amount,
}) => {
  const [loginUser] = useLoginUserMutation(); // Login mutation
  const [verifyOtp] = useVerifyOtpMutation(); // OTP verification mutation
  const [updateUser] = useUpdateUserMutation(); // Redux API to update user
  const [verifyPayment] = useVerifyPaymentMutation(); // OTP verification mutation
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [isChecked, setIsChecked] = useState(false);
  const minAmount = Number(minimum_amount?.$numberDecimal);
  const target = Number(target_amount?.$numberDecimal);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [donationAmount, setDonationAmount] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false); // OTP modal visibility
  const [otp, setOtp] = useState(""); // OTP input
  const [total, setTotal] = useState();
  const [createOrder] = useCreateOrderMutation();
  const [userData, setUserData1] = useState({
    full_name: donationuser?.full_name || "",
    email: donationuser?.email || "",
  });
  const [timer, setTimer] = useState(0);
  const [citizenStatus, setCitizenStatus] = useState("yes");
  const [showError, setShowError] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [percent, setPercent] = useState((minAmount / target) * 100);
  // const [donationAmount, setDonationAmount] = useState(1500);
  const [error, setError] = useState("");
  console.log(donationuser);
  // const [infoErrors, setInfoErrors] = useState({
  //   full_name: "",
  //   email: "",
  // });
  const [infoErrors, setInfoErrors] = useState({});
  const [foreignError, setForeignError] = useState(false);
  const [supportPercent, setSupportPercent] = useState(0); // Default 5%
  const [manualTip, setManualTip] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const dropdownRef = useRef(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const processedAmounts = (donation_amounts || [])
    .map((item) => parseFloat(item?.$numberDecimal || 0))
    .filter((num) => !isNaN(num) && num > 0);

  const uniqueSortedAmounts = [...new Set(processedAmounts)].sort(
    (a, b) => a - b
  );
  const fallbackAmounts = [500, 1500, 3000];
  const displayAmounts =
    uniqueSortedAmounts.length > 0 ? uniqueSortedAmounts : fallbackAmounts;

  const popularAmount =
    displayAmounts.length >= 3
      ? displayAmounts[Math.floor(displayAmounts.length / 2)]
      : null;

  const defaultAmount =
    popularAmount || displayAmounts[displayAmounts.length - 1]; // Highest if less than 3

  const [donationAmount, setDonationAmount] = useState(defaultAmount);

  // Calculate tip amount

  const tipAmount =
    isOtherSelected && manualTip > 0
      ? manualTip
      : (donationAmount * supportPercent) / 100;
  // Predefined Tip Options
  const tipOptions = [5, 10, 20];

  const handleSelect = (value) => {
    if (value === "other") {
      setSupportPercent(""); // Clear selection for manual input
    } else {
      setSupportPercent(value);
      setManualTip(""); // Reset manual input when selecting a predefined option
    }
    setIsDropdownOpen(false);
  };

  const handleCustomInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setManualTip(value);
  };

  const handleCustomBlur = () => {
    if (manualTip) {
      setSupportPercent(Number(manualTip)); // Set custom tip
    } else {
      setSupportPercent(0); // Reset to default 5% if empty
    }
    setIsDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Display selected value in input
  const displayValue =
    supportPercent === ""
      ? `₹${manualTip || 0}` // Custom tip shows INR amount
      : `${supportPercent}%`; // Selected percentage shows only %

  // const updatePosition = (e) => {
  //   if (!trackRef.current) return;
  //   const rect = trackRef.current.getBoundingClientRect();
  //   let clientX = e.clientX || (e.touches && e.touches[0].clientX);
  //   const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

  //   let newPercent = (x / rect.width) * 100;
  //   const value = Math.round((newPercent / 100) * target);

  //   if (value < minAmount) {
  //     setPercent((minAmount / target) * 100);
  //     setDonationAmount(minAmount);
  //   } else {
  //     setPercent(newPercent);
  //     setDonationAmount(value);
  //   }
  // };
  const updatePosition = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

    let newPercent = (x / rect.width) * 100;
    const value = Math.round((newPercent / 100) * target);

    if (value < minAmount) {
      setPercent((minAmount / target) * 100);
      setDonationAmount(minAmount);
    } else {
      setPercent(Math.min(newPercent, 100)); // ✅ progress bar max 100%
      setDonationAmount(Math.min(value, target)); // ✅ dragging donation capped at target
    }
  };
  // useEffect(() => {
  //   const stopDrag = () => setIsDragging(false);
  //   if (isDragging) {
  //     document.addEventListener("mousemove", updatePosition);
  //     document.addEventListener("mouseup", stopDrag);
  //     document.addEventListener("touchmove", updatePosition);
  //     document.addEventListener("touchend", stopDrag);
  //   }
  //   return () => {
  //     document.removeEventListener("mousemove", updatePosition);
  //     document.removeEventListener("mouseup", stopDrag);
  //     document.removeEventListener("touchmove", updatePosition);
  //     document.removeEventListener("touchend", stopDrag);
  //   };
  // }, [isDragging]);
  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", updatePosition);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchmove", updatePosition);
      document.addEventListener("touchend", stopDrag);
    }
    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", updatePosition);
      document.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging]);

  // useEffect(() => {
  //   if (percent === 0) {
  //     setError('Please enter donation amount');
  //   } else if (percent < 5) {
  //     setError('Minimum donation amount is INR 5');
  //   } else {
  //     setError('');
  //   }
  // }, [percent]);

  // Validate donation amount
  // useEffect(() => {
  //   if (!donationAmount || donationAmount === 0) {
  //     setError("Please enter donation amount");
  //   } else if (donationAmount < minAmount) {
  //     setError(`Minimum donation amount is INR ${minAmount}`);
  //   } else {
  //     setError("");
  //   }
  // }, [donationAmount]);
  useEffect(() => {
    if (!donationAmount || donationAmount === 0) {
      setError("Please enter donation amount");
    } else if (donationAmount < minAmount) {
      setError(`Minimum donation amount is INR ${minAmount}`);
    } else {
      setError("");
    }
  }, [donationAmount]);

  useEffect(() => {
    if (donationAmount > 0 && target > 0) {
      const initialPercent = (donationAmount / target) * 100;
      setPercent(Math.min(initialPercent, 100));
    }
  }, [donationAmount, target]);

  const startDrag = (e) => {
    e.preventDefault();
    updatePosition(e);
    setIsDragging(true);
  };

  // // Optional: Sync when user types in donation input
  // useEffect(() => {
  //   if (donationAmount < minAmount) {
  //     setDonationAmount(minAmount);
  //   }
  //   const calcPercent = ((donationAmount - minAmount) / (target - minAmount)) * 100;
  //   setPercent(calcPercent);
  // }, [donationAmount]);

  useEffect(() => {
    let interval;
    if (otpModalVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpModalVisible, timer]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // This only runs once, after the component mounts

  // Calculate total donation
  // const calculateTotal = () => (donationAmount + tipAmount).toFixed(2);
  const calculateTotal = () => {
    return (parseFloat(donationAmount) + parseFloat(tipAmount)).toFixed(2);
  };

  const validateForm = () => {
    if (!citizenStatus) {
      setShowError(true);
      return false;
    }
    setShowError(false);
    return true;
  };

  useEffect(() => {
    if (donationuser) {
      setUserData1({
        full_name: donationuser.full_name || "",
        email: donationuser.email || "",
      });
    }
  }, [donationuser]);
  const handleDonateNow = async () => {
    const errors = {};

    if (!isChecked) {
      message.error(
        "You must agree to the terms & conditions before proceeding."
      );
      return;
    }

    // Validate donation amount
    if (donationAmount < minAmount) {
      message.error(`Minimum donation amount is INR ${minAmount}`);
      return;
    }

    // Validate input fields
    if (!userData.full_name) errors.full_name = "Full Name is required";
    if (!userData.email) errors.email = "Email is required";

    // Check Citizenship
    if (citizenStatus !== "yes") {
      setShowError(true);
      message.error("Only Indian citizens are allowed to donate.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      setInfoErrors(errors);
      return;
    }

    try {
      // ✅ If user is new, update details before proceeding
      await updateUser({
        mobile: donationuser?.mobile,
        full_name: userData.full_name,
        email: userData.email,
      });

      // ✅ Proceed with payment
      await initiatePayment();
    } catch (error) {
      message.error(error.data?.error || "Something went wrong.");
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 6) {
      // Call the verify OTP API
      try {
        const response = await verifyOtp({
          mobile_number: donationuser.mobile_number,
          otp: otp,
        });

        // OTP verified successfully, log in the user
        message.success(response.data.message);
        console.log(response);
        localStorage.setItem("authToken", response.data.token);
        setUserData1(response.data.user);
        dispatch(setUserData(response.data.user));
        // Store token in local storage
        setIsLoggedIn(true); // Set user as logged in
        setOtpModalVisible(false); // Close OTP modal
        handleClose();
        setIsDonationModalVisible(true);

        // Close the donation modal when donation is successful
      } catch (error) {
        console.log(error);
        message.error(error.data?.error || "Invalid OTP.");
      }
    } else {
      message.error("Please enter a valid 6-digit OTP.");
    }
  };

  const initiatePayment = async () => {
    try {
      const orderResponse = await createOrder({
        user_id: donationuser?._id,
        donation_campaign_id, // Already a variable
        amount: calculateTotal(), // In INR (your backend should multiply by 100 for paise)
        is_anonymous: isAnonymous,
      }).unwrap();

      const { data: razorpayOrder, donation_id } = orderResponse;

      await triggerRazorpay(razorpayOrder, donation_id);
    } catch (error) {
      console.error("Create Order Error:", error);
      message.error(error?.data?.error || "Error creating payment order.");
    }
  };

  const handlePresetClick = (amount) => {
    setDonationAmount(amount);
    setPercent((amount / target) * 100);
  };
  // const handleInputChange = (e) => {
  //   let value = e.target.value;

  //   if (value === '') {
  //     setDonationAmount(0); // If input is empty, set to 0
  //     return;
  //   }

  //   value = parseInt(value);

  //   if (isNaN(value)) value = 0;
  //   if (value < 200) value = 0;
  //   if (value > target) value = target;

  //   setDonationAmount(value);
  // };
  // const handleInputChange = (e) => {
  //   let value = e.target.value;

  //   // Allow empty input
  //   if (value.trim() === "") {
  //     setDonationAmount(0); // show ₹ 0 in input
  //     setPercent(0);
  //     setError("Please enter donation amount");
  //     return;
  //   }

  //   // Remove non-numeric characters and parse to number
  //   const numericValue = parseInt(value.replace(/\D/g, ""), 10);

  //   if (isNaN(numericValue)) {
  //     setDonationAmount(0);
  //     setPercent(0);
  //     setError("Please enter donation amount");
  //     return;
  //   }

  //   if (numericValue < minAmount) {
  //     setDonationAmount(numericValue);
  //     setPercent((numericValue / target) * 100);
  //     setError(`Minimum donation amount is INR ${minAmount}`);
  //   } else {
  //     const clampedValue = Math.min(numericValue, target);
  //     setDonationAmount(clampedValue);
  //     setPercent((clampedValue / target) * 100);
  //     setError("");
  //   }
  // };
  // Inside your component
  // useEffect(() => {
  //   if (donationAmount > 0) {
  //     const newPercent = (donationAmount / target) * 100;
  //     setPercent(Math.min(newPercent, 100));
  //   }
  // }, [donationAmount]);

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Allow empty input
    if (value.trim() === "") {
      setDonationAmount(0); // show ₹ 0 in input
      setPercent(0);
      setError("Please enter donation amount");
      return;
    }

    // Remove non-numeric characters and parse to number
    const numericValue = parseInt(value.replace(/\D/g, ""), 10);

    if (isNaN(numericValue)) {
      setDonationAmount(0);
      setPercent(0);
      setError("Please enter donation amount");
      return;
    }

    if (numericValue < minAmount) {
      setDonationAmount(numericValue);
      setPercent((numericValue / target) * 100);
      setError(`Minimum donation amount is INR ${minAmount}`);
    } else {
      setDonationAmount(numericValue); // ❗ do NOT clamp
      const progress = Math.min((numericValue / target) * 100, 100); // ❗ cap progress bar at 100%
      setPercent(progress);
      setError("");
    }
  };

  // const handleSliderChange = (e) => {
  //   let value = parseInt(e.target.value);
  //   if (value < 200) value = 200;
  //   setDonationAmount(value);
  // };

  // const handleMouseMove = (e) => {
  //   if (isDragging && trackRef) {
  //     const rect = trackRef.getBoundingClientRect();
  //     const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  //     const percent = x / rect.width;
  //     const value = Math.round(percent * (target - minAmount) + minAmount);
  //     setDonationAmount(value);
  //   }
  // };

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false);
  };

  // const triggerRazorpay = (orderData, donationId) => {
  //   const options = {
  //     key: "rzp_live_qMGIKf7WORiiuM", // Add your Razorpay Key ID
  //     amount: calculateTotal(),
  //     currency: "INR",
  //     name: "Giveaze",
  //     description: "Donation Payment",
  //     order_id: orderData.id, // Razorpay Order ID
  //     handler: async function (response) {
  //       setShowLoader(true); // 🔄 Show loader while verifying
  //       try {
  //         // 3️⃣ Verify payment with backend
  //         const verifyResponse = await verifyPayment({
  //           transaction_id: response.razorpay_order_id,
  //           razorpay_payment_id: response.razorpay_payment_id,
  //           razorpay_signature: response.razorpay_signature,
  //           donation_campaign_id: donation_campaign_id,
  //           user_id: donationuser._id,
  //           amount: calculateTotal(),
  //           donorName: donationuser.full_name,
  //           email: donationuser.email,
  //         }).unwrap();
  //         if (verifyResponse.status) {
  //           setTimeout(() => {
  //             setShowLoader(false);
  //             setIsDonationModalVisible(false);
  //             // message.success(
  //             //   "Payment successful! Thank you for your donation."
  //             // );
  //           }, 3000);
  //           setShowThankYouModal(true);
  //         } else {
  //           setShowLoader(false);
  //           message.error("Payment verification failed.");
  //           setIsDonationModalVisible(false);
  //         }
  //       } catch (error) {
  //         setShowLoader(false);
  //         message.error(error.data?.error || "Payment verification failed.");
  //       }
  //     },
  //     prefill: {
  //       name: donationuser.full_name,
  //       email: donationuser.email,
  //       contact: donationuser.mobile_number,
  //     },
  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };
  //   const razorpayInstance = new window.Razorpay(options);

  //   razorpayInstance.open();
  // };
  const triggerRazorpay = (orderData, donationId) => {
    const options = {
      key: "rzp_live_qMGIKf7WORiiuM", // Razorpay Key ID (✅ use ENV in production)
      amount: orderData.amount, // Already in paise from backend
      currency: "INR",
      name: "Giveaze",
      description: "Donation Payment",
      order_id: orderData.id,

      handler: async function (response) {
        setShowLoader(true);

        try {
          const verifyResponse = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donation_id: donationId, // 🔑 Use donation_id for accurate lookup
          }).unwrap();

          if (verifyResponse.status) {
            setTimeout(() => {
              setShowLoader(false);
              setIsDonationModalVisible(false);
            }, 3000);
            setShowThankYouModal(true);
          } else {
            setShowLoader(false);
            message.error("Payment verification failed.");
            setIsDonationModalVisible(false);
          }
        } catch (error) {
          console.error("Verification Error:", error);
          setShowLoader(false);
          message.error(
            error?.data?.error || "Something went wrong during verification."
          );
        }
      },

      prefill: {
        name: donationuser?.full_name,
        email: donationuser?.email,
        contact: donationuser?.mobile_number,
      },

      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handleResendOtp = async () => {
    try {
      const response = await loginUser({
        name: userData.full_name,
        email: userData.email,
        mobile_number: userData.mobile_number,
      }).unwrap();

      message.success("OTP resent successfully.");
      setTimer(30); // Restart the timer after resend
    } catch (error) {
      message.error(error.data?.error || "Error resending OTP.");
    }
  };
  const handleOtpModalClose = () => {
    setOtpModalVisible(false);
    setTimer(0); // Reset timer to avoid blocking logic
  };

  return (
    <div>
      {showLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spin
            size="large"
            tip="Finalizing your donation..."
            style={{ fontSize: 18 }}
          />
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <ThankYouModal
          donorName={donationuser.full_name}
          amount={calculateTotal()}
          onClose={handleCloseThankYouModal}
          campaign_title={campaign_title}
        />
      )}

      {/* Donation Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="donation-modal"
        className="flex justify-center sm:items-center items-end"
      >
        <div className="relative bg-white w-full sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[250px]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-200"
          >
            <IoClose className="text-2xl" />
          </button>
          {!donationuser?.full_name ? (
            <>
              <h2 className="text-xl text-center font-semibold md:mb-6 mb-4">
                Your Information
              </h2>

              <div className="flex flex-col md:flex-row gap-2 w-full md:w-[600px] lg:w-[500px] mb-4">
                {/* Full Name Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="full_name"
                    className={`peer block w-full px-2 pb-1 pt-3 text-sm text-gray-900 bg-transparent rounded-lg border 
        ${infoErrors.full_name ? "border-red-500" : "border-[#545454]"} 
        focus:outline-none focus:ring-0 focus:border-[#7b7a7a]`}
                    value={userData.full_name}
                    onChange={(e) =>
                      setUserData1((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                  />
                  <label
                    htmlFor="full_name"
                    className={`absolute text-sm transition-all duration-300 left-[0.5rem] px-1 bg-white 
        ${
          infoErrors.full_name && !userData.full_name
            ? "text-red-500 -top-3 scale-75"
            : userData.full_name
            ? "-top-3 left-1 scale-75 text-[#7b7a7a]"
            : "top-3 scale-100 text-gray-500"
        }
        peer-focus:-top-3 peer-focus:scale-75 peer-focus:text-[#7b7a7a]
      `}
                  >
                    {infoErrors.full_name && !userData.full_name
                      ? infoErrors.full_name
                      : "Full Name"}
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative flex-1">
                  <input
                    type="email"
                    id="email"
                    className={`peer block w-full px-2 pb-1 pt-3 text-sm text-gray-900 bg-transparent rounded-lg border 
        ${infoErrors.email ? "border-red-500" : "border-[#545454]"} 
        focus:outline-none focus:ring-0 focus:border-[#7b7a7a]`}
                    value={userData.email}
                    onChange={(e) =>
                      setUserData1((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <label
                    htmlFor="email"
                    className={`absolute text-sm transition-all duration-300 left-[0.5rem] px-1 bg-white 
        ${
          infoErrors.email && !userData.email
            ? "text-red-500 -top-3 scale-75"
            : userData.email
            ? "-top-3 left-0.5 scale-75 text-[#7b7a7a]"
            : "top-3 scale-100 text-gray-500"
        }
        peer-focus:-top-3 peer-focus:scale-75 peer-focus:text-[#7b7a7a]
      `}
                  >
                    {infoErrors.email && !userData.email
                      ? infoErrors.email
                      : "Email"}
                  </label>
                </div>
              </div>
            </>
          ) : null}

          {/* <h3 className="text-lg text-center font-semibold mb-6">
            Select Donation Amount in INR
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4 relative">
            {[500, 1500, 3000].map((amount) => (
              <div key={amount} className="relative">
                {/* Show 'Popular' above the ₹1500 button */}
          {/*    {amount === 1500 && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ffdd04] text-black text-[10px] px-2 py-1 rounded">
                    Popular
                  </span>
                )}
                <button
                  className={`p-2 rounded-lg text-xs w-full ${
                    donationAmount === amount
                      ? "bg-[#ffdd04] text-black"
                      : "border border-[#8d7f24] text-[#8d7f24]"
                  }`}
                  onClick={() => handlePresetClick(amount)}
                >
                  ₹ {amount}
                </button>
              </div>
            ))}
          </div> */}

          <h3 className="text-lg text-center font-semibold mb-6">
            Select Donation Amount in INR
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-4 relative">
            {displayAmounts.map((amount) => (
              <div key={amount} className="relative">
                {popularAmount === amount && (
                  <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-black text-[10px] px-2 py-1 rounded">
                    Popular
                  </span>
                )}
                <button
                  className={`p-2 rounded-lg text-xs w-full ${
                    donationAmount === amount
                      ? "bg-[#ffdd04] text-black"
                      : "border border-[#8d7f24] text-[#8d7f24]"
                  }`}
                  onClick={() => handlePresetClick(amount)}
                >
                  ₹ {amount}
                </button>
              </div>
            ))}
          </div>

          <div className="relative w-full">
            {/* Input Field */}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full p-2 mb-2 border rounded-lg focus:outline-none ${
                error ? "border-red-500" : ""
              }`}
              placeholder="Other amount - ₹5 & more"
              value={`₹ ${donationAmount || 0}`}
              onChange={handleInputChange}
            />

            {/* Error Label (Only Shows When There's an Error) */}
            {error && (
              <label className="absolute -top-2 left-2 bg-white text-red-500 text-xs px-1">
                {error}
              </label>
            )}
          </div>
          {/* <div
            ref={trackRef}
            className="relative w-full h-2 bg-gray-200 rounded-full mt-3 mb-3"
          >
            <div
              className={`absolute top-0 left-0 h-2 rounded-full ${
                isDragging ? "" : "transition-all duration-200"
              }`}
              style={{
                width: `${Math.min(percent, 100)}%`,
                backgroundColor:
                  donationAmount >= target ? "#FFD700" : "#ff4757", // ✅ dynamic color
              }}
            ></div>

            <div
              className={`absolute cursor-pointer z-20 ${
                isDragging ? "" : "transition-all duration-200"
              }`}
              style={{
                left: `${Math.min(percent, 100)}%`, // ✅ prevent going outside
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div
                className={`w-7 h-7 bg-white border-2 ${
                  donationAmount >= target
                    ? "border-[#FFD700]"
                    : "border-[#ff4757]"
                } rounded-full flex items-center justify-center shadow`}
              >
                {/* heart-icon or keep empty */}
          {/* </div>
            </div> */}

          {/* <div
            ref={trackRef}
            className="relative w-full h-2 bg-gray-200 rounded-full mt-3 mb-3"
          >
            <div
              className={`absolute top-0 left-0 h-2 bg-[#ff4757] rounded-full ${
                isDragging ? "" : "transition-all duration-200"
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            ></div>

            <div
              className={`absolute cursor-pointer z-20 ${
                isDragging ? "" : "transition-all duration-200"
              }`}
              style={{
                left: `${percent}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div className="w-7 h-7 bg-white border-2 border-[#ff4757] rounded-full flex items-center justify-center shadow"> */}
          {/* <img
                  src="/images/heart-icon.svg"
                  alt="Heart"
                  className="w-4 h-4"
                  draggable={false}
                /> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div>
          <h3 className="text-base font-semibold text-center mb-3">
            Support Us
          </h3> */}
          {/* <div className="relative w-full"> */}
          {/* Main Input Field */}
          {/* <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 border rounded-lg text-xs focus:outline-none mb-3 bg-white text-left"
            >
              {isOtherSelected ? `₹${manualTip}` : `${supportPercent}%`}
            </button> */}

          {/* Dropdown Menu */}
          {/* {isDropdownOpen && (
              <ul className="absolute left-0 w-full bg-white border rounded-lg shadow-md p-2 mt-1 z-10">
                {[5, 10, 20].map((percent) => (
                  <li
                    key={percent}
                    className="p-2 text-xs hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSupportPercent(percent);
                      setIsOtherSelected(false);
                      setManualTip(0);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {percent}% - ₹
                    {((donationAmount * percent) / 100).toFixed(2)}
                  </li>
                ))} */}

          {/* Other Option with Input */}
          {/* <li className="p-2 text-xs hover:bg-gray-100 cursor-pointer flex items-center">
                  Other -
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="ml-2 border rounded p-1 text-xs w-16"
                    placeholder="₹0"
                    value={manualTip}
                    onChange={(e) => {
                      setManualTip(Number(e.target.value) || 0);
                      setSupportPercent("");
                      setIsOtherSelected(true);
                    }}
                    onBlur={() => {
                      if (manualTip > 0) {
                        setIsDropdownOpen(false);
                      } else {
                        setSupportPercent(5);
                        setIsOtherSelected(false);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </li>
              </ul>
            )} */}

          {/* Selected Tip Display */}
          {/* <h3 className="text-base font-semibold mb-3">
              Selected Tip:{" "}
              {isOtherSelected ? `₹${manualTip}` : `${supportPercent}%`}
            </h3> */}

          {/* Total Donation Display */}
          {/* <h3 className="text-base font-semibold mb-3">
              Total Donation: ₹ {calculateTotal()}
            </h3>
          </div> */}
          <div>
            <p className="text-sm mb-2">
              Are you an Indian Citizen? <sup>*</sup>
            </p>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="is_indian_national"
                  value="yes"
                  checked={citizenStatus === "yes"}
                  onChange={() => {
                    setCitizenStatus("yes");
                    setShowError(false);
                    setForeignError(false);
                  }}
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="is_indian_national"
                  value="no"
                  checked={citizenStatus === "no"}
                  onChange={() => {
                    setCitizenStatus("no");
                    setShowError(false);
                    setForeignError(true);
                  }}
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* Error Message (Prevents Stretching) */}
          <div className="relative h-0 mb-1">
            {foreignError && citizenStatus === "no" && (
              <p className="w-full text-red-500 text-xs text-start">
                Foreign donations are not allowed for this campaign.
              </p>
            )}
          </div>
          {/* Anonymous Donation */}
          <div className="flex items-start mt-4">
            <input
              type="checkbox"
              id="donateAnonymous"
              className="w-4 h-4 mt-1 text-[#8d7f24] border-gray-300 rounded focus:ring-[#8d7f24] shrink-0"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
            />
            <label
              htmlFor="donateAnonymous"
              className="ml-2 text-sm text-gray-700 leading-snug"
            >
              Donate Anonymously
            </label>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start mt-4">
            <input
              type="checkbox"
              id="agreeTerms"
              className="w-4 h-4 mt-1 text-[#8d7f24] border-gray-300 rounded focus:ring-[#8d7f24] shrink-0"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label
              htmlFor="agreeTerms"
              className="ml-2 text-[10px] text-gray-700 leading-snug"
            >
              By proceeding, you agree to Giveaze Foundation's
              <a
                href="/privacy-policy"
                className="text-[#8d7f24] underline ml-1"
              >
                Privacy Policy
              </a>{" "}
              and
              <a
                href="/terms-and-conditions"
                className="text-[#8d7f24] underline ml-1"
              >
                Terms & Conditions
              </a>
              , and receiving SMS/WhatsApp updates.
            </label>
          </div>

          <button
            className={`w-full py-3 mt-4 text-xl font-semibold text-white rounded-lg shadow-md transition-all duration-300 ${
              isChecked && citizenStatus == "yes"
                ? "bg-[#d8573e] hover:bg-[#a84430] hover:shadow-lg cursor-pointer"
                : "bg-[#d8573e] cursor-not-allowed opacity-50"
            }`}
            onClick={handleDonateNow}
          >
            Proceed to Pay ₹ {calculateTotal()}
          </button>
        </div>
      </Modal>

      {/* OTP Modal */}
      <Modal
        open={otpModalVisible}
        onClose={handleOtpModalClose}
        aria-labelledby="otp-modal"
        className="flex justify-center items-center"
      >
        <div className="p-6 bg-white rounded-lg shadow-lg w-[90%] sm:max-w-sm md:max-w-xs lg:max-w-[320px] flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
          <p className="text-sm mb-4 text-gray-600">
            Sent to +91{userData.mobile_number}
          </p>

          <input
            type="text"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            className="bg-[#ffdd04] text-black font-bold py-2 w-full rounded-lg mb-2"
            onClick={handleOtpSubmit}
          >
            VERIFY
          </button>

          {timer > 0 ? (
            <p className="text-xs text-gray-500">RESEND OTP ({timer}s)</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-xs text-[#8d7f24] font-medium"
            >
              RESEND OTP
            </button>
          )}

          <p className="text-[10px] text-gray-400 mt-3">
            *By continuing, I agree to the{" "}
            <a href="/terms" className="underline">
              Terms Of Use
            </a>
            and
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DonationForm;
