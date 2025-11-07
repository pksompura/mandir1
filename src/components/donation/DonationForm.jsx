import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "@mui/material";
import { IoChevronDown } from "react-icons/io5";

import { message } from "antd";
import {
  useLoginUserMutation,
  useVerifyOtpMutation,
  useUpdateUserMutation,
  useGuestLoginMutation,
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
import LoginModel from "../LoginModel";
import { flushSync } from "react-dom";

const DonationForm = ({
  open,
  handleClose,
  setIsDonationModalVisible,
  donation_campaign_id,
  donationuser,
  setDonationuser,
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
  const donationUser = user?.user || donationuser;
  const [isChecked, setIsChecked] = useState(false);
  const minAmount = Number(minimum_amount?.$numberDecimal);
  const target = Number(target_amount?.$numberDecimal);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [donationMobile, setDonationMobile] = useState(""); // mobile to pass

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false); // OTP modal visibility
  const [otp, setOtp] = useState(""); // OTP input
  const [total, setTotal] = useState();
  const [createOrder] = useCreateOrderMutation();
  const [guest, setGuest] = useState(null); // ✅ add this

  const [userData, setUserData1] = useState({
    full_name: donationUser?.full_name || "",
    email: donationUser?.email || "",
  });
  const [timer, setTimer] = useState(0);
  const [citizenStatus, setCitizenStatus] = useState("yes");
  const [showError, setShowError] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [percent, setPercent] = useState((minAmount / target) * 100);
  const [error, setError] = useState("");
  const [isCitizen, setIsCitizen] = useState(false); // ✅ add this

  // const [infoErrors, setInfoErrors] = useState({
  //   full_name: "",
  //   email: "",
  // });
  const [infoErrors, setInfoErrors] = useState({});
  const [foreignError, setForeignError] = useState(false);
  const [supportPercent, setSupportPercent] = useState(10); // Default 5%
  const [manualTip, setManualTip] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const dropdownRef = useRef(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [openInfo, setOpenInfo] = useState(false);

  // const processedAmounts = (donation_amounts || [])
  //   .map((item) => parseFloat(item?.$numberDecimal || 0))
  //   .filter((num) => !isNaN(num) && num > 0);

  // const uniqueSortedAmounts = [...new Set(processedAmounts)].sort(
  //   (a, b) => a - b
  // );
  // const fallbackAmounts = [500, 1500, 3000];
  // const displayAmounts =
  //   uniqueSortedAmounts.length > 0 ? uniqueSortedAmounts : fallbackAmounts;

  // const popularAmount =
  //   displayAmounts.length >= 3
  //     ? displayAmounts[Math.floor(displayAmounts.length / 2)]
  //     : null;

  // const defaultAmount =
  //   popularAmount || displayAmounts[displayAmounts.length - 1]; // Highest if less than 3

  const [donationAmount, setDonationAmount] = useState(donation_amounts);

  // Calculate tip amount

  // const tipAmount =
  //   isOtherSelected && manualTip > 0
  //     ? manualTip
  //     : (donationAmount * supportPercent) / 100;
  const tipAmount =
    isOtherSelected && manualTip !== "" && Number(manualTip) > 0
      ? Number(manualTip)
      : (Number(donationAmount || 0) * Number(supportPercent || 0)) / 100;
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

  // Display value in dropdown
  const displayValue = isOtherSelected
    ? `₹${manualTip || 0}`
    : `${supportPercent}% | ₹${(
        (donationAmount * (supportPercent || 0)) /
        100
      ).toFixed(2)}`;
  // // Display selected value in input
  // const displayValue =
  //   supportPercent === ""
  //     ? `₹${manualTip || 0}` // Custom tip shows INR amount
  //     : `${supportPercent}%`; // Selected percentage shows only %

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
  // const calculateTotal = () => {
  //   return (parseFloat(donationAmount) + parseFloat(tipAmount)).toFixed(2);
  // };
  // ✅ Ensure this function always returns a Number
  const calculateTotal = () => {
    const donation = Number(donationAmount) || 0;
    const tip = isOtherSelected
      ? Number(manualTip) || 0
      : (donation * (supportPercent || 10)) / 100;

    return donation + tip; // always a number
  };

  // ✅ Currency Formatter (for INR)
  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);

  const validateForm = () => {
    if (!citizenStatus) {
      setShowError(true);
      return false;
    }
    setShowError(false);
    return true;
  };

  // useEffect(() => {
  //   if (donationUser) {
  //     setUserData1({
  //       full_name: donationUser.full_name || "",
  //       email: donationUser.email || "",
  //     });
  //   }
  // }, [donationUser]);
  useEffect(() => {
    if (donationUser) {
      setUserData1({
        full_name: donationUser.full_name,
        email: donationUser.email,
        mobile: donationUser.mobile_number,
      });
    }
  }, [donationUser]);

  // const handleDonateNow = async () => {
  //   const errors = {};

  //   if (!isChecked) {
  //     message.error(
  //       "You must agree to the terms & conditions before proceeding."
  //     );
  //     return;
  //   }

  //   // Validate donation amount
  //   if (donationAmount < minAmount) {
  //     message.error(`Minimum donation amount is INR ${minAmount}`);
  //     return;
  //   }

  //   // Validate input fields
  //   if (!userData.full_name) errors.full_name = "Full Name is required";
  //   if (!userData.email) errors.email = "Email is required";

  //   // Check Citizenship
  //   if (citizenStatus !== "yes") {
  //     setShowError(true);
  //     message.error("Only Indian citizens are allowed to donate.");
  //     return;
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setInfoErrors(errors);
  //     return;
  //   }

  //   try {
  //     // ✅ If user is new, update details before proceeding
  //     await updateUser({
  //       mobile: donationUser?.mobile,
  //       full_name: userData.full_name,
  //       email: userData.email,
  //     });

  //     // ✅ Proceed with payment
  //     await initiatePayment();
  //   } catch (error) {
  //     message.error(error.data?.error || "Something went wrong.");
  //   }
  // };
  // const [guestLogin] = useGuestLoginMutation();

  // const ensureGuestSession = async (guestData) => {
  //   const token = localStorage.getItem("authToken");

  //   // only try guest login if not already logged in
  //   if (!token) {
  //     try {
  //       const response = await guestLogin(guestData).unwrap();

  //       if (response?.success) {
  //         // store token
  //         localStorage.setItem("authToken", response.token);

  //         // store in context / redux
  //         if (response.user.is_guest) {
  //           setGuest(response.user); // 👈 mark guest user in local state
  //         } else {
  //           setUserData(response.user); // 👈 for normal users
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Guest login failed:", err);
  //       throw new Error(err?.data?.message || "Guest login failed");
  //     }
  //   } else {
  //     // Optional: decode token and check guest flag
  //     try {
  //       const decoded = JSON.parse(atob(token.split(".")[1]));
  //       if (decoded.is_guest) {
  //         console.log("Already in guest session");
  //       }
  //     } catch (e) {
  //       console.warn("Invalid token found in localStorage:", e);
  //       localStorage.removeItem("authToken");
  //     }
  //   }
  // };

  // helper: build payload for createOrder
  const buildOrderPayload = () => {
    const payload = {
      donation_campaign_id, // your existing campaign id var
      amount: calculateTotal(), // keep as INR if backend multiplies by 100
      is_anonymous: isAnonymous,
    };

    if (donationUser?._id) {
      // logged in user
      payload.user_id = donationUser._id;
    } else {
      // guest donor - include identifying fields required for order/receipt
      payload.full_name = userData.full_name;
      payload.email = userData.email;
      payload.mobile_number = userData.mobile; // make sure this is the 10-digit string
      payload.is_guest = true; // optional flag useful for backend
    }

    return payload;
  };

  const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v || "").trim());

  const onlyDigits = (v = "") => String(v).replace(/\D/g, "");

  const handleDonateNow = async () => {
    // clear previous field errors to avoid stale blocks
    const errors = {};
    setInfoErrors({});

    // compute numeric donation amount safely
    const numericDonation =
      donationAmount === "other"
        ? Number.parseInt(customAmount, 10)
        : Number(donationAmount || popularAmount);

    // minimum amount check
    if (!Number.isFinite(numericDonation) || numericDonation < minAmount) {
      message.error(`Minimum donation amount is INR ${minAmount}`);
      return;
    }

    // field validations
    const fullName = (userData.full_name || "").trim();
    const email = (userData.email || "").trim();
    const cleanedMobile = onlyDigits(userData.mobile);

    if (!fullName) {
      errors.full_name = "Full Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address";
    }

    // mobile requirement: guest always; logged in only if not already saved
    const needsMobile = !donationUser || !donationUser.mobile_number;
    if (needsMobile && (!cleanedMobile || cleanedMobile.length !== 10)) {
      errors.mobile = "Enter a valid 10-digit mobile number";
    }

    // single checkbox for Indian citizen
    if (!isCitizen) {
      message.error("Only Indian citizens are allowed to donate.");
      return;
    }

    // push any errors into UI and stop
    if (Object.keys(errors).length > 0) {
      setInfoErrors(errors);
      return;
    }

    try {
      // update user profile if logged in
      if (donationUser?._id) {
        await updateUser({
          user_id: donationUser._id,
          full_name: fullName,
          email,
          mobile_number: cleanedMobile || donationUser.mobile_number,
          address: userData.address,
        }).unwrap?.();
      }

      // guest → OTP flow
      if (!donationUser) {
        setDonationMobile(cleanedMobile);
        setShowOtpModal(true);
        return;
      }

      // logged in → straight to payment
      await initiatePayment();
    } catch (err) {
      console.error("handleDonateNow error:", err);
      message.error(
        err?.data?.error || err?.data?.message || "Something went wrong."
      );
    }
  };

  // const isValidEmail = (v) =>
  //   /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v || "").trim());

  // const handleDonateNow = async () => {
  //   const errors = {};

  //   // must accept terms
  //   // if (!isChecked) {
  //   //   message.error(
  //   //     "You must agree to the terms & conditions before proceeding."
  //   //   );
  //   //   return;
  //   // }

  //   // compute numeric donation amount
  //   const numericDonation =
  //     donationAmount === "other"
  //       ? parseInt(customAmount, 10)
  //       : Number(donationAmount || popularAmount);

  //   // minimum amount check
  //   if (!numericDonation || numericDonation < minAmount) {
  //     message.error(`Minimum donation amount is INR ${minAmount}`);
  //     return;
  //   }

  //   // common validation
  //   if (!userData.full_name) errors.full_name = "Full Name is required";
  //   if (!userData.email || !userData.email.trim()) {
  //     errors.email = "Email is required";
  //   } else if (!isValidEmail(userData.email)) {
  //     errors.email = "Enter a valid email address";
  //   }
  //   // if (!userData.email) errors.email = "Email is required";

  //   // for guest donors, require mobile (10 digits)
  //   if (!donationUser) {
  //     if (!userData.mobile || userData.mobile.length !== 10) {
  //       errors.mobile = "Enter a valid 10-digit mobile number";
  //     }
  //   } else {
  //     // if logged-in user exists but mobile field is editable, still ensure it's present
  //     if (
  //       !donationUser.mobile_number &&
  //       (!userData.mobile || userData.mobile.length !== 10)
  //     ) {
  //       errors.mobile = "Enter a valid 10-digit mobile number";
  //     }
  //   }

  //   if (citizenStatus !== "yes") {
  //     setShowError(true);
  //     message.error("Only Indian citizens are allowed to donate.");
  //     return;
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setInfoErrors(errors);
  //     return;
  //   }
  //   try {
  //     // ✅ Update existing user if logged in
  //     if (donationUser?._id) {
  //       await updateUser({
  //         user_id: donationUser._id,
  //         full_name: userData.full_name,
  //         email: userData.email,
  //         mobile_number: userData.mobile,
  //         address: userData.address, // ✅ send address
  //       }).unwrap?.();
  //     }

  //     // ✅ If no user / guest, open LoginModel with prefilled mobile
  //     if (!donationUser) {
  //       setDonationMobile(userData.mobile); // Pass mobile to modal
  //       setShowOtpModal(true);
  //       return;
  //     }

  //     // ✅ If user is already logged in, proceed to payment immediately
  //     await initiatePayment();
  //   } catch (err) {
  //     console.error("handleDonateNow error:", err);
  //     message.error(
  //       err?.data?.error || err?.data?.message || "Something went wrong."
  //     );
  //   }
  // };

  // const handleDonateNow = async () => {
  //   const errors = {};

  //   // must accept terms
  //   if (!isChecked) {
  //     message.error(
  //       "You must agree to the terms & conditions before proceeding."
  //     );
  //     return;
  //   }

  //   // compute numeric donation amount
  //   const numericDonation =
  //     donationAmount === "other"
  //       ? parseInt(customAmount, 10)
  //       : Number(donationAmount || popularAmount);

  //   // minimum amount check
  //   if (!numericDonation || numericDonation < minAmount) {
  //     message.error(`Minimum donation amount is INR ${minAmount}`);
  //     return;
  //   }

  //   // common validation
  //   if (!userData.full_name) errors.full_name = "Full Name is required";
  //   if (!userData.email) errors.email = "Email is required";

  //   if (!donationUser) {
  //     // guest donors require mobile
  //     if (!userData.mobile || userData.mobile.length !== 10) {
  //       errors.mobile = "Enter a valid 10-digit mobile number";
  //     }
  //   } else {
  //     // logged-in user but mobile missing
  //     if (
  //       !donationUser.mobile_number &&
  //       (!userData.mobile || userData.mobile.length !== 10)
  //     ) {
  //       errors.mobile = "Enter a valid 10-digit mobile number";
  //     }
  //   }

  //   if (citizenStatus !== "yes") {
  //     setShowError(true);
  //     message.error("Only Indian citizens are allowed to donate.");
  //     return;
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setInfoErrors(errors);
  //     return;
  //   }

  //   try {
  //     // ✅ Step 1: Ensure guest session OR update existing user
  //     if (!donationUser?._id) {
  //       // await ensureGuestSession({
  //       //   full_name: userData.full_name,
  //       //   email: userData.email,
  //       //   mobile_number: userData.mobile,
  //       // });
  //       // } else {
  //       // update profile for logged-in user
  //       await updateUser({
  //         user_id: donationUser._id,
  //         full_name: userData.full_name,
  //         email: userData.email,
  //         mobile_number: userData.mobile || donationUser.mobile_number,
  //       }).unwrap?.();
  //     }

  //     // ✅ Step 2: Start payment
  //     await initiatePayment();
  //   } catch (err) {
  //     console.error("handleDonateNow error:", err);
  //     message.error(
  //       err?.data?.error || err?.data?.message || "Something went wrong."
  //     );
  //   }
  // };

  const handleOtpSubmit = async () => {
    if (otp.length === 6) {
      // Call the verify OTP API
      try {
        const response = await verifyOtp({
          mobile_number: donationUser.mobile_number,
          otp: otp,
        });

        // OTP verified successfully, log in the user
        message.success(response.data.message);
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

  // const initiatePayment = async () => {
  //   try {
  //     const orderResponse = await createOrder({
  //       user_id: donationUser?._id,
  //       donation_campaign_id, // Already a variable
  //       amount: calculateTotal(), // In INR (your backend should multiply by 100 for paise)
  //       is_anonymous: isAnonymous,
  //     }).unwrap();

  //     const { data: razorpayOrder, donation_id } = orderResponse;

  //     await triggerRazorpay(razorpayOrder, donation_id);
  //   } catch (error) {
  //     console.error("Create Order Error:", error);
  //     message.error(error?.data?.error || "Error creating payment order.");
  //   }
  // };
  // const initiatePayment = async () => {
  //   try {
  //     const payload = buildOrderPayload();

  //     // call createOrder with full payload (supports guest fields if needed)
  //     const orderResponse = await createOrder(payload).unwrap();

  //     // adjust to your createOrder response shape
  //     // commonly backend returns { data: razorpayOrder, donation_id: "..." }
  //     const { data: razorpayOrder, donation_id, donor_name } = orderResponse;
  //     setDonorName(
  //       donor_name ||
  //         userData?.full_name ||
  //         donationUser?.full_name ||
  //         "Anonymous Donor"
  //     );

  //     // launch Razorpay
  //     await triggerRazorpay(razorpayOrder, donation_id);
  //   } catch (err) {
  //     console.error("Create Order Error:", err);

  //     // show backend error message if available for debugging & UX
  //     const backendMessage =
  //       err?.data?.message ||
  //       err?.data?.error ||
  //       err?.message ||
  //       "Error creating payment order.";
  //     message.error(backendMessage);

  //     // helpful debug console
  //     // console.debug(err); // keep if you need more details
  //   }
  // };
  const initiatePayment = async () => {
    try {
      const payload = buildOrderPayload();

      // ensure donation amount is valid
      if (!payload.amount || isNaN(payload.amount) || payload.amount <= 0) {
        message.error("Invalid donation amount.");
        return;
      }

      // call createOrder with full payload (supports guest fields if needed)
      const orderResponse = await createOrder(payload).unwrap();

      // backend returns: { success, data: razorpayOrder, donation_id, donor_name, commission_amount, linked_account }
      const {
        data: razorpayOrder,
        donation_id,
        donor_name,
        commission_amount,
        linked_account,
      } = orderResponse;

      // set donor name for receipts/thank you page
      setDonorName(
        donor_name ||
          userData?.full_name ||
          donationUser?.full_name ||
          "Anonymous Donor"
      );

      // show commission info in UI (optional)
      // if (commission_amount && linked_account) {
      //   const commissionInRupees = (commission_amount / 100).toFixed(2);
      //   message.info(
      //     `1% of your donation (${commissionInRupees} ₹) will go to linked account.`
      //   );
      // }

      // launch Razorpay checkout
      await triggerRazorpay(
        razorpayOrder,
        donation_id,
        commission_amount,
        linked_account
      );
    } catch (err) {
      console.error("Create Order Error:", err);

      const backendMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Something went wrong while creating the payment order.";
      message.error(backendMessage);
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
  //           user_id: donationUser._id,
  //           amount: calculateTotal(),
  //           donorName: donationUser.full_name,
  //           email: donationUser.email,
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
  //       name: donationUser.full_name,
  //       email: donationUser.email,
  //       contact: donationUser.mobile_number,
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
            }, 10000);
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

      // prefill: {
      //   name: donationUser?.full_name,
      //   email: donationUser?.email,
      //   contact: donationUser?.mobile_number,
      // },
      prefill: {
        name: donationUser?.full_name || userData.full_name,
        email: donationUser?.email || userData.email,
        contact: donationUser?.mobile_number || userData.mobile,
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
          donorName={donorName || "Guest Donor"}
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
        className="flex justify-center sm:items-center items-end overflow-y-auto" // ✅ scroll whole modal
      >
        <div className="relative bg-white w-full sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[250px]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-200"
          >
            <IoClose className="text-2xl" />
          </button>
          <h3 className="text-base font-semibold text-center mb-3">
            Support Us
          </h3>
          {/* Tip Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            {/* <p className="text-sm text-gray-700 mb-3">
              By tipping{" "}
              <span className="font-semibold">Mysticpace Platform</span>, you
              support us to grow our impact and connect with more initiatives.
              Thank you 🙏.
            </p> */}
            {/* <p className="text-sm text-gray-700 mb-3">
              Your tip helps{" "}
              <span className="font-semibold">Mysticpace Platform </span>
              sustain operations and reach more people in need. Every
              contribution makes a difference 🌍.
            </p> */}
            {/* <p className="text-sm text-gray-700 mb-3">
              {/* By adding a small tip to your donation, you support{" "}
              <span className="font-semibold">Mysticpace Platform</span> in
              keeping our platform free and empowering more meaningful causes.
              Together, we can create bigger change 💖. */}
            {/* Tips directly support our operational costs, platform maintenance,
              and efforts to enhance user experience.
            </p> */}
            <p className="text-sm text-gray-700 mb-3">
              Tips directly support our operational costs, platform maintenance,
              and efforts to enhance user experience.{" "}
              <button
                onClick={() => setOpenInfo(true)}
                className="text-xs text-[#d8573e] hover:text-red-600 ml-1"
              >
                Know More
              </button>
            </p>

            {/* Know More Modal */}
            {openInfo && (
              <div
                className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end sm:items-center z-50"
                onClick={() => setOpenInfo(false)} // close when clicking backdrop
              >
                <div
                  onClick={(e) => e.stopPropagation()} // prevent close on content click
                  className="relative bg-white w-full sm:w-[400px] md:w-[500px] p-6 
             rounded-t-lg sm:rounded-lg shadow-lg 
             animate-slideUp"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setOpenInfo(false)}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-200"
                  >
                    <IoClose className="text-2xl" />
                  </button>

                  {/* Modal Content */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Why We Ask for Tips
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Tips contribute to the platform’s operational sustainability
                    by supporting essential functions such as technology
                    maintenance, platform security, and seamless donation
                    processing. By collecting tips separately, we ensure that
                    100% of every donation reaches the intended beneficiary
                    without any deductions.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    Tipping is entirely voluntary and serves as a gesture of
                    appreciation for our continued efforts toward transparency,
                    due diligence, and efficient campaign management.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    Please note that tips are voluntary contributions and are
                    not eligible for tax deductions.
                  </p>

                  {/* Close Action */}
                  <div className="mt-5 text-right">
                    <button
                      onClick={() => setOpenInfo(false)}
                      className="px-4 py-2 bg-[#d8573e] text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Donation Summary */}
            <div className="space-y-0.5">
              {/* Row 1: Donation */}
              <div className="flex justify-between items-center pb-1">
                <p className="text-sm font-medium text-gray-600">
                  Donation Amount
                </p>
                <p className="text-sm text-gray-900">
                  ₹{donationAmount.toFixed(2)}
                </p>
              </div>

              {/* Row 2: Tip */}
              <div className="flex justify-between items-center pb-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">
                    Tip Amount
                  </p>

                  {/* Dropdown - beside label */}
                  <div className="relative w-36 sm:w-40" ref={dropdownRef}>
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex w-full items-center justify-between gap-2 px-2 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700"
                    >
                      <span>
                        {isOtherSelected
                          ? `₹${manualTip || 0}`
                          : `${supportPercent || 10}%`}
                      </span>
                      <IoChevronDown
                        className={`shrink-0 text-gray-500 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isDropdownOpen && (
                      <ul
                        role="listbox"
                        tabIndex={-1}
                        className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-20"
                      >
                        {tipOptions.map((percent) => (
                          <li
                            key={percent}
                            role="option"
                            aria-selected={percent === supportPercent}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex justify-between"
                            onClick={() => {
                              setSupportPercent(percent);
                              setIsOtherSelected(false);
                              setManualTip(0);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span>{percent}%</span>
                            <span>
                              ₹{((donationAmount * percent) / 100).toFixed(2)}
                            </span>
                          </li>
                        ))}

                        {/* Other Option */}
                        <li className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100">
                          Other:
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter ₹"
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            value={manualTip}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setManualTip(val);
                              setSupportPercent("");
                              setIsOtherSelected(true);
                            }}
                            onBlur={handleCustomBlur}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* Amount aligned right */}
                <p className="text-sm text-gray-900">₹{tipAmount.toFixed(2)}</p>
              </div>

              {/* Row 3: Total */}
              <div className="flex justify-between items-center">
                <p className="text-base font-semibold text-[#d8573e]">
                  Total Amount
                </p>
                <p className="text-md text-[#d8573e]">
                  ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="relative w-full">
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
          {!donationUser?.full_name ? (
            <>
              <div className="flex flex-col gap-3 w-full md:w-[600px] lg:w-[500px] mb-4">
                {/* Full Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    id="full_name"
                    className={`peer block w-full px-3 py-2.5 text-sm text-gray-900 bg-transparent rounded-lg border 
        ${infoErrors.full_name ? "border-red-500" : "border-gray-400"} 
        focus:outline-none focus:ring-1 focus:ring-[#d8573e]`}
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
                    className={`absolute text-sm transition-all duration-300 left-3 px-1 bg-white 
        ${
          infoErrors.full_name && !userData.full_name
            ? "text-red-500 -top-2 scale-75"
            : userData.full_name
            ? "-top-2 scale-75 text-gray-500"
            : "top-2.5 text-gray-400"
        }
        peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-[#d8573e]`}
                  >
                    {infoErrors.full_name && !userData.full_name
                      ? infoErrors.full_name
                      : "Full Name *"}
                  </label>
                </div>

                {/* Anonymous Donation */}
                <div className="flex items-center ml-[2px] -mt-1">
                  <input
                    type="checkbox"
                    id="donateAnonymous"
                    className="w-3.5 h-3.5 text-[#8d7f24] border-gray-300 rounded focus:ring-[#8d7f24] cursor-pointer"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                  />
                  <label
                    htmlFor="donateAnonymous"
                    className="ml-2 text-xs text-gray-700 cursor-pointer"
                  >
                    Donate Anonymously
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={`peer block w-full px-3 py-3 text-sm text-gray-900 bg-transparent rounded-lg border 
          ${infoErrors.email ? "border-red-500" : "border-gray-400"} 
          focus:outline-none focus:ring-1 focus:ring-[#d8573e]`}
                    value={userData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserData1((prev) => ({ ...prev, email: value }));

                      // 🔹 Email validation regex
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (value && !emailRegex.test(value)) {
                        setInfoErrors((prev) => ({
                          ...prev,
                          email: "Enter a valid email address",
                        }));
                      } else {
                        setInfoErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                  />
                  <label
                    htmlFor="email"
                    className={`absolute text-sm transition-all duration-300 left-3 px-1 bg-white 
          ${
            infoErrors.email && !userData.email
              ? "text-red-500 -top-2 scale-75"
              : userData.email
              ? "-top-2 scale-75 text-gray-500"
              : "top-3 text-gray-400"
          }
          peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-[#d8573e]`}
                  >
                    {infoErrors.email && !userData.email
                      ? infoErrors.email
                      : "Email *"}
                  </label>
                </div>
              </div>

              {/* Mobile Number Input */}
              <div className="w-full md:w-[600px] lg:w-[500px] mb-4">
                <div className="relative">
                  {/* +91 Prefix */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
                    +91
                  </span>

                  <input
                    type="tel"
                    id="mobile"
                    maxLength="10"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    className={`peer block w-full pl-12 px-3 py-3 text-sm text-gray-900 bg-transparent rounded-lg border 
      ${infoErrors.mobile ? "border-red-500" : "border-gray-400"} 
      focus:outline-none focus:ring-1 focus:ring-[#d8573e]`}
                    value={userData.mobile}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      if (onlyNums.length <= 10) {
                        setUserData1((prev) => ({ ...prev, mobile: onlyNums }));

                        if (onlyNums.length > 0 && onlyNums.length < 10) {
                          setInfoErrors((prev) => ({
                            ...prev,
                            mobile: "Enter a valid 10-digit mobile number",
                          }));
                        } else {
                          setInfoErrors((prev) => ({ ...prev, mobile: "" }));
                        }
                      }
                    }}
                  />

                  {/* Floating Label — perfectly aligned with others */}
                  <label
                    htmlFor="mobile"
                    className={`absolute text-sm transition-all duration-300 left-3 px-1 bg-white 
      ${
        infoErrors.mobile && !userData.mobile
          ? "text-red-500 -top-2 scale-75"
          : userData.mobile
          ? "-top-2 scale-75 text-gray-500"
          : "top-3 text-gray-400"
      }
      peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-[#d8573e]`}
                  >
                    {infoErrors.mobile && !userData.mobile
                      ? infoErrors.mobile
                      : "Mobile Number *"}
                  </label>
                </div>

                {/* Fixed space for error message */}
                <div className="min-h-[20px] mt-1">
                  {infoErrors.mobile && (
                    <p className="text-xs text-red-500">{infoErrors.mobile}</p>
                  )}
                </div>

                {/* Address Input (Optional) */}
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    className="peer block w-full px-3 py-3 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#d8573e]"
                    value={userData.address || ""}
                    onChange={(e) =>
                      setUserData1((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                  <label
                    htmlFor="address"
                    className={`absolute text-sm transition-all duration-300 left-3 px-1 bg-white 
          ${
            userData.address
              ? "-top-2 scale-75 text-gray-500"
              : "top-3 text-gray-400"
          }
          peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-[#d8573e]`}
                  >
                    Billing Address <span className="text-gray-400"></span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* Logged-in donor → show only Anonymous Donation */
            <div className="flex items-center ml-[2px] mb-3">
              <input
                type="checkbox"
                id="donateAnonymous"
                className="w-3.5 h-3.5 text-[#8d7f24] border-gray-300 rounded focus:ring-[#8d7f24] cursor-pointer"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <label
                htmlFor="donateAnonymous"
                className="ml-2 text-xs text-gray-700 cursor-pointer"
              >
                Donate Anonymously
              </label>
            </div>
          )}

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

          {/* <h3 className="text-lg text-center font-semibold mb-6">
            Select Donation Amount in INR
          </h3> */}
          {/* 
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
          {/* <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full p-2 mb-2 border rounded-lg focus:outline-none ${
                error ? "border-red-500" : ""
              }`}
              placeholder="Other amount - ₹5 & more"
              value={`₹ ${donationAmount || 0}`}
              onChange={handleInputChange}
            /> */}

          {/* Error Label (Only Shows When There's an Error) */}
          {/* {error && ( *
              <label className="absolute -top-2 left-2 bg-white text-red-500 text-xs px-1">
                {error}
              </label>
            )}
          </div> */}
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

          {/* Indian Citizenship Confirmation */}
          <div className="flex items-start ml-[2px]">
            <input
              type="checkbox"
              id="confirmCitizen"
              className="w-3.5 h-3.5 mt-0.5 text-[#8d7f24] border-gray-300 rounded focus:ring-[#8d7f24] shrink-0 cursor-pointer"
              checked={isCitizen}
              onChange={() => setIsCitizen(!isCitizen)}
            />
            <label
              htmlFor="confirmCitizen"
              className="ml-2 text-[11px] text-gray-700 leading-snug cursor-pointer"
            >
              By continuing, I confirm that I am an{" "}
              <span className="font-semibold">Indian citizen</span>, agree to
              the{" "}
              <a href="/terms" className="text-[#8d7f24] underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-[#8d7f24] underline">
                Privacy Policy
              </a>
              , and consent to receive updates via SMS and WhatsApp.
            </label>
          </div>

          {/* Proceed Button */}
          <button
            className={`w-full py-3 mt-4 text-xl font-semibold text-white rounded-lg shadow-md transition-all duration-300 ${
              isCitizen
                ? "bg-[#d8573e] hover:bg-[#a84430] hover:shadow-lg cursor-pointer"
                : "bg-[#d8573e] cursor-not-allowed opacity-50"
            }`}
            onClick={handleDonateNow}
            disabled={!isCitizen}
          >
            Continue to pay ₹ {calculateTotal()}
          </button>
        </div>
      </Modal>
      <LoginModel
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        prefilledMobile={donationMobile}
        setDonationuser={setDonationuser}
        onOtpVerified={(user) => {
          dispatch(setUserData(user));
          initiatePayment();
        }}
      />

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
