import React, { useMemo } from "react";
import {
  Card,
  Button,
  Upload,
  message,
  List,
  Tag,
  Input,
  ConfigProvider,
} from "antd";
import { useParams } from "react-router-dom";
import {
  useGetOrgApplicationQuery,
  useUploadKycMutation,
  useTicketMessageMutation,
  useGetPayoutsQuery,
  useRequestPayoutMutation,
} from "../../redux/services/ngoApi";
import { UploadOutlined } from "@ant-design/icons";

export default function NGODashboard() {
  const { orgId } = useParams();

  const { data, isLoading } = useGetOrgApplicationQuery(orgId);
  const [uploadKyc, { isLoading: uploading }] = useUploadKycMutation();
  const [sendMsg] = useTicketMessageMutation();
  const { data: payoutRes } = useGetPayoutsQuery(orgId);
  const [requestPayout, { isLoading: requesting }] = useRequestPayoutMutation();

  const org = data?.data?.org;
  const ticket = data?.data?.ticket;
  const payouts = payoutRes?.data || [];

  const progressPct = useMemo(() => {
    const list = ticket?.checklist || [];
    if (!list.length) return 0;
    const passed = list.filter((i) => i.passed).length;
    return Math.round((passed / list.length) * 100);
  }, [ticket]);

  const handleUpload = async (key, file) => {
    const b64 = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    await uploadKyc({ orgId, key, fileUrl: b64 }).unwrap();
    message.success("Uploaded");
    return false;
  };

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
        Loading dashboard...
      </div>
    );

  if (!orgId)
    return (
      <div className="p-6 text-center text-gray-600">
        No organization selected.
        <br /> Please go to the NGO application page.
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
        components: {
          Button: {
            colorPrimary: "#d8573e",
            colorPrimaryHover: "#c34932",
            colorPrimaryActive: "#b3412d",
            borderRadius: 8,
          },
          Tag: {
            defaultColor: "#d8573e1a",
          },
        },
      }}
    >
      <div className="max-w-6xl mx-auto mt-16 p-4 space-y-12">
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

        <Card title="Verification Checklist">
          <List
            dataSource={ticket?.checklist || []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  item.passed ? (
                    <Tag color="green">Verified</Tag>
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
                      >
                        Upload
                      </Button>
                    </Upload>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={<span>{item.label}</span>}
                  description={
                    item.comment ? (
                      <span className="text-gray-500 text-sm">
                        {item.comment}
                      </span>
                    ) : null
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="Messages with Admin">
          <div className="space-y-3">
            <div className="bg-gray-50 rounded p-3 max-h-64 overflow-auto">
              {(ticket?.messages || []).map((m, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs text-gray-500">
                    {m.by} • {new Date(m.at).toLocaleString()}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <SendMessage orgId={orgId} onSend={sendMsg} />
          </div>
        </Card>

        <Card title="Payouts">
          <List
            dataSource={payouts}
            renderItem={(p) => (
              <List.Item>
                <div className="w-full flex justify-between items-center">
                  <div>₹{p.amountRequested}</div>
                  <div>
                    <Tag color="#d8573e">{p.status}</Tag>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
}

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
