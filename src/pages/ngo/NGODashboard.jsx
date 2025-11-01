import React, { useMemo, useState } from "react";
import {
  Card,
  Button,
  Upload,
  message,
  List,
  Tag,
  Input,
  ConfigProvider,
  Spin,
  Modal,
  Image,
} from "antd";
import { useParams } from "react-router-dom";
import {
  useGetOrgApplicationQuery,
  useUploadKycMutation,
  useTicketMessageMutation,
  useGetPayoutsQuery,
  useRequestPayoutMutation,
} from "../../redux/services/ngoApi";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import { IMAGE_BASE_URL } from "../../utils/imageUrl"; // ✅ Base URL util

// ✅ Convert file → Base64 helper
const base64Image = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function NGODashboard() {
  const { orgId } = useParams();
  const { data, isLoading, refetch } = useGetOrgApplicationQuery(orgId);
  const [uploadKyc, { isLoading: uploading }] = useUploadKycMutation();
  const [sendMsg] = useTicketMessageMutation();
  const { data: payoutRes } = useGetPayoutsQuery(orgId);
  const [requestPayout, { isLoading: requesting }] = useRequestPayoutMutation();

  const org = data?.data?.org;
  const ticket = data?.data?.ticket;
  const payouts = payoutRes?.data || [];

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // ✅ Calculate progress %
  const progressPct = useMemo(() => {
    const list = ticket?.checklist || [];
    if (!list.length) return 0;
    const passed = list.filter((i) => i.passed).length;
    return Math.round((passed / list.length) * 100);
  }, [ticket]);

  // ✅ Upload document handler
  const handleUpload = async (key, file) => {
    try {
      const b64 = await base64Image(file);
      await uploadKyc({ orgId, key, fileBase64: b64 }).unwrap();
      message.success("Document uploaded successfully");
      refetch();
    } catch (err) {
      console.error("Upload Error:", err);
      message.error("Upload failed");
    }
    return false;
  };

  // ✅ Request payout
  const requestPayoutHandler = async () => {
    const amount = Number(prompt("Enter amount to request (INR):"));
    if (!amount) return;
    try {
      await requestPayout({ orgId, campaignId: null, amount }).unwrap();
      message.success("Payout requested");
    } catch (e) {
      message.error("Failed to request payout");
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500 font-medium">
        <Spin /> Loading dashboard...
      </div>
    );

  if (!org)
    return (
      <div className="p-6 text-center text-gray-600">
        Organization not found or access denied.
      </div>
    );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d8573e",
          colorPrimaryHover: "#c34932",
          colorPrimaryActive: "#b3412d",
          colorTextLightSolid: "#ffffff",
        },
      }}
    >
      <div className="max-w-6xl mt-16 mx-auto mt-16 p-4 space-y-12">
        {/* ===== STATUS CARDS ===== */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Application Status" bordered>
            <div className="flex items-center justify-between mb-3">
              <Tag
                color={
                  org.status === "APPROVED"
                    ? "green"
                    : org.status === "INFO_REQUESTED"
                    ? "orange"
                    : org.status === "REJECTED"
                    ? "red"
                    : "#d8573e"
                }
              >
                {org.status}
              </Tag>
              <div className="w-40 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor: "#d8573e",
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">Progress: {progressPct}%</p>
            <p className="mt-2 text-sm">
              Payout status: <b>{org.payoutStatus}</b>
            </p>
          </Card>

          <Card title="Quick Actions" bordered>
            <div className="space-y-2">
              <Button
                block
                type="primary"
                href={`/orgs/${orgId}/campaigns/new`}
                disabled={
                  org.status !== "APPROVED" || org.payoutStatus === "UNSET"
                }
              >
                Create Org Campaign
              </Button>
              <Button
                block
                type="primary"
                ghost
                onClick={requestPayoutHandler}
                disabled={org.status !== "APPROVED"}
                loading={requesting}
              >
                Request Payout
              </Button>
            </div>
          </Card>

          <Card title="Contact" bordered>
            <p className="text-sm">
              <b>{org.primaryContact?.name}</b>
            </p>
            <p className="text-sm">{org.primaryContact?.email}</p>
            <p className="text-sm">{org.primaryContact?.phone}</p>
          </Card>
        </div>

        {/* ===== KYC CHECKLIST ===== */}
        <Card title="Verification Checklist" bordered>
          <List
            dataSource={ticket?.checklist || []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  item.fileUrl ? (
                    <Button
                      icon={<EyeOutlined />}
                      size="small"
                      type="default"
                      onClick={() => {
                        setPreviewUrl(`${IMAGE_BASE_URL}${item.fileUrl}`);
                        setPreviewVisible(true);
                      }}
                    >
                      View
                    </Button>
                  ) : (
                    <Tag color="red">No File</Tag>
                  ),

                  item.passed ? (
                    <Tag color="green">Verified</Tag>
                  ) : item.comment?.toLowerCase().includes("reject") ? (
                    <>
                      <Tag color="red">Rejected</Tag>
                      <Upload
                        multiple={false}
                        showUploadList={false}
                        beforeUpload={(file) => handleUpload(item.key, file)}
                      >
                        <Button
                          type="primary"
                          icon={<UploadOutlined />}
                          loading={uploading}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Re-upload"}
                        </Button>
                      </Upload>
                    </>
                  ) : (
                    <Upload
                      multiple={false}
                      showUploadList={false}
                      beforeUpload={(file) => handleUpload(item.key, file)}
                    >
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={uploading}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                    </Upload>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={
                    <span className="font-medium">
                      {item.label}
                      {item.comment?.toLowerCase().includes("reject") && (
                        <span className="text-red-500 text-xs ml-2">
                          (Please re-upload corrected document)
                        </span>
                      )}
                    </span>
                  }
                  description={
                    <div className="text-gray-500 text-sm space-y-1">
                      {item.comment && <div>{item.comment}</div>}
                      {item.updatedAt && (
                        <div className="text-xs text-gray-400">
                          Last Updated:{" "}
                          {new Date(item.updatedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* ===== ADMIN MESSAGES ===== */}
        <Card title="Messages with Admin">
          <div className="space-y-3">
            <div className="bg-gray-50 rounded p-3 max-h-64 overflow-auto">
              {(ticket?.messages || []).map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded ${
                    m.by === "ADMIN"
                      ? "bg-[#d8573e]/10 border border-[#d8573e]/20"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {m.by} • {new Date(m.at).toLocaleString()}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <SendMessage orgId={orgId} onSend={sendMsg} />
          </div>
        </Card>

        {/* ===== PAYOUT LIST ===== */}
        <Card title="Payout Requests">
          <List
            dataSource={payouts}
            renderItem={(p) => (
              <List.Item>
                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>₹{p.amountRequested}</div>
                  <Tag color="#d8573e">{p.status}</Tag>
                  <div className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* ===== FILE PREVIEW MODAL ===== */}
        <Modal
          open={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          centered
          width={800}
        >
          {previewUrl.endsWith(".pdf") ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              style={{
                width: "100%",
                height: "80vh",
                border: "none",
                borderRadius: "8px",
              }}
            />
          ) : (
            <Image
              src={previewUrl}
              alt="Document Preview"
              style={{
                maxHeight: "80vh",
                maxWidth: "100%",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}

// ===== SEND MESSAGE COMPONENT =====
function SendMessage({ orgId, onSend }) {
  const [text, setText] = React.useState("");
  const send = async () => {
    if (!text.trim()) return;
    try {
      await onSend({ orgId, text, attachments: [] }).unwrap();
      setText("");
      message.success("Message sent");
    } catch {
      message.error("Failed to send");
    }
  };
  return (
    <div className="flex gap-2 items-start">
      <Input.TextArea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message to Admin..."
      />
      <Button type="primary" onClick={send}>
        Send
      </Button>
    </div>
  );
}
