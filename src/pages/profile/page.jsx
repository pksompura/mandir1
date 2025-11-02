/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../utils/imageUrl";

import {
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Table, Modal, Image } from "antd";
import {
  MdPerson,
  MdReceipt,
  MdLocationOn,
  MdLogout,
  MdEdit,
  MdOutlineCampaign,
} from "react-icons/md";
import styled from "styled-components";
import {
  useCreateCampaignByUserMutation,
  useGetDonationCampaignsByUserQuery,
  useUpdateUserMutation,
  useLazyGetUserProfileQuery,
} from "../../redux/services/campaignApi";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import CampaignForm from "../../components/donation/UserCreateDonation"; // Assuming CampaignForm is set up correctly
import { CiHeart, CiMapPin } from "react-icons/ci";
import { setUserData } from "../../redux/slices/userSlice";
import Swal from "sweetalert2";
import DonationsList from "./DonationsList";

const ProfileMenu = styled.div`
  min-width: 200px;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileContent = styled.div`
  flex: 1;
  padding: 32px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProfilePage = () => {
  const user = useSelector((data) => data?.user?.userData); // Get user data from Redux
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Profile");
  const [editMode, setEditMode] = useState(false); // Track if user is editing
  const [loading, setLoading] = useState(false); // Track if save is in progress
  const [editingCampaign, setEditingCampaign] = useState(null); // Track which campaign is being edited
  const [userInfo, setUserInfo] = useState({
    full_name: user?.full_name || "",
    last_name: user?.last_name || "",
    mobile_number: user?.mobile_number || "",
    email: user?.email || "",
    address: user?.address || "",
    profile_pic: user?.profile_pic || "",
    pan_number: user?.pan_number || "",
  });

  const [selectedFile, setSelectedFile] = useState(null); // For image file upload
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    refetch,
  } = useGetDonationCampaignsByUserQuery(); // Fetch user's donation campaigns

  const [userDonation, setUserDonation] = useState(null);
  const [fetchData, { data }] = useLazyGetUserProfileQuery();
  // const handleFetchUserProfile = async () => {
  //   const result = await fetchData(); // fetchData returns a promise
  //   const user = result?.data?.data;
  //   const donations = result?.data?.donations;
  //   if (user && donations) {
  //     setUserDonation({ ...user, donations }); // merge
  //   }
  // };
  // useEffect(() => {
  //   handleFetchUserProfile();
  // }, [handleFetchUserProfile]);
  useEffect(() => {
    const getProfile = async () => {
      const res = await fetchData();
      const apiRes = res?.data;
      const user = apiRes?.data;

      if (user) {
        setUserInfo({
          full_name: user.full_name || "",
          mobile_number: user.mobile_number || "",
          email: user.email || "",
          address: user.address || "",
          pan_number: user.pan_number || "",
          profile_pic: user.profile_pic || "",
        });
      }

      if (apiRes?.donations) {
        setUserDonation({
          ...user,
          donations: apiRes.donations,
        });
      }
    };
    getProfile();
  }, []);

  // console.log(useGetDonationCampaignsByUserQuery());
  const [createCampaign] = useCreateCampaignByUserMutation(); // API hook for creating a new donation campaign

  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [updateUser] = useUpdateUserMutation(); // API hook for updating user

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const showModal = (campaign = null) => {
    setEditingCampaign(campaign); // Set the campaign being edited
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingCampaign(null); // Clear the editing campaign
    setIsModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true); // Show loader

    if (selectedFile) {
      formData.append("profile_pic", selectedFile); // Append the image file if selected
    }

    try {
      // API call to update user
      await updateUser(userInfo).unwrap();
      toast.success("Profile updated successfully!"); // Success message
      setEditMode(false); // Exit edit mode after success
    } catch (error) {
      toast.error("Error updating profile: " + error.message); // Error message
    }
    setLoading(false); // Hide loader
  };

  // Handle avatar click to open file input
  const handleAvatarClick = () => {
    document.getElementById("fileInput").click(); // Trigger hidden file input
  };

  // Approve campaign function
  const handleApproveCampaign = async (campaignId) => {
    try {
      // Call the approve API here (you'll need to implement this)
      toast.success("Campaign approved successfully!");
      // Update the campaign list by refetching
    } catch (error) {
      toast.error("Error approving campaign: " + error.message);
    }
  };

  useEffect(() => {
    if (user) {
      setUserInfo({
        full_name: user?.full_name || "",
        last_name: user?.last_name || "",
        mobile_number: user?.mobile_number || "",
        email: user?.email || "",
        address: user?.address || "",
        profile_pic: user?.profile_pic || "",
        pan_number: user?.pan_number || "",
      });
    }
  }, [user]);

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6" component="h1">
                Personal Information
              </Typography>
              <IconButton
                className="text-orange-500"
                onClick={() => setEditMode(!editMode)}
              >
                <MdEdit />
                <Typography className="ml-1">
                  {editMode ? "Cancel" : "Edit"}
                </Typography>
              </IconButton>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col items-center space-y-4">
                {/* <Avatar
                  sx={{ width: 100, height: 100, cursor: "pointer" }}
                  src={userInfo.profile_pic}
                  onClick={handleAvatarClick}
                /> */}
                <HiddenInput
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="full_name"
                    value={userInfo.full_name}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: !editMode, // Make read-only if not editing
                    }}
                    className={editMode ? "" : "bg-gray-100"}
                  />
                </div>
                <TextField
                  label="Mobile No"
                  variant="outlined"
                  fullWidth
                  name="mobile_number"
                  value={userInfo.mobile_number}
                  InputProps={{
                    readOnly: true, // Mobile number is now read-only
                  }}
                  className="bg-gray-100"
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: !editMode, // Make read-only if not editing
                  }}
                  className={editMode ? "" : "bg-gray-100"}
                />
                {/* <TextField
                  label="Full Address"
                  variant="outlined"
                  fullWidth
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: !editMode, // Make read-only if not editing
                  }}
                  className={editMode ? "" : "bg-gray-100"}
                />
                <TextField
                  label="PAN Number"
                  variant="outlined"
                  fullWidth
                  name="pan_number"
                  value={userInfo.pan_number}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: !editMode, // Make read-only if not editing
                  }}
                  className={editMode ? "" : "bg-gray-100"}
                /> */}
              </div>
            </div>
            {editMode && (
              <div className="mt-6">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </>
        );
      case "Donations":
        return <DonationsList userDonations={userDonation} />;
      case "Fundraisers":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6">My Fundraisers</Typography>
              <Button
                type="primary"
                onClick={() => navigate(`/fundraiser-setup`)}
              >
                + Start New Fundraiser
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignsData?.data?.map((campaign, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    navigate(`/fundraiser-dashboard/${campaign._id}`)
                  } // 👈 redirect
                >
                  <img
                    src={
                      campaign?.main_picture?.startsWith("/images/")
                        ? `${IMAGE_BASE_URL}${campaign.main_picture}`
                        : campaign?.main_picture
                    }
                    alt={campaign?.campaign_title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">
                      {campaign?.campaign_title}
                    </h3>
                    <p className="text-gray-600">
                      {campaign?.story?.slice(0, 100)}...
                    </p>
                    <div className="flex justify-between mt-3">
                      <span className="text-sm font-semibold text-red-500">
                        {campaign?.is_approved ? "Approved" : "Pending"}
                      </span>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent redirect
                          navigate(`/fundraiser-setup/${campaign._id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "Campaigns":
        return (
          <>
            <div className="flex justify-between items-center mb-6 ">
              <Typography variant="h6">Your Donations</Typography>
              <Button type="primary" onClick={() => showModal(null)}>
                Create Donation
              </Button>
            </div>
            {/* <Table
            className="!overflow-auto"
              dataSource={campaignsData?.data || []} // Map data from API response
              loading={campaignsLoading}
              columns={[
                { title: "Title", dataIndex: "campaign_title", key: "title" },
                {
                  title: "Description",
                  dataIndex: "short_description",
                  key: "description",
                },
                {
                  title: "Main Picture",
                  dataIndex: "main_picture",
                  key: "main_picture",
                  render: (text) => (
                    <Image src={text} alt="main_picture" width={100} height={100} />
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "is_approved",
                  key: "is_approved",
                  render: (is_approved) => (
                    <Typography>{is_approved ? "Approved" : "Not Approved"}</Typography>
                  ),
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, record) => (
                    <div className="flex space-x-4">
                      {!record.is_approved && (
                        <Button
                          type="link"
                          onClick={() => {
                            console.log(record)
                            showModal(record)}}
                          icon={<MdEdit />}
                        >
                          Edit
                        </Button>
                      )}
                   
                    </div>
                  ),
                },
              ]}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            /> */}
            <div className="grid grid-cols-1 md:grid-cols-2 mr-auto">
              {campaignsData?.data?.map((data, i) => (
                <div
                  className="flex items-center w-full justify-center h-96 mb-6"
                  key={i + "1"}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 p-2">
                    <img
                      src={data?.main_picture}
                      alt={data?.campaign_title}
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="p-4">
                      <h3 className="mt-1 text-xl font-bold">
                        {data?.ngo_name}
                      </h3>
                      <h3 className="mt-1 text-[15px] text-red-500">
                        {data?.campaign_title}
                      </h3>
                      <div className="mt-4">
                        <hr className="h-2 my-2" />
                        <button
                          className="w-full flex gap-2 items-center justify-center bg-[#d6573d] text-white font-bold py-2 px-4 rounded-full"
                          onClick={() => {
                            setIsModalVisible(data);
                            setEditingCampaign(data);
                          }}
                        >
                          <div className="relative">
                            Edit{" "}
                            <span>
                              <CiHeart className="animate-ping absolute -right-8 top-[5px]" />
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Modal for creating/editing donation */}
            <Modal
              title={editingCampaign ? "Edit Donation" : "Create Donation"}
              visible={isModalVisible}
              onCancel={handleModalClose}
              footer={null}
            >
              <CampaignForm campaign={editingCampaign} refetch={refetch} />
            </Modal>
          </>
        );
      case "Log-Out":
        return <Typography variant="h6">You have been logged out.</Typography>;
      default:
        return null;
    }
  };
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "https://devaseva.onrender.com/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (typeof window !== "undefined") {
        localStorage?.removeItem("authToken");
        dispatch(setUserData());
        window.location.href = "/";
      }
      window.location.href = "/";
      // setIsProfileDropdownOpen(false);
      // setToken(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    if (!localStorage?.getItem("authToken")) {
      window.location.href = "/";
    }
  });
  if (!localStorage?.getItem("authToken")) {
    return <>Loading ...</>;
  }
  return (
    <div className="flex flex-col md:flex-row p-4 md:p-10 space-y-4 md:space-y-0 md:space-x-4 mt-10">
      <ProfileMenu>
        <List>
          <ListItem
            button
            selected={activeTab === "Profile"}
            onClick={() => setActiveTab("Profile")}
          >
            <ListItemIcon>
              <MdPerson className="text-orange-500" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            button
            selected={activeTab === "Donations"}
            onClick={() => setActiveTab("Donations")}
          >
            <ListItemIcon>
              <MdReceipt className="text-orange-500" />
            </ListItemIcon>
            <ListItemText primary="Donations" />
          </ListItem>

          <ListItem
            button
            selected={activeTab === "Fundraisers"}
            onClick={() => setActiveTab("Fundraisers")}
          >
            <ListItemIcon>
              <MdOutlineCampaign className="text-orange-500" />
            </ListItemIcon>
            <ListItemText primary="My Fundraisers" />
          </ListItem>

          {/* <a href={"https://tally.so/r/w4Lgjb"} target="_blank">
          <ListItem
            button
            selected={activeTab === "Create Campaign"}
            // onClick={() => setActiveTab("Campaigns")}
          >
            <ListItemIcon>
              <MdLocationOn />
            </ListItemIcon>
            <ListItemText primary="Create Campaign" />
          </ListItem>
            </a> */}
          <ListItem
            button
            selected={activeTab === "Log-Out"}
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out of your account.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, log me out",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleLogout();
                }
              });
            }}
          >
            <ListItemIcon>
              <MdLogout className="text-orange-500" />
            </ListItemIcon>
            <ListItemText primary="Log-Out" />
          </ListItem>
        </List>
      </ProfileMenu>
      <ProfileContent>{renderContent()}</ProfileContent>
    </div>
  );
};

export default ProfilePage;
