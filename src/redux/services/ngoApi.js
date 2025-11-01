import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const ngoApi = createApi({
  reducerPath: "ngoApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["OrgApp", "Payouts", "AdminOrgs"],
  endpoints: (builder) => ({
    // ================= NGO Application =================
    applyOrg: builder.mutation({
      query: (payload) => ({
        url: `/org/apply`,
        method: "POST",
        body: payload,
      }),
    }),

    getOrgApplication: builder.query({
      query: (orgId) => ({
        url: `/org/${orgId}/application`,
        method: "GET",
      }),
      providesTags: (res, err, orgId) => [{ type: "OrgApp", id: orgId }],
    }),

    uploadKyc: builder.mutation({
      query: ({ orgId, key, fileBase64, comment }) => ({
        url: `/org/${orgId}/kyc/upload`,
        method: "POST",
        body: { key, fileBase64, comment },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (res, err, args) => [{ type: "OrgApp", id: args.orgId }],
    }),

    ticketMessage: builder.mutation({
      query: ({ orgId, text, attachments }) => ({
        url: `/org/${orgId}/ticket/message`,
        method: "POST",
        body: { text, attachments },
      }),
      invalidatesTags: (res, err, args) => [{ type: "OrgApp", id: args.orgId }],
    }),

    // ================= Payouts =================
    requestPayout: builder.mutation({
      query: ({ orgId, campaignId, amount }) => ({
        url: `/org/${orgId}/payouts`,
        method: "POST",
        body: { campaignId, amount },
      }),
      invalidatesTags: (res, err, args) => [
        { type: "Payouts", id: args.orgId },
      ],
    }),

    getPayouts: builder.query({
      query: (orgId) => ({
        url: `/org/${orgId}/payouts`,
        method: "GET",
      }),
      providesTags: (res, err, orgId) => [{ type: "Payouts", id: orgId }],
    }),

    // ================= Admin Endpoints =================
    adminListOrgs: builder.query({
      query: (status) => ({
        url: `/orgAdmin/orgs${
          status ? `?status=${encodeURIComponent(status)}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["AdminOrgs"],
    }),

    adminDecideOrg: builder.mutation({
      query: ({ orgId, decision, checklist, reasons }) => ({
        url: `/orgAdmin/orgs/${orgId}/decision`,
        method: "POST",
        body: { decision, checklist, reasons },
      }),
      invalidatesTags: ["AdminOrgs"],
    }),

    adminVerifyPayout: builder.mutation({
      query: ({ orgId, verified, ref }) => ({
        url: `/orgAdmin/orgs/${orgId}/payout-verify`,
        method: "POST",
        body: { verified, ref },
      }),
      invalidatesTags: ["AdminOrgs"],
    }),

    // ✅ New: Verify Individual NGO Document
    verifyDocument: builder.mutation({
      query: ({ orgId, key, passed, comment }) => ({
        url: `/orgAdmin/orgs/${orgId}/verify-document`,
        method: "POST",
        body: { key, passed, comment },
      }),
      invalidatesTags: (res, err, args) => [{ type: "OrgApp", id: args.orgId }],
    }),
  }),
});

export const {
  useApplyOrgMutation,
  useGetOrgApplicationQuery,
  useUploadKycMutation,
  useTicketMessageMutation,
  useRequestPayoutMutation,
  useGetPayoutsQuery,
  useAdminListOrgsQuery,
  useAdminDecideOrgMutation,
  useAdminVerifyPayoutMutation,
  useVerifyDocumentMutation,
} = ngoApi;
