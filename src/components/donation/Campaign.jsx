import React, { useState, useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useLazyGetCampaignQuery,
  useLoginUserMutation,
  useGetCampaignDonationsQuery,
} from "../../redux/services/campaignApi";
import { useGetDonationsByCampaignQuery } from "../../redux/services/transactionApi";
import { useParams } from "react-router-dom";
import "swiper/css";
import DonationForm from "./DonationForm";
import DonationConfirmModal from "./DonationConfirmModal";
import DonorModal from "./DonorModal"; // Import the modal
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// import c from "dayjs";
// import 'swiper/css/navigation';
import "swiper/css/pagination";
import FAQ from "../FAQAccordian";
import ShareCampaignModal from "./ShareCampaign";
import LoginModel from "../LoginModel";
import { FaUser, FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";
import { CiUser } from "react-icons/ci";
import { IMAGE_BASE_URL } from "../../utils/imageUrl";
import letterColorMap from "../../utils/lettersColor";

// Label Colors
const labelStyles = {
  "Recent Donation": "bg-[#ffdd04] text-grey-100",
  "First Donation": "bg-[#d6573d] text-white",
  "Top Donation": "bg-[#545454] text-white",
};
const CampaignPage = () => {
  // const [currentSlide, setCurrentSlide] = useState(1);
  const [donationuser, setDonationuser] = useState();
  const { id } = useParams();
  const [error, setError] = useState("");

  const [get, { data, error: campaignError, isLoading }] =
    useLazyGetCampaignQuery();

  // const [donationCampaign, setDonationCampaign] =
  //   useGetCampaignDonationsQuery();
  const [images, setImages] = useState([]);
  const [campaign, setCampaign] = useState();

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const target = parseFloat(campaign?.target_amount?.$numberDecimal) || 10000;
  const initial = parseFloat(campaign?.raised_amount?.$numberDecimal) || 0;
  const [amount, setAmount] = useState(initial);
  const storyRef = useRef(null);
  const updatesRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [isDonationModalVisible, setIsDonationModalVisible] = useState(false);
  const [isDonationConfirmVisible, setIsDonationConfirmVisible] =
    useState(false); // NEW

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [shouldTriggerDonation, setShouldTriggerDonation] = useState(false);
  const [isDonation, setIsDonation] = useState(true);
  const [customAmount, setCustomAmount] = useState("");
  const [donationAmount, setDonationAmount] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("top");

  const [visibleDonations, setVisibleDonations] = useState(50);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const {
    data: donationData,
    error: donationError,
    isLoading: donationLoading,
  } = useGetDonationsByCampaignQuery(campaign?._id);
  // Processed donation amounts
  const processedAmounts = (campaign?.donation_amounts || [])
    .map((item) => {
      if (typeof item === "object" && item?.$numberDecimal) {
        return parseFloat(item.$numberDecimal);
      }
      return parseFloat(item); // handles number or string directly
    })
    .filter((num) => !isNaN(num) && num > 0);

  const uniqueSortedAmounts = [...new Set(processedAmounts)].sort(
    (a, b) => a - b
  );

  const openConfirmModal = () => {
    setIsDonationConfirmVisible(true);
  };

  const fallbackAmounts = [500, 1500, 3000];
  const displayAmounts =
    uniqueSortedAmounts.length > 0 ? uniqueSortedAmounts : fallbackAmounts;

  // Pick the "popular" (middle) amount
  const popularAmount =
    displayAmounts.length >= 3
      ? displayAmounts[Math.floor(displayAmounts.length / 2)]
      : displayAmounts[0];

  // 🔥 Ensure donationAmount is always synced with popular when campaign changes
  // useEffect(() => {
  //   if (popularAmount) {
  //     setDonationAmount(popularAmount);
  //     setCustomAmount("");
  //   }
  // }, [popularAmount]);
  // 🔥 Ensure donationAmount is always synced with popular when campaign changes
  useEffect(() => {
    if (popularAmount) {
      setDonationAmount(popularAmount);
      setCustomAmount(popularAmount.toString()); // ✅ Pre-fill input with popular amount
    }
  }, [popularAmount]);

  // Handlers
  const handlePresetClick = (amount) => {
    setDonationAmount(amount);
    setCustomAmount(amount.toString()); // ✅ Autofill input
  };

  const handleOtherClick = () => {
    setDonationAmount("other");
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, ""); // allow only numbers
    setCustomAmount(onlyNums);

    const val = parseInt(onlyNums, 10);

    if (!isNaN(val) && val > 0) {
      setDonationAmount("other"); // keep it as "other" while typing
    } else {
      setDonationAmount("other");
    }
  };

  const finalDonation =
    donationAmount === "other"
      ? parseInt(customAmount, 10) || ""
      : donationAmount || popularAmount;

  useEffect(() => {
    // Listen for profile dropdown changes
    const handleProfileDropdownChange = (event) => {
      setIsProfileDropdownOpen(event.detail);
    };

    window.addEventListener(
      "profileDropdownChange",
      handleProfileDropdownChange
    );

    return () => {
      window.removeEventListener(
        "profileDropdownChange",
        handleProfileDropdownChange
      );
    };
  }, []);
  // useEffect(() => {
  //   if (isProfileDropdownOpen) {
  //     setShowNav(false); // Hide nav menu when profile is open
  //   } else {
  //     setShowNav(true); // Show nav menu when profile is closed
  //   }
  // }, [isProfileDropdownOpen]);

  const handleViewMore = () => {
    setVisibleDonations((prev) => prev + 10); // Load 10 more each time
  };

  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const handleSliderChange = (e) => {
    setAmount(parseInt(e.target.value, 10));
  };
  const openShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);
  const minAmount = parseInt(
    campaign?.minimum_amount?.$numberDecimal || 100,
    10
  );

  const [filter, setFilter] = useState("all");
  // Sorting logic
  const [donations, setDonations] = useState([]);
  useEffect(() => {
    if (!donationData || !Array.isArray(donationData)) return;

    const successfulDonors = donationData.filter(
      (donation) => donation.payment_status === "successful"
    );

    const transformed = successfulDonors.map((d) => {
      const isAnonymous = d.is_anonymous;
      const name = isAnonymous
        ? "Anonymous"
        : d.user_id?.full_name || "Anonymous";

      const firstLetter = name.charAt(0).toUpperCase();
      const colors = letterColorMap[firstLetter] || {
        bgColor: "#E0E0E0",
        textColor: "#424242",
      };

      return {
        id: d._id,
        name,
        firstLetter,
        bgColor: colors.bgColor,
        textColor: colors.textColor,
        date: d.donated_date,
        amount: parseFloat(d.total_amount?.$numberDecimal || "0"),
      };
    });

    setDonations(transformed);
  }, [donationData]);
  const sortedByDate = [...donations].sort((a, b) =>
    dayjs(b.date).diff(dayjs(a.date))
  );
  const sortedByAmount = [...donations].sort((a, b) => b.amount - a.amount);

  const labelMap = new Map();

  const labelCandidates = [
    { donor: sortedByDate[0], label: "Recent Donation" },
    { donor: sortedByAmount[0], label: "Top Donation" },
    { donor: sortedByDate[sortedByDate.length - 1], label: "First Donation" },
  ];
  // const seenDonorIds = new Set();
  // const uniqueDonations = [];

  // for (const { donor, label } of labelCandidates) {
  //   if (donor && !seenDonorIds.has(donor.id)) {
  //     seenDonorIds.add(donor.id);
  //     uniqueDonations.push({ donor, label });
  //   }
  // }

  // // Ensure 3 cards always by filling with other donors (if needed)
  // if (uniqueDonations.length < 3) {
  //   const remaining = donations.filter((d) => !seenDonorIds.has(d.id));
  //   for (let i = 0; i < remaining.length && uniqueDonations.length < 3; i++) {
  //     uniqueDonations.push({
  //       donor: remaining[i],
  //       label: `Top Donation`, // or "Supporter", etc.
  //     });
  //   }
  // }
  // console.log(uniqueDonations);

  // const uniqueDonations = [
  //   { donor: recentDonation, label: "Recent Donation" },
  //   { donor: firstDonation, label: "First Donation" },
  //   { donor: topDonation, label: "Top Donation" },
  // ].filter(
  //   (item, index, self) =>
  //     self.findIndex(
  //       (i) => i.donor?.id === item.donor?.id && i.label !== item.label
  //     ) === index
  // );

  // const sortedDonations = [...mockDonations].sort((a, b) =>
  //   dayjs(b.date).diff(dayjs(a.date))
  // );

  // const sortedByAmount = [...mockDonations].sort((a, b) => b.amount - a.amount);
  // const sortedByDate = [...mockDonations].sort((a, b) =>
  //   dayjs(b.date).diff(dayjs(a.date))
  // );

  // const recentDonation = sortedDonations[0]; // Most recent donation
  // const firstDonation = sortedDonations[sortedDonations.length - 1]; // First donor
  // const topDonation = [...mockDonations].sort((a, b) => b.amount - a.amount)[0]; // Highest donation
  // const { data: donations, error, isLoading } = useGetCampaignDonationsQuery({ campaignId: campaign?._id, filter: "top" });

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeDonationModal = () => {
    setIsDonationConfirmVisible(true);
    setIsDonationModalVisible(false);
    setIsDonation(false);
    // window.location.reload();
  };

  // Handle scroll to show nav after user scrolls down
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     if (scrollPosition > 300) {
  //       setShowNav(true);
  //     } else {
  //       setShowNav(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Only show nav if user scrolled past 300px and profile dropdown is closed
      if (scrollPosition > 300 && !isProfileDropdownOpen) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProfileDropdownOpen]);

  // In CampaignPage
  useEffect(() => {
    const handler = (e) => setShowNav(!e.detail); // hide tab if menu open
    window.addEventListener("mobileMenuToggle", handler);
    return () => window.removeEventListener("mobileMenuToggle", handler);
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      setShowNav(true); // Ensure nav is visible
      const yOffset = -120; // Increased offset to fully show heading
      const y =
        ref.current.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (id) {
      get(id); // fetch when ID is available
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      setCampaign(data?.data?.campaign);
    }
  }, [data]);

  useEffect(() => {
    if (campaign) {
      setImages(campaign.other_pictures);
    }
  }, [campaign]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shareCampaign = () => {
    const campaignUrl = window.location.href; // Current page URL
    const campaignTitle = campaign?.campaign_title || "Campaign Title";
    const shareText = `Check out this campaign: ${campaignTitle}`;

    const socialMediaUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        campaignUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        campaignUrl
      )}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        campaignUrl
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + campaignUrl
      )}`,
    };

    // Open a prompt for the user to select the platform to share
    const sharePlatform = prompt(
      "Share on: Facebook, Twitter, LinkedIn, WhatsApp"
    ).toLowerCase();
    if (socialMediaUrls[sharePlatform]) {
      window.open(
        socialMediaUrls[sharePlatform],
        "_blank",
        "width=600,height=400"
      );
    } else {
      alert(
        "Platform not supported or incorrect input. Please try: Facebook, Twitter, LinkedIn, WhatsApp."
      );
    }
  };

  // const campaign =  || {};

  // const images =   [campaign?.main_picture , ...campaign?.other_pictures]
  // const [isDonationModalVisible, setIsDonationModalVisible] = useState(false);
  // const openDonationModal = () => {
  //   if (user?.mobile_number) {
  //     setIsDonationModalVisible(true);
  //   } else {
  //     setIsLoginModalVisible(true);
  //   }
  // };
  const openDonationModal = () => {
    // Directly open the donation modal without login check
    setIsDonationModalVisible(true);
  };

  // const closeDonationModal = () => {
  //   setIsDonationModalVisible(false);
  // };
  const paginationRef = useRef(null);
  const [showFullStory, setShowFullStory] = useState(false);
  const [showFullUpdates, setShowFullUpdates] = useState(false);

  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.classList.add("custom-swiper-pagination");
    }
  }, [paginationRef]);

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Support this campaign!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.log("Sharing failed", err));
    } else {
      alert(
        "Sharing is only available on mobile devices with supported browsers."
      );
    }
  };
  useEffect(() => {
    if (user?.mobile_number) {
      setDonationuser(user);
    }
  }, [user]);
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);
  // Utility: Extract image URLs from HTML
  const extractImagesFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img")).map((img) => img.src);
  };

  // Utility: Remove images from HTML
  const removeImagesFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("img").forEach((img) => img.remove());
    return doc.body.innerHTML;
  };
  return (
    <div className="w-full lg:w-[1300px] mx-auto p-4 mt-12 ">
      <div className="text-left hidden md:block">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold break-words text-gray-900 mb-6 px-4">
          {campaign?.campaign_title || "Campaign Title"}
        </h1>
      </div>
      {/* Badges Section */}
      <div className="flex gap-2 mt-2">
        {campaign?.is_validated && (
          <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            ✅ Validated
          </span>
        )}

        {campaign?.is_tax && (
          <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            💰 Tax Benefit
          </span>
        )}
      </div>

      {/* Top Title Section */}
      {/* <div className="text-center my-4">
        <h1 className="text-[20px] capitalize md:text-2xl font-bold">
          {campaign?.campaign_title || "Campaign Title"}
        </h1> */}
      {/* <p className="text-blue-600 mt-2">
          Campaign by
          <span className="font-bold ml-1">
            {campaign?.ngo_name || "Organizer"}
          </span>
        </p> */}
      {/* <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm mt-4">
          {campaign?.beneficiary || "Category"}
        </span> */}
      {/* </div> */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 min-h-screen md:px-4 bg-white">
        {/* Left Column - Images & Content */}
        <div className="md:col-span-3">
          {/* Image Carousel */}
          {/* Mobile Full-Width Carousel */}
          <div className="block md:hidden w-screen -mx-4">
            {campaign?.other_pictures?.length > 0 ? (
              <>
                <Swiper
                  slidesPerView={1}
                  navigation={true}
                  pagination={{
                    clickable: true,
                    el: ".custom-swiper-pagination-mobile",
                    bulletClass: "swiper-pagination-bullet custom-bullet",
                    bulletActiveClass:
                      "swiper-pagination-bullet-active custom-bullet-active",
                  }}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  loop
                  speed={1000}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="w-full"
                >
                  {campaign?.other_pictures?.map((image, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={
                          image?.startsWith("/images/")
                            ? `${IMAGE_BASE_URL}${image}`
                            : image
                        }
                        alt={`Slide ${i + 1}`}
                        className="w-full h-[260px] object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="custom-swiper-pagination-mobile flex justify-center gap-1 mt-3"></div>
              </>
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}
          </div>

          {/* Desktop Carousel inside grid */}
          <div className="hidden md:block relative w-full rounded-lg overflow-hidden">
            {campaign?.other_pictures?.length > 0 ? (
              <>
                <Swiper
                  slidesPerView={1}
                  navigation={true}
                  pagination={{
                    clickable: true,
                    el: ".custom-swiper-pagination-desktop",
                    bulletClass: "swiper-pagination-bullet custom-bullet",
                    bulletActiveClass:
                      "swiper-pagination-bullet-active custom-bullet-active",
                  }}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  loop
                  speed={1000}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="w-full"
                >
                  {campaign?.other_pictures?.map((image, i) => (
                    <SwiperSlide key={i} className="relative group">
                      <img
                        src={
                          image?.startsWith("/images/")
                            ? `${IMAGE_BASE_URL}${image}`
                            : image
                        }
                        alt={`Slide ${i + 1}`}
                        className="w-full h-[380px] object-cover rounded"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="custom-swiper-pagination-desktop flex justify-center gap-1 mt-3"></div>
              </>
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}
          </div>

          <div className="w-full  bg-white backdrop-blur-md px-0.5 p-2 rounded-lg text-center md:hidden">
            {/* Mobile-only Title */}
            <div className="text-left mt-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900">
                {campaign?.campaign_title || "Campaign Title"}
              </h1>
            </div>

            {/* <div className="text-center my-2">
              <h1 className="text-[20px] capitalize md:text-2xl font-bold mb-4">
                {campaign?.campaign_title || "Campaign Title"}
              </h1>
            </div> */}
            <div className="border p-6 border-gray-500 rounded-xl">
              <div className="w-full">
                <div className="flex justify-center items-center mb-1">
                  {/* <div className="flex items-center gap-1"> */}
                  {/* <h2 className="text-3xl font-extrabold text-[#d8573e] animate-pulse">
                      ₹ {campaign?.raised_amount?.$numberDecimal || "0"}{" "}
                    </h2>
                    <h4 className="text-gray-600 ml-2">Raised</h4> */}
                  {/* ₹ symbol */}
                  {/* <span className="text-4xl font-extrabold animate-pulse text-[#d8573e]">
      ₹
    </span> */}

                  {/* Editable input */}
                  {/* <input
      type="number"
      placeholder="0"
      value={amount === "" ? "" : amount}
      min="0"
      max="250000"
      onChange={(e) => {
        const value = e.target.value;
        if (value === "") {
          setAmount("");
        } else if (parseInt(value) <= 250000) {
          setAmount(parseInt(value));
        } else {
          setAmount(250000);
        }
      }}
      inputMode="numeric"
      className="py-2 text-4xl font-extrabold text-[#d8573e] text-left bg-transparent focus:outline-none animate-pulse appearance-none 
      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
      [-moz-appearance:textfield]"
      style={{
        width: `${(amount.toString().length || 1) * 1.2}ch`, // grows with length
        transition: 'width 0.2s ease'
      }}
    /> */}
                  {/* </div> */}
                </div>
              </div>
              {/* <div className="items-center mt-2"> */}
              {/* <p className="text-gray-700 font-semibold text-lg">
                Raised of ₹{target}
              </p>
              <p className="text-gray-700 font-semibold text-lg">
                {campaign?.donors_count || 0} donors
              </p> */}
              {/* </div> */}
              <div className="mt-1">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {Math.round(
                      (Math.round(campaign?.raised_amount?.$numberDecimal) /
                        Math.round(campaign?.target_amount?.$numberDecimal)) *
                        100
                    ) || 0}
                    %
                  </span>
                  <span>{donations.length} Donors</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (Math.round(
                            campaign?.raised_amount?.$numberDecimal || 0
                          ) /
                            Math.round(
                              campaign?.target_amount?.$numberDecimal || 1
                            )) *
                            100
                        )
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="font-semibold text-[16px] text-gray-800">
                    ₹{campaign?.raised_amount?.$numberDecimal || "0"} Raised
                  </span>

                  <span>Goal ₹{target}</span>
                </div>
              </div>
            </div>
            {/* Amount Input (Always Visible - Mobile Styled Like Desktop) */}
            <div className="w-full flex flex-col mt-2">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Amount (INR)
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter the amount"
                className={`w-full rounded-lg p-3 text-base text-left text-gray-700 
      focus:outline-none focus:ring-2
      ${
        error
          ? "border border-red-500 focus:ring-red-400"
          : "border border-gray-500 focus:border-[#ffdd04] focus:ring-[#ffdd04]"
      }`}
                value={`₹${customAmount}`}
                onChange={(e) => {
                  let onlyNums = e.target.value.replace(/\D/g, "");

                  if (onlyNums === "") {
                    onlyNums = "0";
                  }

                  if (customAmount === "0" && onlyNums.length > 1) {
                    onlyNums = onlyNums.slice(-1);
                  }

                  setCustomAmount(onlyNums);

                  // ✅ Error only when below minAmount
                  if (parseInt(onlyNums, 10) < minAmount) {
                    setError(`Minimum amount for donation is INR ${minAmount}`);
                  } else {
                    setError("");
                  }

                  setDonationAmount("other"); // mark as custom when editing
                }}
              />

              {/* ✅ Left-aligned error message */}

              {error && (
                <p className="text-sm text-red-500 mt-2 text-left">{error}</p>
              )}
            </div>

            {/* Donation Amounts */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 mb-4"> */}
            {/* Donation Amounts (Mobile) */}
            <div className="grid grid-cols-3 gap-3 mt-6 mb-4">
              {displayAmounts.map((amount) => (
                <div key={amount} className="relative">
                  {popularAmount === amount && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-white text-[10px] font-semibold bg-[#d8573e] px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                  <button
                    className={`p-3 rounded-lg text-sm w-full font-medium transition
          ${
            donationAmount === amount
              ? "bg-[#fceeea] text-black"
              : "border border-gray-400 text-gray-700"
          }`}
                    onClick={() => {
                      handlePresetClick(amount);
                      setCustomAmount(amount.toString());
                    }}
                  >
                    ₹{amount}
                  </button>
                </div>
              ))}
            </div>

            {/* Divider */}
            {/* <div className="w-full flex items-center my-6">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div> */}

            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 mb-4">
              {displayAmounts.map((amount) => (
                <div key={amount} className="relative">
                  {popularAmount === amount && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-black text-[10px] font-semibold bg-[#ffdd04] px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                  <button
                    className={`p-2 rounded-lg text-sm w-full font-medium transition ${
                      donationAmount === amount
                        ? "bg-[#ffdd04] text-black shadow-md"
                        : popularAmount === amount
                        ? "border border-[#ffdd04] text-[#d97706]"
                        : "border border-gray-400 text-gray-700"
                    }`}
                    onClick={() => handlePresetClick(amount)}
                  >
                    ₹ {amount}
                  </button>
                </div>
              ))} */}

            {/* Other Option */}
            {/* <div className="relative w-full">
                <button
                  className={`p-2 rounded-lg text-sm w-full font-medium transition ${
                    donationAmount === "other"
                      ? "bg-[#ffdd04] text-black shadow-md"
                      : "border border-gray-400 text-gray-700"
                  }`}
                  onClick={handleOtherClick}
                >
                  Other
                </button>

                {donationAmount === "other" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={`Min ₹${minAmount}`}
                      className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                        error
                          ? "border-red-500 focus:ring-red-400"
                          : "focus:ring-[#ffdd04]"
                      }`}
                      value={customAmount}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, ""); // allow only numbers
                        setCustomAmount(onlyNums);

                        // don't set donationAmount to number yet, keep it "other" while typing
                        if (onlyNums === "") {
                          setError("");
                        } else if (parseInt(onlyNums, 10) < minAmount) {
                          setError(
                            `Minimum donation amount is INR ${minAmount}`
                          );
                        } else {
                          setError("");
                        }
                      }}
                    />
                    {error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                )}
              </div>
            </div> */}

            {/* Donate Button */}
            {/* <div className="mt-6">
              <button
                onClick={openDonationModal}
                className="bg-[#b3e5fc] text-blue-500 font-bold text-sm px-3 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-110 hover:bg-blue-500 group animate-bounce"
              >
                <span className="group-hover:text-white transition duration-300">
                  💙 DONATE NOW
                </span>
              </button>
            </div> */}

            {/* Share Section */}
            <div className="mt-4 flex flex-col items-center">
              {/* <p className="text-gray-500 text-sm">Want to spread the word?</p> */}
              <button
                onClick={handleNativeShare}
                className="mt-2 text-blue-700 px-2 bg-blue-50 rounded-full font-semibold hover:underline hover:text-blue-900 transition duration-200"
              >
                Share this Campaign
              </button>
            </div>
          </div>
          <div className="w-full bg-white backdrop-blur-md p-4 md:p-6 mt-4  block md:hidden rounded-lg border border-gray-200">
            <div className="max-w-md md:max-w-none mx-auto">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                Campaign Details
              </h3>
              <hr className="my-3" />

              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="bg-yellow-500 text-white uppercase w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-full font-bold ">
                    {campaign?.ngo_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold capitalize md:text-lg">
                      {campaign?.beneficiary || "NGO Name"}
                    </p>
                    <p className="text-gray-500 text-sm">Beneficiary</p>
                  </div>
                </li>

                <li className="flex items-center space-x-3">
                  <div className="bg-green-500 text-white uppercase w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-full font-bold ">
                    {campaign?.state?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold capitalize md:text-lg">
                      {campaign?.state}
                    </p>
                    <p className="text-gray-500 text-sm">Location</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Description Section */}
          {/* Story & Updates Section */}
          {/* Story Section */}
          <div ref={storyRef} className="bg-white rounded-xl shadow-md mt-4">
            <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
              Story
            </h3>
            <div className="text-gray-700 p-2 leading-snug">
              {campaign?.campaign_description &&
                (() => {
                  const html = campaign?.campaign_description;
                  const imageMatch = html.match(/<img[^>]+>/);
                  const imageTag = imageMatch ? imageMatch[0] : "";
                  const [beforeImage, afterImage] = imageMatch
                    ? html.split(imageMatch[0])
                    : [html, ""];

                  if (imageTag) {
                    return (
                      <>
                        <div
                          dangerouslySetInnerHTML={{ __html: beforeImage }}
                        />
                        <div
                          dangerouslySetInnerHTML={{ __html: imageTag }}
                          className="my-4"
                        />
                        <AnimatePresence>
                          {showFullStory && (
                            <motion.div
                              key="storyContent"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div
                                dangerouslySetInnerHTML={{ __html: afterImage }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button
                          onClick={() => setShowFullStory(!showFullStory)}
                          className="text-blue-500 mt-3 underline block text-center"
                        >
                          {showFullStory ? "Show Less" : "Read More"}
                        </button>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <AnimatePresence initial={false}>
                          <motion.div
                            key={showFullStory ? "full" : "short"}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: showFullStory
                                  ? html
                                  : html.slice(0, 300) + "...",
                              }}
                            />
                          </motion.div>
                        </AnimatePresence>
                        <button
                          onClick={() => setShowFullStory(!showFullStory)}
                          className="text-blue-500 mt-3 underline block text-center"
                        >
                          {showFullStory ? "Show Less" : "Read More"}
                        </button>
                      </>
                    );
                  }
                })()}
            </div>
            {/* Updates Section */}
            {/* <div
              ref={updatesRef}
              className="bg-white rounded-xl shadow-md mt-6"
            >
              <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
                Updates
              </h3>
              <div className="text-gray-700 p-2 leading-snug">
                {campaign?.story ? (
                  <>
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={showFullUpdates ? "full" : "short"}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: showFullUpdates
                              ? campaign.story
                              : campaign.story.slice(0, 300) + "...",
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                    <button
                      onClick={() => setShowFullUpdates(!showFullUpdates)}
                      className="text-blue-500 mt-3 underline block text-center"
                    >
                      {showFullUpdates ? "Show Less" : "Read More"}
                    </button>
                  </>
                ) : (
                  "No updates available."
                )}
              </div>
            </div> */}
            <div
              ref={updatesRef}
              className="bg-white rounded-xl shadow-md mt-6"
            >
              <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
                Updates
              </h3>

              <div className="text-gray-700 p-2 leading-snug">
                {campaign?.story ? (
                  <>
                    {/* Swiper Slider for Images */}
                    {extractImagesFromHTML(campaign.story).length > 0 && (
                      <Swiper
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }} // ✅ autoplay config
                        loop={true} // Optional: enables infinite loop
                        className=" rounded-xl mb-4"
                      >
                        {extractImagesFromHTML(campaign.story).map(
                          (src, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-auto object-contain rounded-md"
                              />
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>
                    )}

                    {/* Story Text Content (without images) */}
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={showFullUpdates ? "full" : "short"}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: showFullUpdates
                              ? removeImagesFromHTML(campaign.story)
                              : removeImagesFromHTML(campaign.story).slice(
                                  0,
                                  300
                                ) + "...",
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    <button
                      onClick={() => setShowFullUpdates(!showFullUpdates)}
                      className="text-blue-500 mt-3 underline block text-center"
                    >
                      {showFullUpdates ? "Show Less" : "Read More"}
                    </button>
                  </>
                ) : (
                  "No updates available."
                )}
              </div>
            </div>
          </div>

          {/* Mobile Nav Tabs shown only after scrolling */}
          {showNav && !isProfileDropdownOpen && (
            <div className="md:hidden fixed top-16 left-4 right-4 mx-auto bg-white rounded-md	 shadow-md flex justify-around py-2 z-50 border border-gray-200 transition duration-300">
              <button
                onClick={() => scrollToSection(storyRef)}
                className="text-sm font-semibold text-[#d8573e] px-4 py-1 hover:bg-[#d8573e]/10 rounded-full transition"
              >
                Story
              </button>
              <button
                onClick={() => scrollToSection(updatesRef)}
                className="text-sm font-semibold text-[#d8573e] px-4 py-1 hover:bg-[#d8573e]/10 rounded-full transition"
              >
                Updates
              </button>
            </div>
          )}

          {/* Video Section */}
          {campaign?.video_link && (
            <div
              dangerouslySetInnerHTML={{ __html: campaign?.video_link }}
              className="w-full h-[200px] md:h-[380px] mt-6 rounded-lg overflow-hidden shadow-lg transition-all"
            />
          )}
          {/* Mobile: Show Donor List First | Desktop: Right Column */}
          <div className="w-full bg-white backdrop-blur-md p-4 mt-10 rounded-lg border border-gray-200 md:hidden">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {donations.length} Donations
            </h3>
            <hr className="my-3" />
            <ul className="space-y-6">
              {labelCandidates.map(({ donor, label }) => {
                const name = donor?.name || "Anonymous";
                const firstLetter = name.charAt(0).toUpperCase();
                const colors = letterColorMap[firstLetter] || {
                  bgColor: "#E0E0E0",
                  textColor: "#424242",
                };

                return (
                  <li
                    key={donor?.id || label}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 flex justify-center items-center rounded-full shadow-md overflow-hidden"
                        style={{ backgroundColor: colors.bgColor }}
                      >
                        <span
                          style={{ color: colors.textColor }}
                          className="font-bold text-lg uppercase"
                        >
                          {firstLetter}
                        </span>
                      </div>
                      {/* Name and Donation Info */}
                      <div>
                        <p className="text-gray-900 font-semibold capitalize">
                          {name}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-semibold text-[#d8573e] w-[100px] text-left">
                            ₹{donor?.amount || 0}
                          </p>
                          <span
                            className={`text-xs px-1 rounded ${labelStyles[label]}`}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Buttons */}
            <div className="flex mt-8 w-full text-sm">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("top");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "top" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View Top Donations
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("all");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "all" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View All Donations
              </button>
            </div>
          </div>

          <div className="lg:w-2/3 order-2 lg:order-1"></div>

          {/* FAQ Section */}

          <div className="bg-white md:p-2 rounded-xl shadow-md mt-10">
            <h3 className="text-2xl text-center  font-semibold">FAQs</h3>
            <FAQ />
          </div>
        </div>
        {/* Right Column*/}
        <div
          className="md:col-span-2 flex flex-col items-center justify-start"
          style={{
            position: "sticky",
            top: "10px", // Reduced from 70px
            alignSelf: "start", // Ensures it doesn't stretch
          }}
        >
          {/* Donation Card */}
          <div className="w-full bg-white backdrop-blur-md p-2 rounded-lg text-center hidden md:block border border-gray-200">
            {/* <div className="text-start">
              <h1 className="text-[10px] capitalize md:text-xl font-bold mb-4 break-words text-center max-w-full">
                {campaign?.campaign_title || "Campaign Title"}
              </h1>
            </div> */}
            <div className="border p-6 border-gray-300 rounded-xl">
              <div className="w-full">
                {/* <div className="flex justify-center items-center mb-2 mt-2">
                  <h2 className="text-4xl font-extrabold text-[#d8573e] animate-pulse">
                    ₹ {campaign?.raised_amount?.$numberDecimal || "0"}
                  </h2>
                  <h4 className="text-gray-600 ml-2">Raised</h4> */}
                {/* <h4 className="ml-2">Raised</h4> */}
                {/* Editable input */}
                {/* <input
      type="number"
      placeholder="0"
      value={amount === "" ? "" : amount}
      min="0"
      max="250000"
      onChange={(e) => {
        const value = e.target.value;
        if (value === "") {
          setAmount("");
        } else if (parseInt(value) <= 250000) {
          setAmount(parseInt(value));
        } else {
          setAmount(250000);
        }
      }}
      inputMode="numeric"
      className="py-2 text-4xl font-extrabold text-[#d8573e] text-left bg-transparent focus:outline-none animate-pulse appearance-none 
      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
      [-moz-appearance:textfield]"
      style={{
        width: `${(amount.toString().length || 1) * 1.2}ch`, // grows with length
        transition: 'width 0.2s ease'
      }}
    />*
  </div> */}
                {/* </div> */}
                <div className="mt-1">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {Math.round(
                        (Math.round(campaign?.raised_amount?.$numberDecimal) /
                          Math.round(campaign?.target_amount?.$numberDecimal)) *
                          100
                      ) || 0}
                      %
                    </span>
                    <span>{donations.length} Donors</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (Math.round(
                              campaign?.raised_amount?.$numberDecimal || 0
                            ) /
                              Math.round(
                                campaign?.target_amount?.$numberDecimal || 1
                              )) *
                              100
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 my-1">
                    {/* <span>200 Donations</span> */}
                    <span className="font-semibold text-lg text-gray-800">
                      ₹{campaign?.raised_amount?.$numberDecimal || "0"} Raised
                    </span>

                    <span>Goal ₹{target}</span>
                  </div>
                </div>
              </div>
              {/* Raised of Target */}
              {/* <div className="items-center mt-2">
                <p className="text-gray-700 font-semibold text-lg">
                  Raised of ₹{target}
                </p>
                <p className="text-gray-700 font-semibold 700 text-lg">
                  {campaign?.donors_count || 0} donors
                </p>
              </div> */}

              {/* Custom Slider */}
              {/* <div className="relative w-full">
        <input
          type="range"
          min="0"
          max={target}
          value={amount}
          onChange={handleSliderChange}
          className="w-full h-2 appearance-none bg-gray-200 rounded-full"
          style={{ WebkitAppearance: "none" }}
        /> */}
              {/* Custom Heart Icon as handle */}
              {/* <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{
            left: `${(amount / target) * 100}%`,
          }}
        >
          <div className="w-8 h-8 bg-[#001f3f] rounded-full flex items-center justify-center shadow-lg">
            <img
              src="https://d2aq6dqxahe4ka.cloudfront.net/themes/neumorphism/images/igf/commonDonate/heart-icon.svg"
              alt="Heart Icon"
              className="w-4 h-4"
            />
          </div> */}
              {/* </div> */}
            </div>
            {/* Amount Input (Always Visible) */}
            <div className="w-full flex flex-col mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Amount (INR)
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter the amount"
                className={`w-full rounded-lg p-3 text-base text-left text-gray-700 
      focus:outline-none focus:ring-2
      ${
        error
          ? "border border-red-500 focus:ring-red-400"
          : "border border-gray-500 focus:border-[#ffdd04] focus:ring-[#ffdd04]"
      }`}
                value={`₹${customAmount}`}
                onChange={(e) => {
                  let onlyNums = e.target.value.replace(/\D/g, "");

                  if (onlyNums === "") {
                    onlyNums = "0";
                  }

                  if (customAmount === "0" && onlyNums.length > 1) {
                    onlyNums = onlyNums.slice(-1);
                  }

                  setCustomAmount(onlyNums);

                  // ✅ Error only when below minAmount
                  if (parseInt(onlyNums, 10) < minAmount) {
                    setError(`Minimum amount for donation is INR ${minAmount}`);
                  } else {
                    setError("");
                  }

                  setDonationAmount("other");
                }}
              />

              {/* ✅ Left-aligned error */}
              {error && (
                <p className="text-sm text-red-500 mt-2 text-left">{error}</p>
              )}
            </div>

            {/* Donation Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 mb-4 w-full">
              {displayAmounts.map((amount) => (
                <div key={amount} className="relative">
                  {popularAmount === amount && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-black text-[10px] text-white font-semibold bg-[#d8573e] px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                  <button
                    type="button"
                    className={`p-3 rounded-lg text-sm w-full font-medium transition 
          ${
            donationAmount === amount
              ? "bg-[#fceeea] text-black"
              : popularAmount === amount
              ? "border border-gray-400"
              : "border border-gray-400 text-gray-700"
          }`}
                    onClick={() => {
                      setDonationAmount(amount);
                      setCustomAmount(amount.toString());

                      // ✅ Keep error logic when preset selected
                      if (parseInt(amount, 10) < minAmount) {
                        setError(
                          `Minimum amount for donation is INR ${minAmount}`
                        );
                      } else {
                        setError("");
                      }
                    }}
                  >
                    ₹{amount}
                  </button>
                </div>
              ))}
            </div>

            {/* Donation Amounts */}
            {/* Amount Input (Always Visible) */}
            {/* <div className="w-full flex flex-col items-center mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Amount (INR)
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter the amount"
                className={`w-full rounded-lg p-2 text-md text-left text-gray-700 
      focus:outline-none focus:ring-2
      ${
        error
          ? "border border-red-500 focus:ring-red-400"
          : "border border-gray-500 focus:border-[#ffdd04] focus:ring-[#ffdd04]"
      }`}
                value={`₹${customAmount}`}
                onChange={(e) => {
                  let onlyNums = e.target.value.replace(/\D/g, ""); // keep only digits

                  // ✅ If field is cleared, default to 0
                  if (onlyNums === "") {
                    onlyNums = "0";
                  }

                  // ✅ If current value is "0" and user types another digit, replace it
                  if (customAmount === "0" && onlyNums.length > 1) {
                    onlyNums = onlyNums.slice(-1); // keep only the new digit
                  }

                  setCustomAmount(onlyNums);

                  // ✅ Error only if less than minAmount
                  if (parseInt(onlyNums, 10) < minAmount) {
                    setError(`Minimum amount for donation is INR ${minAmount}`);
                  } else {
                    setError("");
                  }

                  setDonationAmount("other"); // mark as custom when editing
                }}
              /> */}

            {/* ✅ Show error only when below minAmount */}
            {/* {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div> */}

            {/* Donation Amounts */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 mb-4">
              {displayAmounts.map((amount) => (
                <div key={amount} className="relative">
                  {popularAmount === amount && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-black text-[10px] font-semibold bg-[#ffdd04] px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                  <button
                    className={`p-2 rounded-lg text-sm w-full font-medium transition ${
                      donationAmount === amount
                        ? "bg-[#ffdd04] text-black shadow-md"
                        : popularAmount === amount
                        ? "border border-[#ffdd04] text-[#d97706]"
                        : "border border-gray-400 text-gray-700"
                    }`}
                    onClick={() => {
                      handlePresetClick(amount);
                      setCustomAmount(amount.toString()); // ✅ Update input field when preset selected
                    }}
                  >
                    ₹ {amount}
                  </button>
                </div>
              ))}
            </div> */}
            {/* Divider */}
            {/* <div className="w-full flex items-center my-6">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div> */}

            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 mb-4">
              {displayAmounts.map((amount) => (
                <div key={amount} className="relative">
                  {popularAmount === amount && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-black text-[10px] font-semibold bg-yellow-300 px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                  <button
                    className={`p-2 rounded-lg text-sm w-full font-medium transition ${
                      donationAmount === amount
                        ? "bg-[#ffdd04] text-black shadow-md"
                        : popularAmount === amount
                        ? "border border-[#ffdd04] text-[#d97706]"
                        : "border border-gray-400 text-gray-700"
                    }`}
                    onClick={() => handlePresetClick(amount)}
                  >
                    ₹ {amount}
                  </button>
                </div>
              ))} */}
            {/* Other Option */}
            {/* <div className="relative w-full">
                <button
                  className={`p-2 rounded-lg text-sm w-full font-medium transition ${
                    donationAmount === "other"
                      ? "bg-[#ffdd04] text-black shadow-md"
                      : "border border-gray-400 text-gray-700"
                  }`}
                  onClick={handleOtherClick}
                >
                  Other
                </button>

                {donationAmount === "other" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={`Min ₹${minAmount}`}
                      className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                        error
                          ? "border-red-500 focus:ring-red-400"
                          : "focus:ring-[#ffdd04]"
                      }`}
                      value={customAmount}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, ""); // allow only numbers
                        setCustomAmount(onlyNums);

                        // don't set donationAmount to number yet, keep it "other" while typing
                        if (onlyNums === "") {
                          setError("");
                        } else if (parseInt(onlyNums, 10) < minAmount) {
                          setError(
                            `Minimum donation amount is INR ${minAmount}`
                          );
                        } else {
                          setError("");
                        }
                      }}
                    />
                    {error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                )}
              </div>
            </div> */}

            {/* Donate Button */}
            {campaign?.is_approved === true && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    if (donationAmount === "other") {
                      const val = parseInt(customAmount, 10);
                      if (isNaN(val) || val < minAmount) {
                        // ✅ Auto-reset to min amount
                        setCustomAmount(minAmount.toString());
                        setDonationAmount(minAmount);
                        setError("");
                      }
                    }
                    openDonationModal();
                  }}
                  disabled={!finalDonation || finalDonation <= 0}
                  className="bg-[#d8573e] text-white font-bold text-sm px-32 py-3 rounded-full transition duration-300 transform hover:scale-110 hover:bg-[#c85139] focus:outline-none focus:ring-2 focus:ring-[#d8573e]"
                >
                  <span className="group-hover:text-white transition duration-300">
                    DONATE ₹ {finalDonation || popularAmount}
                  </span>
                </button>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-6 flex flex-col items-center">
              {/* <p className="text-gray-500 text-sm">Want to spread the word?</p> */}
              <button
                onClick={handleNativeShare}
                className="mt-2 text-blue-700 px-2 bg-blue-50 rounded-full font-semibold hover:underline hover:text-blue-900 transition duration-200"
              >
                Share this Campaign
              </button>
            </div>
          </div>
          {/* Campaign Details */}
          <div className="w-full bg-white backdrop-blur-md p-4 hidden md:block mt-10 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Campaign Details
            </h3>
            <hr className="my-3" />

            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="bg-yellow-500 text-white uppercase w-10 h-10 flex justify-center items-center rounded-full font-bold">
                  {campaign?.ngo_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold capitalize">
                    {campaign?.beneficiary || "Beneficiary"}
                  </p>
                  <p className="text-gray-500 text-sm">Beneficiary</p>
                </div>
              </li>

              <li className="flex items-center space-x-3">
                <div className="bg-green-500 text-white uppercase w-10 h-10 flex justify-center items-center rounded-full font-bold">
                  {campaign?.state?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold capitalize">
                    {campaign?.state}
                  </p>
                  <p className="text-gray-500 text-sm">Location</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="w-full bg-white backdrop-blur-md p-4 mt-10 rounded-lg border border-gray-200 hidden sm:block">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {donations.length} Donations
            </h3>
            <hr className="my-3" />
            <ul className="space-y-6">
              {labelCandidates.map(({ donor, label }) => {
                const name = donor?.name || "Anonymous";
                const firstLetter = name.charAt(0).toUpperCase();
                const colors = letterColorMap[firstLetter] || {
                  bgColor: "#E0E0E0",
                  textColor: "#424242",
                };

                return (
                  <li
                    key={donor?.id || label}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 flex justify-center items-center rounded-full shadow-md overflow-hidden"
                        style={{ backgroundColor: colors.bgColor }}
                      >
                        <span
                          style={{ color: colors.textColor }}
                          className="font-bold text-lg uppercase"
                        >
                          {firstLetter}
                        </span>
                      </div>
                      {/* Name and Donation Info */}
                      <div>
                        <p className="text-gray-900 font-semibold capitalize">
                          {name}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-semibold text-[#d8573e] w-[100px] text-left">
                            ₹{donor?.amount || 0}
                          </p>
                          <span
                            className={`text-xs px-1 rounded ${labelStyles[label]}`}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Buttons */}
            <div className="flex mt-8 w-full text-sm">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("top");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "top" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View Top Donations
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("all");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "all" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View All Donations
              </button>
            </div>
            {/* Modal */}
            <DonorModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              topDonations={sortedByAmount.slice(0, visibleDonations)}
              allDonations={sortedByDate.slice(0, visibleDonations)}
              handleViewMore={handleViewMore}
              visibleDonations={visibleDonations}
              totalDonations={donations.length}
            />
          </div>
        </div>
      </div>

      <ShareCampaignModal
        isVisible={isShareModalVisible}
        handleClose={closeShareModal}
        campaignUrl={window.location.href}
      />
      {/* Login Modal */}
      <LoginModel
        open={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
        // must pass this correctly!
        isDonation={isDonation}
        setIsDonationModalVisible={setIsDonationModalVisible}
        setDonationuser={setDonationuser}
      />
      <DonationConfirmModal
        open={isDonationConfirmVisible}
        handleClose={() => setIsDonationConfirmVisible(false)}
        handleProceed={() => {
          setIsDonationConfirmVisible(false);
          setIsDonationModalVisible(true); // open donation form
        }}
      />

      {/* Donation Modal */}
      {isDonationModalVisible && (
        <DonationForm
          donationuser={donationuser}
          open={isDonationModalVisible}
          handleClose={closeDonationModal}
          setIsDonationModalVisible={setIsDonationModalVisible}
          donation_campaign_id={id}
          donation_amounts={finalDonation}
          campaign_title={campaign?.campaign_title}
          minimum_amount={campaign?.minimum_amount}
          target_amount={campaign?.target_amount}
        />
      )}

      {campaign?.is_approved === true && (
        <div className="visible md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full border-t flex justify-center py-2 bg-white z-50">
          <button
            onClick={() => {
              if (donationAmount === "other") {
                const val = parseInt(customAmount, 10);
                if (isNaN(val) || val < minAmount) {
                  setCustomAmount(minAmount.toString());
                  setError("");
                  openDonationModal(minAmount);
                  return;
                }
                openDonationModal(val);
              } else {
                openDonationModal(finalDonation);
              }
            }}
            disabled={!finalDonation || finalDonation <= 0}
            className="bg-[#d8573e] w-[90vw] text-white font-bold text-lg px-1 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-110 hover:bg-[#d8573e] focus:outline-none focus:ring-2 focus:ring-[#d8573e]"
          >
            DONATE ₹ {finalDonation || popularAmount}
          </button>
        </div>
      )}
    </div>
  );
};
export default CampaignPage;
