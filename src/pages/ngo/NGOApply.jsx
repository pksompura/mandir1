import React from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Steps,
  Checkbox,
  message,
  ConfigProvider,
  Row,
  Col,
  Grid,
} from "antd";
import { useApplyOrgMutation } from "../../redux/services/ngoApi";
import { useNavigate } from "react-router-dom";
import LoginModel from "../../components/LoginModel"; // ✅ Using your OTP Login modal

const { Step } = Steps;
const { Option } = Select;
const { useBreakpoint } = Grid;

const steps = [
  "Non-Profit Details",
  "Primary Contact",
  "Certifications",
  "Org Profile",
];

export default function NGOApply({ onSuccess }) {
  const [form] = Form.useForm();
  const [current, setCurrent] = React.useState(0);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();

  const [applyOrg, { isLoading }] = useApplyOrgMutation();

  // ✅ State for login modal
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [prefilledMobile, setPrefilledMobile] = React.useState("");
  const [pendingPayload, setPendingPayload] = React.useState(null);

  const next = async () => {
    try {
      await form.validateFields();
      setCurrent((c) => c + 1);
    } catch {}
  };

  const prev = () => setCurrent((c) => c - 1);
  // ✅ Actual submit logic (after OTP verify)
  const doSubmit = async () => {
    try {
      // Use the saved data from before OTP verification
      const v = pendingPayload || form.getFieldsValue(true);

      const payload = {
        registrationType: v.registrationType,
        name: v.name,
        registeredAddress: v.registeredAddress,
        causes: v.causes,
        founders:
          v.founders?.map((n, i) => ({
            name: n,
            linkedinUrl: v.founderLinks?.[i] || "",
          })) || [],
        primaryContact: {
          name: v.pc_name,
          phone: v.pc_phone,
          email: v.pc_email,
          role: v.pc_role,
        },
        has80G: v.has80G || false,
        hasFCRA: v.hasFCRA || false,
        profile: {
          website: v.website,
          lastFYBudgetBand: v.lastFYBudgetBand,
          donorBaseBand: v.donorBaseBand,
          employeeCountBand: v.employeeCountBand,
          crowdfundedBefore: v.crowdfundedBefore || false,
          planToCreateIn: v.planToCreateIn,
        },
      };

      console.log("✅ Final Payload Sent to Backend:", payload);

      const res = await applyOrg(payload).unwrap();
      const newOrgId = res?.data?._id || res?.data?.id;
      message.success("Application submitted!");

      if (newOrgId) navigate(`/ngo/dashboard/${newOrgId}`);
      else navigate(`/ngo/dashboard`);

      onSuccess?.(newOrgId);
    } catch (e) {
      console.error("❌ Failed to submit NGO:", e);
      message.error(e?.data?.message || "Failed to submit");
    }
  };

  // ✅ Main submit → open OTP modal
  const submit = async () => {
    try {
      // Get all fields from all steps
      const allValues = form.getFieldsValue(true);

      // Validate everything — this ensures required rules trigger
      await form.validateFields();

      if (!allValues.pc_phone || String(allValues.pc_phone).length !== 10) {
        message.error("Please enter a valid 10-digit Primary Contact Phone.");
        setCurrent(1);
        return;
      }

      console.log("✅ Full Form Data Before OTP:", allValues);

      // Store the complete form data for submission after OTP verification
      setPendingPayload(allValues);
      setPrefilledMobile(allValues.pc_phone);

      // Open OTP modal
      setLoginOpen(true);
    } catch (err) {
      message.error("Please fill all required fields before submitting.");
    }
  };

  // ✅ On OTP verified from modal
  const handleOtpVerified = async () => {
    setLoginOpen(false);
    await doSubmit();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d8573e",
          colorTextLightSolid: "#ffffff",
        },
        components: {
          Button: {
            colorPrimaryHover: "#c34932",
            colorPrimaryActive: "#b3412d",
          },
          Steps: {
            colorPrimary: "#d8573e",
          },
        },
      }}
    >
      {/* ✅ Keep your step colors */}
      <style>{`
        .ant-steps .ant-steps-item-icon {
          background-color: #545454 !important;
          border-color: #545454 !important;
        }
        .ant-steps .ant-steps-item-icon > .ant-steps-icon {
          color: #ffffff !important;
        }
        @media (max-width: 767px) {
          .mobile-steps-row .ant-steps.ant-steps-horizontal {
            display: inline-flex !important;
            flex-wrap: nowrap !important;
            width: auto !important;
          }
          .mobile-steps-row .ant-steps-horizontal .ant-steps-item {
            flex: 0 0 auto !important;
            padding-inline: 8px !important;
          }
          .mobile-steps-row .ant-steps-item-title {
            font-size: 12px !important;
            white-space: nowrap !important;
          }
          .mobile-steps-row .ant-steps-item-icon {
            width: 24px !important;
            height: 24px !important;
            line-height: 24px !important;
            font-size: 12px !important;
          }
        }
        .mobile-steps-row {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 6px;
          margin-bottom: 20px;
          white-space: nowrap;
        }
        .mobile-steps-row::-webkit-scrollbar { display: none; }
        .mobile-steps-row { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="mx-auto mt-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
        style={{ maxWidth: 960 }}
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
          NGO Application
        </h2>

        <div className={isMobile ? "mobile-steps-row" : ""}>
          <Steps
            current={current}
            direction="horizontal"
            labelPlacement={isMobile ? "horizontal" : "vertical"}
            size={isMobile ? "small" : "default"}
          >
            {steps.map((s) => (
              <Step key={s} title={s} />
            ))}
          </Steps>
        </div>

        <Form form={form} layout="vertical">
          {/* STEP 0 */}
          {current === 0 && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Is your organisation a registered Non-Profit?"
                  name="registrationType"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select registration type">
                    <Option value="TRUST">Trust</Option>
                    <Option value="SOCIETY">Society</Option>
                    <Option value="SECTION8">Section 8 Company</Option>
                    <Option value="NONE">
                      No (apply as individual instead)
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Name of the Organization"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Cause Supported (Main Area of Work)"
                  name="causes"
                  rules={[{ required: true }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Choose causes"
                    maxTagCount="responsive"
                  >
                    {[
                      "Children",
                      "Education",
                      "Women & Girls",
                      "Medical",
                      "Sports",
                      "Animals",
                      "Senior Citizens",
                      "Disability",
                      "Environment",
                      "Disaster Relief",
                      "Rural Development",
                      "Community Development",
                      "Arts, Music & Culture",
                      "Food & Hunger",
                      "LGBT",
                      "Soldiers",
                      "Skill Development",
                      "Healthcare",
                    ].map((c) => (
                      <Option key={c} value={c}>
                        {c}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Organization's Registered Address"
                  name="registeredAddress"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.List name="founders">
                  {(fields, { add, remove }) => (
                    <>
                      <div className="font-medium mb-2">Founder’s Name(s)</div>
                      {fields.map((f, idx) => (
                        <Row
                          gutter={[16, 16]}
                          key={f.key}
                          align="middle"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Col xs={24} md={11}>
                            <Form.Item
                              {...f}
                              name={[f.name]}
                              rules={[
                                {
                                  required: true,
                                  message: "Enter founder name",
                                },
                              ]}
                            >
                              <Input placeholder="Founder name" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={11}>
                            <Form.Item name={["founderLinks", idx]}>
                              <Input placeholder="Founder LinkedIn URL (optional)" />
                            </Form.Item>
                          </Col>
                          {/* ✅ Proper alignment in desktop */}
                          <Col
                            xs={24}
                            md={2}
                            style={{
                              textAlign: isMobile ? "left" : "right",
                              marginTop: isMobile ? 0 : 5,
                            }}
                          >
                            <Button
                              danger
                              onClick={() => remove(f.name)}
                              block={isMobile}
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        onClick={() => add()}
                        type="dashed"
                        block={isMobile}
                      >
                        + Add Founder
                      </Button>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
          )}

          {/* STEP 1 */}
          {current === 1 && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Primary Contact Name"
                  name="pc_name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name="pc_phone"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="10-digit mobile" maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email ID"
                  name="pc_email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Designation/Role in the Organization"
                  name="pc_role"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* STEP 2 */}
          {current === 2 && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Does your organization have 80G certification?"
                  name="has80G"
                  valuePropName="checked"
                >
                  <Checkbox>Yes</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Does your organization have FCRA certification?"
                  name="hasFCRA"
                  valuePropName="checked"
                >
                  <Checkbox>Yes</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* STEP 3 */}
          {current === 3 && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Website URL"
                  name="website"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="https://example.org" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Last Financial Year's Budget"
                  name="lastFYBudgetBand"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="0_25L">0 to 25 Lacs</Option>
                    <Option value="25L_1CR">25 Lacs to 1 Cr</Option>
                    <Option value="GT_1CR">More than 1 Cr</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Total Donor Database Strength"
                  name="donorBaseBand"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="0_100">0 to 100</Option>
                    <Option value="100_500">100 to 500</Option>
                    <Option value="GT_500">More than 500</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Total employee strength"
                  name="employeeCountBand"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="0_25">0 to 25</Option>
                    <Option value="25_100">25 to 100</Option>
                    <Option value="GT_100">More than 100</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="crowdfundedBefore"
                  valuePropName="checked"
                  className="mt-1"
                >
                  <Checkbox>We have crowdfunded before</Checkbox>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="How soon will you create a fundraising campaign?"
                  name="planToCreateIn"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="3_5">3 to 5 Days</Option>
                    <Option value="8_10">8 to 10 Days</Option>
                    <Option value="GT_15">More than 15 Days</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>

        {/* Navigation */}
        <div
          className={`mt-6 flex ${
            isMobile ? "flex-col gap-3" : "flex-row gap-2"
          } justify-between`}
        >
          <Button disabled={current === 0} onClick={prev} block={isMobile}>
            Back
          </Button>
          {current < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={next}
              className="!text-white"
              block={isMobile}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              loading={isLoading}
              onClick={submit}
              className="!text-white"
              block={isMobile}
            >
              Submit
            </Button>
          )}
        </div>
      </div>

      {/* ✅ OTP Login modal (instead of inline OTP) */}
      <LoginModel
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        prefilledMobile={prefilledMobile}
        onOtpVerified={handleOtpVerified}
      />
    </ConfigProvider>
  );
}
