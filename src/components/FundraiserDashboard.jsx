import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Grid,
  Paper,
  Button,
  Divider,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CampaignIcon from "@mui/icons-material/Campaign";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import UpdateIcon from "@mui/icons-material/Update";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import DescriptionIcon from "@mui/icons-material/Description";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MailIcon from "@mui/icons-material/Mail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCampaignQuery,
  useGetBankQuery,
  useSaveBankMutation,
  useRequestWithdrawalMutation,
  useGetWithdrawalsQuery,
} from "../redux/services/campaignApi";

import { message, Table } from "antd";

const getAvatarColor = (name = "U") => {
  const colors = [
    "#1976d2",
    "#d32f2f",
    "#388e3c",
    "#f57c00",
    "#7b1fa2",
    "#0097a7",
    "#c2185b",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function FundraiserDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { campaignId } = useParams();
  const { data, isLoading } = useGetCampaignQuery(campaignId);
  // const { data: withdrawals, isLoading1 } = useGetWithdrawalsQuery(campaignId);
  // const [saveBank] = useSaveBankMutation();
  // const [requestWithdrawal] = useRequestWithdrawalMutation();

  const campaign = data?.data?.campaign || null;
  const donors = data?.data?.donors || [];
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon className="text-orange-500" /> },
    {
      text: "Reach & Share",
      icon: <CampaignIcon className="text-orange-500" />,
    },
    {
      text: "Payouts",
      icon: <AccountBalanceWalletIcon className="text-orange-500" />,
    },
    {
      text: "Supporters",
      icon: <VolunteerActivismIcon className="text-orange-500" />,
    },
    { text: "Messages", icon: <MailIcon className="text-orange-500" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent campaign={campaign} />; // ✅ Pass campaign here
      case "Reach & Share":
        return <ReachAndShareContent campaign={campaign} />;
      case "Payouts":
        return <PayoutsContent campaign={campaign} />;
      case "Supporters":
        return <SupportersContent campaign={campaign} />;
      case "Messages":
        return <MessagesContent campaign={campaign} />;
      default:
        return null;
    }
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col md:flex-row p-4 md:p-10 space-y-4 md:space-y-0 md:space-x-4 mt-10 w-full">
      {/* Left Menu */}
      <Paper
        elevation={2}
        className="w-full md:w-1/6 bg-white rounded-lg shadow-md"
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={activeTab === item.text}
              onClick={() => setActiveTab(item.text)}
              className="rounded-md"
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#ffece6",
                  "& .MuiListItemText-primary": {
                    color: "#d6573d",
                    fontWeight: "bold",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "36px", color: "#d6573d" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Right Content */}
      <Paper elevation={3} className="flex-1 bg-white rounded-lg shadow-md p-6">
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#d6573d", mb: 3 }}
        >
          {activeTab}
        </Typography>
        {renderContent()}
      </Paper>
    </div>
  );
}
// Dashboard Content
// ------------------------
function DashboardContent({ campaign }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const [kycVerified, setKycVerified] = useState(false);
  const [docsVerified, setDocsVerified] = useState(false);
  const [openKyc, setOpenKyc] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);

  const beneficiaryName = campaign?.beneficiary || "Beneficiary";
  const avatarLetter = beneficiaryName.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(beneficiaryName);

  if (!campaign) {
    return <Typography>Loading fundraiser data...</Typography>;
  }

  // Parse numbers safely
  const goal = Number(campaign?.target_amount?.$numberDecimal || 0);
  const raised = Number(campaign?.raised_amount) || 0;
  const donors = campaign?.donors_count || 0;
  const views = campaign?.views || 0;
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  // ✅ Parse description
  const description = campaign?.campaign_description || "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  const text = doc.body.textContent || "";
  const images = Array.from(doc.querySelectorAll("img")).map(
    (img) => img.outerHTML
  );

  const previewText = text.slice(0, 500);
  const previewImages = images.slice(0, 2).join("");

  const previewHTML = `<p>${previewText}${
    text.length > 500 ? "..." : ""
  }</p>${previewImages}`;
  const fullHTML = description;

  const handleVerifyKyc = async () => {
    // 🔹 Example: call Aadhaar KYC API here
    // await api.verifyAadhaar({ aadhaarNumber, otp });
    setKycVerified(true);
    setOpenKyc(false);
  };

  const handleUploadDocs = async () => {
    // 🔹 Example: call backend API to upload documents
    // await api.uploadDocs(formData);
    setDocsVerified(true);
    setOpenDocs(false);
  };

  return (
    <Grid container spacing={3}>
      {/* Left Stats Panel */}
      <Grid item xs={12} md={8}>
        {/* Fundraiser Goal */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 2,
            mb: 3,
          }}
        >
          {/* Campaign Title + Status Badge Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap", // ✅ allows wrapping on small screens
              gap: 1.5,
              mb: 2,
            }}
          >
            {/* Campaign Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                flex: "1 1 auto", // ✅ lets it shrink if needed
                minWidth: "200px",
                wordBreak: "break-word", // ✅ handles long words gracefully
              }}
            >
              {campaign?.campaign_title}
            </Typography>

            {/* Status Badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                px: 1.5,
                py: 0.5,
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
                bgcolor: campaign?.is_approved ? "#e6f9ec" : "#fff8e6",
                color: campaign?.is_approved ? "#28a745" : "#d68000",
                boxShadow: "0 0 6px rgba(0,0,0,0.05)",
                flexShrink: 0, // ✅ prevent it from shrinking too small
                "@media (max-width:600px)": {
                  fontSize: "0.65rem",
                  px: 1,
                  py: 0.25,
                },
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: campaign?.is_approved ? "#28a745" : "#f0ad4e",
                  animation: "pulseDot 1.5s infinite",
                }}
              />
              {campaign?.is_approved ? "Active" : "Pending Approval"}
            </Box>
          </Box>

          {/* 🔹 Pulse animation */}
          <style>
            {`
      @keyframes pulseDot {
        0% { box-shadow: 0 0 0 0 rgba(40,167,69,0.6); }
        70% { box-shadow: 0 0 0 6px rgba(40,167,69,0); }
        100% { box-shadow: 0 0 0 0 rgba(40,167,69,0); }
      }
    `}
          </style>

          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Goal: ₹ {goal.toLocaleString()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ₹ {raised.toLocaleString()} raised
          </Typography>
          {/* ✅ Progress Bar */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: "#f1f1f1",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#d6573d", // Orange-red brand color
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{ mt: 1, fontWeight: 500, color: "#555" }}
            >
              {progress.toFixed(1)}% of ₹{goal.toLocaleString()}
            </Typography>
          </Box>
          {/* ✅ Description with Read More / Less */}
          <Typography
            variant="body1"
            component="div"
            sx={{
              mt: 2,
              maxWidth: "100%", // ✅ Prevent expanding card width
              wordWrap: "break-word", // ✅ Break long words
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
              "& img": {
                maxWidth: "100%", // ✅ Images won’t overflow
                height: "auto",
                borderRadius: "6px",
                margin: "6px",
                display: "inline-block",
              },
              "& p": {
                marginBottom: "10px",
              },
            }}
            dangerouslySetInnerHTML={{
              __html: expanded ? fullHTML : previewHTML,
            }}
          />

          {text.length > 500 && (
            <Button
              onClick={() => setExpanded(!expanded)}
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 500,
                color: "#d6573d",
              }}
            >
              {expanded ? "Read less" : "Read more"}
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#d6573d",
              "&:hover": { backgroundColor: "#b84c32" },
            }}
            onClick={() => navigate(`/fundraiser-setup/${campaign?._id}`)}
          >
            Edit Fundraiser
          </Button>
        </Paper>

        {/* Approval Process */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Approval Process
          </Typography>

          {/* Aadhaar Verification */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FingerprintIcon color={kycVerified ? "success" : "primary"} />
            <Box flex={1}>
              <Typography variant="body1" fontWeight={600}>
                Aadhaar E-Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verify your Aadhaar details to proceed.
              </Typography>
            </Box>
            {kycVerified ? (
              <Chip
                icon={<VerifiedIcon />}
                label="Verified"
                color="success"
                size="small"
              />
            ) : (
              <Button
                variant="contained"
                startIcon={<InfoIcon />}
                onClick={() => setOpenKyc(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  flexBasis: "140px",
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#115293" },
                }}
              >
                Verify
              </Button>
            )}
          </Box>

          {/* Document Upload */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <DescriptionIcon color={docsVerified ? "success" : "primary"} />
            <Box flex={1}>
              <Typography variant="body1" fontWeight={600}>
                Supporting Documents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload PAN, medical bills, or other documents.
              </Typography>
            </Box>
            {docsVerified ? (
              <Chip
                icon={<VerifiedIcon />}
                label="Verified"
                color="success"
                size="small"
              />
            ) : (
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
                onClick={() => setOpenDocs(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  flexBasis: "140px",
                  backgroundColor: "#d6573d",
                  "&:hover": { backgroundColor: "#b84c32" },
                }}
              >
                Upload
              </Button>
            )}
          </Box>

          {/* Aadhaar Verification Modal */}
          <Dialog open={openKyc} onClose={() => setOpenKyc(false)} fullWidth>
            <DialogTitle>Aadhaar E-Verification</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Enter your Aadhaar number and OTP for verification.
              </Typography>
              <TextField fullWidth label="Aadhaar Number" margin="dense" />
              <TextField fullWidth label="OTP" margin="dense" />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenKyc(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleVerifyKyc}>
                Verify
              </Button>
            </DialogActions>
          </Dialog>

          {/* Document Upload Modal */}
          <Dialog open={openDocs} onClose={() => setOpenDocs(false)} fullWidth>
            <DialogTitle>Upload Supporting Documents</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Upload PAN card, bills, or hospital documents.
              </Typography>
              <Button variant="outlined" component="label">
                Choose File
                <input type="file" hidden />
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDocs(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleUploadDocs}>
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>

        {/* How to do KYC approval */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer", // whole row feels clickable
          }}
          onClick={() => setOpenVideo(true)} // 🔹 Click anywhere in card
        >
          {/* Play Icon */}
          <PlayCircleOutlineIcon color="primary" sx={{ fontSize: 50 }} />

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}
            >
              How to do KYC approval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit Aadhaar/PAN & required KYC documents to get your fundraiser
              approved.
            </Typography>
          </Box>
        </Paper>

        {/* Video Modal */}
        <Dialog
          open={openVideo}
          onClose={() => setOpenVideo(false)}
          maxWidth="md"
          fullWidth
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpenVideo(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent>
            {/* Replace YouTube link here */}
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="KYC Approval Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </DialogContent>
        </Dialog>

        {/* Download App */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <PhoneIphoneIcon color="primary" sx={{ fontSize: 40 }} />{" "}
          {/* Mobile Icon */}
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Download App
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Download Giveaze App
            </Button>
          </Box>
        </Paper>
        {/* Rewards Section */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Rewards
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your campaign, raise ₹5000 and unlock this reward to maintain
            your wellness.
          </Typography>
          <Button
            variant="contained"
            startIcon={<LocalHospitalIcon />}
            sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
          >
            Explore Rewards
          </Button>
        </Paper>
      </Grid>

      {/* Right Stats Panel */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <VisibilityIcon fontSize="large" color="primary" />
              <Typography variant="h6">{views}</Typography>
              <Typography variant="body2" color="text.secondary">
                Views Today
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <FavoriteIcon fontSize="large" color="error" />
              <Typography variant="h6">₹ {raised}</Typography>
              <Typography variant="body2" color="text.secondary">
                Raised
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <GroupsIcon fontSize="large" color="success" />
              <Typography variant="h6">{donors}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Donors
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Beneficiary Details
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            {/* Beneficiary Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {/* Avatar Circle */}
              <Avatar
                sx={{
                  bgcolor: avatarColor,
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {/* {(campaign?.beneficiary || "U").charAt(0).toUpperCase()} */}
                {avatarLetter}
              </Avatar>

              {/* Beneficiary Name */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#333" }}
                >
                  {campaign?.beneficiary || "Unknown Beneficiary"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Beneficiary
                </Typography>
              </Box>
            </Box>

            {/* Location Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {/* Location Circle (same size as Avatar) */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocationOnIcon sx={{ color: "#1976d2", fontSize: 22 }} />
              </Box>

              {/* Location Text */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#333" }}
                >
                  {campaign?.state || "State not specified"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Current Plan: {campaign?.plan || "Bronze"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⚡️ People who upgrade their plan reach their goals 2.5X faster!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
          >
            Insure more family members
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 1, borderRadius: 2, textTransform: "none" }}
          >
            Don’t insure
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Need help? Contact your Fundraiser manager
            <br />
            📞 +91 7676931982 | 📧 info@giveaze.com
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

function ReachAndShareContent({ campaign }) {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState("");

  // ✅ Dynamic fundraiser link based on current browser origin
  const fundraiserLink = `${window.location.origin}/campaign/${campaign?._id}`;

  const shareText = `🙏 Support my fundraiser: ${campaign?.campaign_title}. Every contribution helps! Donate here: ${fundraiserLink}`;

  // ✅ Share Handlers
  const handleWhatsAppShare = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );

  const handleFacebookShare = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fundraiserLink
      )}`,
      "_blank"
    );

  const handleTwitterShare = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fundraiserLink);
    alert("✅ Fundraiser link copied!");
  };

  // ✅ Invite Friend via WhatsApp
  const handleInviteFriend = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `👋 Hey! I’m raising funds for "${campaign?.campaign_title}". Check it out here: ${fundraiserLink}`
      )}`,
      "_blank"
    );

  // ✅ Post New Update Submit
  const handlePostUpdate = () => {
    if (!updateText.trim()) {
      alert("Please write something before posting!");
      return;
    }
    // 🔹 TODO: Call backend API to save fundraiser update
    console.log("Posting update:", updateText);
    setUpdateText("");
    setOpenUpdateModal(false);
    alert("✅ Update posted successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-10 space-y-4 md:space-y-0 md:space-x-4">
      {/* Left Updates Panel */}
      <div className="flex-1">
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            📢 Fundraiser Updates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share updates about your campaign to keep your supporters engaged.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UpdateIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#1976d2",
              ":hover": { bgcolor: "#115293" },
            }}
            onClick={() => setOpenUpdateModal(true)}
          >
            Post New Update
          </Button>
        </Paper>
      </div>

      {/* Right Share & Invite Panel */}
      <div className="w-full md:w-[350px] flex flex-col gap-4">
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🔗 Share Your Fundraiser
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            💡 Fundraisers with frequent shares raise funds faster!
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Share Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppShare}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Share on WhatsApp
            </Button>
            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookShare}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#1877f2",
                ":hover": { bgcolor: "#145dbf" },
              }}
            >
              Share on Facebook
            </Button>
            <Button
              variant="contained"
              startIcon={<TwitterIcon />}
              onClick={handleTwitterShare}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#1da1f2",
                ":hover": { bgcolor: "#0d8ddb" },
              }}
            >
              Share on Twitter
            </Button>

            {/* Copy Link Button */}
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyLink}
              sx={{ borderRadius: 2, textTransform: "none", mt: 1 }}
            >
              Copy Fundraiser Link
            </Button>
          </Box>
        </Paper>

        {/* Invite Friends */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            👥 Invite Friends
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Spread the word and invite your close circle to contribute.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleInviteFriend}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#f59e0b",
              ":hover": { bgcolor: "#d97706" },
            }}
          >
            Invite via WhatsApp
          </Button>
        </Paper>
      </div>

      {/* ✅ Post Update Modal */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Post Fundraiser Update</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Write your update..."
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePostUpdate}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function PayoutsContent({ campaign }) {
  const campaignId = campaign?._id;

  const { data: bankData, refetch } = useGetBankQuery(campaignId, {
    skip: !campaignId,
  });
  const [saveBank] = useSaveBankMutation();
  const [requestWithdrawal] = useRequestWithdrawalMutation();
  const { data: withdrawals = [], isLoading: withdrawalsLoading } =
    useGetWithdrawalsQuery(campaignId, { skip: !campaignId });

  const [bank, setBank] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  });

  const [editing, setEditing] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Prefill form when editing
  useEffect(() => {
    if (editing && bankData?.bank) {
      setBank({
        bank_name: bankData.bank.bank_name || "",
        account_holder_name: bankData.bank.account_holder_name || "",
        account_number: bankData.bank.account_number || "",
        ifsc_code: bankData.bank.ifsc_code || "",
      });
    }
  }, [editing, bankData]);

  // Save Bank Handler
  const handleSaveBank = async () => {
    try {
      await saveBank({ campaignId, body: bank });
      message.success(
        editing ? "✅ Bank details updated!" : "✅ Bank details saved!"
      );

      // Reset form
      setBank({
        bank_name: "",
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
      });
      setEditing(false);
      await refetch();
    } catch (err) {
      message.error("❌ Failed to save bank details");
    }
  };

  // Withdraw Handler
  const handleWithdrawSubmit = async () => {
    try {
      if (!withdrawAmount) {
        message.warning("⚠️ Please enter a withdrawal amount");
        return;
      }
      await requestWithdrawal({ campaignId, body: { amount: withdrawAmount } });
      message.success("💸 Withdrawal requested successfully!");

      // Close dialog and reset amount
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
    } catch (err) {
      message.error("❌ Withdrawal request failed");
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Left Panel */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Total Raised
          </Typography>
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: 700, color: "#d6573d" }}
          >
            ₹ {campaign?.raised_amount?.$numberDecimal || "0"}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Bank Form */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {editing
              ? "Update Beneficiary Bank Details"
              : "Add Beneficiary Bank Details"}
          </Typography>

          <TextField
            label="Bank Name"
            value={bank.bank_name}
            onChange={(e) => setBank({ ...bank, bank_name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Account Holder Name"
            value={bank.account_holder_name}
            onChange={(e) =>
              setBank({ ...bank, account_holder_name: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Account Number"
            value={bank.account_number}
            onChange={(e) =>
              setBank({ ...bank, account_number: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="IFSC Code"
            value={bank.ifsc_code}
            onChange={(e) => setBank({ ...bank, ifsc_code: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={<AccountBalanceIcon />}
            onClick={handleSaveBank}
            sx={{
              textTransform: "none",
              mb: 2,
              bgcolor: "#ffdd04",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#e6c703" },
            }}
          >
            {editing ? "Update Bank Details" : "Save Bank Details"}
          </Button>

          {/* Saved Bank Details */}
          {bankData?.bank && (
            <Box
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
                bgcolor: "#f9f9f9",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Current Bank Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="body1">
                  <strong>Bank Name:</strong> {bankData.bank.bank_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Account Holder:</strong>{" "}
                  {bankData.bank.account_holder_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Account Number:</strong>{" "}
                  {bankData.bank.account_number}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>IFSC Code:</strong> {bankData.bank.ifsc_code}
                </Typography>
              </Box>
              <Chip
                label={bankData.bank.verified ? "Approved" : "Pending"}
                color={bankData.bank.verified ? "success" : "warning"}
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                onClick={() => setEditing(true)}
                startIcon={<EditIcon />}
                fullWidth
              >
                Edit Bank Details
              </Button>
            </Box>
          )}

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Request Withdrawal
          </Typography>
          {bankData?.bank ? (
            <>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  "&:hover": { bgcolor: "#145ea8" },
                }}
                onClick={() => setWithdrawDialogOpen(true)}
              >
                Request Withdrawal
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Add bank details first to request a withdrawal.
            </Typography>
          )}
          {/* </Paper> */}
          {/* </Grid> */}

          {/* Withdrawal Dialog */}
          <Dialog
            open={withdrawDialogOpen}
            onClose={() => setWithdrawDialogOpen(false)}
          >
            <DialogTitle>Request Withdrawal</DialogTitle>
            <DialogContent>
              <TextField
                label="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                type="number"
                fullWidth
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWithdrawDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdrawSubmit} variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>

      {/* Right Panel */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Fund Withdrawal Steps
          </Typography>

          <Box sx={{ mb: 4 }}>
            <UploadFileIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
              Step 1 - Submit Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload PAN, Aadhaar, and Bank proof.
            </Typography>
            <ArrowDownwardIcon sx={{ mt: 2, color: "#999" }} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <VerifiedUserIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
              Step 2 - Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our team verifies your submitted documents.
            </Typography>
            <ArrowDownwardIcon sx={{ mt: 2, color: "#999" }} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <SendIcon color="action" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
              Step 3 - Request Withdrawal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Once verified, submit your withdrawal request.
            </Typography>
            <ArrowDownwardIcon sx={{ mt: 2, color: "#999" }} />
          </Box>

          <Box>
            <DoneAllIcon sx={{ fontSize: 40, color: "#d6573d" }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
              Step 4 - Funds Transferred
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Funds are securely sent to your account.
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Withdrawal History */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mt: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Withdrawal History
          </Typography>
          {withdrawalsLoading ? (
            <Typography>Loading...</Typography>
          ) : withdrawals.length === 0 ? (
            <Typography>No withdrawals yet.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((w) => (
                    <TableRow key={w._id}>
                      <TableCell>
                        {new Date(w.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹ {Number(w.amount)}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            w.status === "Completed"
                              ? "green"
                              : w.status === "Pending"
                              ? "orange"
                              : "red",
                          fontWeight: 600,
                        }}
                      >
                        {w.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>

      {/* Withdraw Modal */}
      <Dialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
      >
        <DialogTitle>Request Withdrawal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Withdrawal Amount"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleWithdrawSubmit}
            sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#145ea8" } }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
function SupportersContent() {
  // Sample data
  const donations = [
    { donor: "John Doe", amount: 500, date: "2025-10-01" },
    { donor: "Jane Smith", amount: 1000, date: "2025-10-02" },
    { donor: "Raj Kumar", amount: 2000, date: "2025-10-03" },
  ];

  const refunds = [
    {
      beneficiary: "Hospital A",
      amount: 1500,
      date: "2025-10-02",
      status: "Processed",
    },
    {
      beneficiary: "John Doe",
      amount: 500,
      date: "2025-10-03",
      status: "Pending",
    },
  ];

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalRefunds = refunds.reduce((sum, r) => sum + r.amount, 0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!dateFilter || donation.date === dateFilter)
  );

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-10 space-y-4 md:space-y-0 md:space-x-4">
      {/* Donations Panel */}
      <div className="flex-1">
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <VolunteerActivismIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Donations
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Quick Stats */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Total Raised:</strong> ₹ {totalRaised}
          </Typography>

          {/* Search + Filter */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              mb: 2,
            }}
          >
            <TextField
              label="Search by Donor"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
            <TextField
              label="Filter by Date"
              type="date"
              variant="outlined"
              size="small"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Donations Table */}
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  <TableCell>Donor Name</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      <TableCell>{donation.donor}</TableCell>
                      <TableCell>₹ {donation.amount}</TableCell>
                      <TableCell>{donation.date}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No donations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#1976d2",
              ":hover": { bgcolor: "#115293" },
            }}
          >
            Export Donations
          </Button>
        </Paper>
      </div>

      {/* Refunds Panel */}
      <div className="flex-1">
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ReplayIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Refunds
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Quick Stats */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Total Refunds:</strong> ₹ {totalRefunds}
          </Typography>

          {/* Refunds Table */}
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  <TableCell>Beneficiary</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refunds.map((refund, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    <TableCell>{refund.beneficiary}</TableCell>
                    <TableCell>₹ {refund.amount}</TableCell>
                    <TableCell>{refund.date}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color:
                            refund.status === "Processed" ? "green" : "orange",
                        }}
                      >
                        {refund.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            startIcon={<CurrencyExchangeIcon />}
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#f59e0b",
              ":hover": { bgcolor: "#d97706" },
            }}
          >
            Request Refund
          </Button>
        </Paper>
      </div>
    </div>
  );
}

function MessagesContent() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      text: "Hi, I donated today!",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "Divakaran S",
      text: "Thank you for your support!",
      time: "10:05 AM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState("John Doe");

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "Divakaran S",
          text: newMessage,
          time: "Now",
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Left Side - Conversations */}
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            height: "80vh",
            overflowY: "auto",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Conversations
          </Typography>
          <TextField
            placeholder="Search messages..."
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  selected={activeChat === msg.sender}
                  onClick={() => setActiveChat(msg.sender)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&.Mui-selected": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#1976d2", color: "white" }}>
                      {msg.sender.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 600 }}>
                        {msg.sender}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {msg.text}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Right Side - Message Thread */}
      <Grid item xs={12} md={8}>
        <Paper
          sx={{
            p: 2,
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              borderBottom: "1px solid #eee",
              pb: 1,
            }}
          >
            <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
              {activeChat.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {activeChat}
            </Typography>
          </Box>

          {/* Chat Body */}
          <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "Divakaran S" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor:
                      msg.sender === "Divakaran S" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === "Divakaran S" ? "white" : "black",
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right", opacity: 0.7 }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Input Area */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ borderRadius: 2 }}
            />
            <IconButton color="default">
              <AttachFileIcon />
            </IconButton>
            <IconButton color="warning">
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
