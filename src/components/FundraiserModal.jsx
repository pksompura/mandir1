import React, { useState } from "react";
import { Modal } from "antd";
import { useSentOtpMutation } from "../redux/services/campaignApi";

export default function FundraiserModal({ open, onClose, openLogin }) {
  const [formData, setFormData] = useState({
    purpose: "Medical Treatment",
    name: "",
    email: "",
    password: "",
    mobile: "",
    ngoName: "",
    registrationNumber: "",
  });
  const [error, setError] = useState("");
  const [sendOtp, { isLoading: sendOtpLoading, isSuccess, reset }] =
    useSentOtpMutation();

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "mobile") {
      value = value.replace(/\D/g, ""); // only digits
      if (value.length > 10) return;
    }
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.mobile || formData.mobile.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      // ✅ Send OTP once
      await sendOtp({
        mobile_number: formData.mobile,
        purpose: formData.purpose,
        name: formData.name,
        email: formData.email,
        ngoName: formData.ngoName,
      }).unwrap();

      // ✅ Close register → open login modal at OTP step
      handleClose();
      openLogin(formData.mobile, true); // pass raw 10 digit number
    } catch (err) {
      console.error("OTP error:", err);
      setError(err?.data?.error || "Failed to send OTP");
    }
  };

  const handleClose = () => {
    setFormData({
      purpose: "Medical Treatment",
      name: "",
      email: "",
      password: "",
      mobile: "",
      ngoName: "",
      registrationNumber: "",
    });
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={450}
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Start your Fundraiser
      </h2>

      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      <form onSubmit={handleRegisterSubmit} className="space-y-3">
        <label className="block">
          <span className="text-gray-700">Purpose of raising funds</span>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option>Medical Treatment</option>
            <option>NGO / Charity</option>
            <option>Other Cause</option>
          </select>
        </label>

        <label className="block">
          <span>Name *</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        <label className="block">
          <span>Email *</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </label>
        {/* 
        <label className="block">
          <span>Create a Password *</span>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </label> */}

        {/* ✅ Mobile input with +91 prefix */}
        <label className="block">
          <span>Mobile *</span>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <span className="text-gray-500 font-medium mr-2">+91</span>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              maxLength={10}
              className="w-full outline-none bg-transparent"
              placeholder="Enter 10-digit mobile number"
            />
          </div>
        </label>

        {formData.purpose === "NGO / Charity" && (
          <>
            <label className="block">
              <span>NGO / Organization Name *</span>
              <input
                name="ngoName"
                value={formData.ngoName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>

            <label className="block">
              <span>Registration Number</span>
              <input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </>
        )}

        <div className="flex justify-center text-sm text-gray-600 mt-3">
          <span>
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => {
                handleClose();
                openLogin(); // opens donor login
              }}
            >
              Login
            </button>
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black py-2 rounded-md mt-3 font-semibold hover:bg-yellow-500 transition"
        >
          {sendOtpLoading ? "Sending OTP..." : "Start Fundraising"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Are you an NGO?{" "}
        <a
          href="/ngo-apply"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Apply here
        </a>
      </p>
    </Modal>
  );
}
