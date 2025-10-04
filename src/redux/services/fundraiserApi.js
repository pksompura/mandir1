import { createApi } from "@reduxjs/toolkit/query/react";
import apiBaseQuery from "./axiosBaseQuery";

export const FUNDRAISER_API = "fundraiserApi";

export const fundraiserApi = createApi({
  reducerPath: FUNDRAISER_API,
  baseQuery: apiBaseQuery,
  tagTypes: ["fundraiser", "login", "kyc", "campaign"],
  endpoints: (builder) => ({
    // --------------------- OTP / LOGIN ---------------------
    sendOtp: builder.mutation({
      query: (body) => ({
        url: "/fundraiser/sendOtp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/fundraiser/verifyOtp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/fundraiser/logout",
        method: "POST",
      }),
      invalidatesTags: ["login"],
    }),

    // --------------------- PROFILE ---------------------
    getProfile: builder.query({
      query: () => ({
        url: "/fundraiser/profile",
      }),
      providesTags: ["fundraiser"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/fundraiser/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["fundraiser"],
    }),

    // --------------------- KYC ---------------------
    createOrUpdateKyc: builder.mutation({
      query: (body) => ({
        url: "/fundraiser/kyc",
        method: "POST",
        body,
      }),
      invalidatesTags: ["kyc"],
    }),

    // --------------------- ADMIN: List all Fundraisers ---------------------
    listAllFundraisers: builder.query({
      query: () => ({
        url: "/fundraiser",
      }),
      providesTags: ["fundraiser"],
    }),

    // --------------------- CAMPAIGNS ---------------------
    createCampaign: builder.mutation({
      query: (body) => ({
        url: "/fundraiser/campaigns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    updateCampaign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/fundraiser/campaigns/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/fundraiser/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["campaign"],
    }),
    listMyCampaigns: builder.query({
      query: () => ({
        url: "/fundraiser/campaigns",
      }),
      providesTags: ["campaign"],
    }),
    getCampaignById: builder.query({
      query: (id) => ({
        url: `/fundraiser/campaigns/${id}`,
      }),
      providesTags: ["campaign"],
    }),
  }),
});

export const {
  // OTP/Login
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLogoutMutation,

  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,

  // KYC
  useCreateOrUpdateKycMutation,

  // Admin
  useListAllFundraisersQuery,

  // Campaign
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useListMyCampaignsQuery,
  useGetCampaignByIdQuery,
} = fundraiserApi;
