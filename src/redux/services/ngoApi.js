import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery"; // <-- your axios baseQuery from the snippet you shared

// IMPORTANT: Your server mounts:
// app.use("/api/org", orgRoutes);
// app.use("/api/orgAdmin", orgAdminRoutes);
//
// So endpoints must start with /org or /orgAdmin (NOT /orgs)

export const ngoApi = createApi({
  reducerPath: "ngoApi",
  baseQuery: axiosBaseQuery, // <-- uses http://localhost:5001/api by default from your axiosInstance
  tagTypes: ["OrgApp", "Payouts", "AdminOrgs"],
  endpoints: (builder) => ({
    // NGO Application
    applyOrg: builder.mutation({
      query: (payload) => ({
        url: `/org/apply`, // was /orgs/apply
        method: "POST",
        body: payload,
      }),
    }),

    getOrgApplication: builder.query({
      query: (orgId) => ({
        url: `/org/${orgId}/application`, // was /orgs/:id/application
        method: "GET",
      }),
      providesTags: (res, err, orgId) => [{ type: "OrgApp", id: orgId }],
    }),

    uploadKyc: builder.mutation({
      query: ({ orgId, key, fileUrl, comment }) => ({
        url: `/org/${orgId}/kyc/upload`, // was /orgs/:id/kyc/upload
        method: "POST",
        body: { key, fileUrl, comment },
      }),
      invalidatesTags: (res, err, args) => [{ type: "OrgApp", id: args.orgId }],
    }),

    ticketMessage: builder.mutation({
      query: ({ orgId, text, attachments }) => ({
        url: `/org/${orgId}/ticket/message`, // was /orgs/:id/ticket/message
        method: "POST",
        body: { text, attachments },
      }),
      invalidatesTags: (res, err, args) => [{ type: "OrgApp", id: args.orgId }],
    }),

    // Payouts
    requestPayout: builder.mutation({
      query: ({ orgId, campaignId, amount }) => ({
        url: `/org/${orgId}/payouts`, // was /orgs/:id/payouts
        method: "POST",
        body: { campaignId, amount },
      }),
      invalidatesTags: (res, err, args) => [
        { type: "Payouts", id: args.orgId },
      ],
    }),

    getPayouts: builder.query({
      query: (orgId) => ({
        url: `/org/${orgId}/payouts`, // was /orgs/:id/payouts
        method: "GET",
      }),
      providesTags: (res, err, orgId) => [{ type: "Payouts", id: orgId }],
    }),

    // Admin (mounted at /api/orgAdmin)
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
} = ngoApi;
