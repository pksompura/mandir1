import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Steps,
  Input,
  Upload,
  Checkbox,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { TextArea } = Input;

export default function FundraiserKycModal({
  open,
  onClose,
  user,
  onKycSubmitted,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const steps = [
    { title: "Personal ID", key: "personal" },
    {
      title:
        user?.purpose === "NGO / Charity" ? "NGO Details" : "Cause Details",
      key: "details",
    },
    { title: "Legal Agreements", key: "legal" },
    { title: "Finalize", key: "final" },
  ];

  useEffect(() => {
    if (!user) return;
    setCurrentStep(0);
    setFormData({});
  }, [open, user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError("");
    // Optional: Add per-step validation here
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = () => {
    setError("");
    // Validate all required fields here
    if (onKycSubmitted) onKycSubmitted(formData);
    onClose();
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      style={{ maxWidth: "95%" }}
      maskClosable={false}
    >
      <h2 className="text-xl font-semibold text-center mb-4">Complete KYC</h2>

      <Steps current={currentStep} size="small" className="mb-6">
        {steps.map((s) => (
          <Step key={s.key} title={s.title} />
        ))}
      </Steps>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Step 0: Personal ID */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <label>
            Full Name *
            <Input
              value={formData.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </label>
          <label>
            Aadhaar / ID Proof *
            <Upload
              beforeUpload={(file) => {
                handleInputChange("aadhaar", file);
                return false;
              }}
              fileList={formData.aadhaar ? [formData.aadhaar] : []}
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </label>
        </div>
      )}

      {/* Step 1: NGO Details */}
      {currentStep === 1 && user?.purpose === "NGO / Charity" && (
        <div className="space-y-4">
          <label>
            NGO / Organization Name *
            <Input
              value={formData.ngoName || ""}
              onChange={(e) => handleInputChange("ngoName", e.target.value)}
            />
          </label>
          <label>
            NGO Registration Number *
            <Input
              value={formData.registrationNumber || ""}
              onChange={(e) =>
                handleInputChange("registrationNumber", e.target.value)
              }
            />
          </label>
          <label>
            PAN / Tax ID *
            <Input
              value={formData.panNumber || ""}
              onChange={(e) => handleInputChange("panNumber", e.target.value)}
            />
          </label>
          <label>
            12A Certificate *
            <Upload
              beforeUpload={(file) => {
                handleInputChange("certificate12A", file);
                return false;
              }}
              fileList={
                formData.certificate12A ? [formData.certificate12A] : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload 12A Certificate</Button>
            </Upload>
          </label>
          <label>
            80G Certificate *
            <Upload
              beforeUpload={(file) => {
                handleInputChange("certificate80G", file);
                return false;
              }}
              fileList={
                formData.certificate80G ? [formData.certificate80G] : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload 80G Certificate</Button>
            </Upload>
          </label>
          <label>
            FCRA Certificate (if foreign donations allowed)
            <Upload
              beforeUpload={(file) => {
                handleInputChange("fcraCertificate", file);
                return false;
              }}
              fileList={
                formData.fcraCertificate ? [formData.fcraCertificate] : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload FCRA Certificate</Button>
            </Upload>
          </label>
          <label>
            Cancelled Cheque (NGO Bank Account) *
            <Upload
              beforeUpload={(file) => {
                handleInputChange("cancelledCheque", file);
                return false;
              }}
              fileList={
                formData.cancelledCheque ? [formData.cancelledCheque] : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload Cheque</Button>
            </Upload>
          </label>
          <label>
            Authorized Signatory PAN *
            <Input
              value={formData.signatoryPan || ""}
              onChange={(e) =>
                handleInputChange("signatoryPan", e.target.value)
              }
            />
          </label>
          <label>
            Authorized Signatory Aadhaar *
            <Upload
              beforeUpload={(file) => {
                handleInputChange("signatoryAadhaar", file);
                return false;
              }}
              fileList={
                formData.signatoryAadhaar ? [formData.signatoryAadhaar] : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload Aadhaar</Button>
            </Upload>
          </label>
        </div>
      )}

      {/* Step 1: Other Cause */}
      {currentStep === 1 && user?.purpose !== "NGO / Charity" && (
        <div className="space-y-4">
          <label>
            Describe Your Cause *
            <TextArea
              rows={4}
              value={formData.causeDetails || ""}
              onChange={(e) =>
                handleInputChange("causeDetails", e.target.value)
              }
            />
          </label>
        </div>
      )}

      {/* Step 2: Legal Agreements */}
      {currentStep === 2 && (
        <div className="space-y-3">
          <Checkbox
            checked={formData.agreeTerms || false}
            onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
          >
            I agree to the{" "}
            <a href="/terms" target="_blank">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank">
              Privacy Policy
            </a>{" "}
            *
          </Checkbox>
        </div>
      )}

      {/* Step 3: Finalize */}
      {currentStep === 3 && (
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Review all your data and submit KYC
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="primary" onClick={handleSubmit}>
            Submit KYC
          </Button>
        )}
      </div>
    </Modal>
  );
}
