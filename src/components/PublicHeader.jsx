"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiUserCircle, HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import LoginModel from "./LoginModel";
// import FormModal from "./AddCampaignForm";
import FundraiserWorkflow from "./FundraiserWorkflow";
import FundraiserModal from "./FundraiserModal";
import {
  useLazyGetUserProfileQuery,
  useLogoutMutation,
} from "../redux/services/campaignApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
import Swal from "sweetalert2";
import { MdOutlineCampaign } from "react-icons/md";
import { RiQuestionnaireLine } from "react-icons/ri"; // FAQ

const PublicHeader = () => {
  const navigate = useNavigate();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFundraiserModalOpen, setIsFundraiserModalOpen] = useState(false);

  const [token, setToken] = useState(null);
  const [fetchData, { data }] = useLazyGetUserProfileQuery();
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null); // Reference for dropdown
  const [logout] = useLogoutMutation();

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("mobileMenuToggle", { detail: isMobileMenuOpen })
    );
  }, [isMobileMenuOpen]);

  // const toggleDropdown = (event) => {
  //   event.stopPropagation(); // Prevents immediate closing after opening
  //   setIsProfileDropdownOpen((prev) => {
  //     const newState = !prev;

  //     // Dispatch event to notify CampaignPage
  //     window.dispatchEvent(
  //       new CustomEvent("profileDropdownChange", { detail: newState })
  //     );

  //     return newState;
  //   });
  // };

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsProfileDropdownOpen(false);
  //       window.dispatchEvent(
  //         new CustomEvent("profileDropdownChange", { detail: false })
  //       );
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // Toggle profile dropdown
  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsProfileDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   if (localStorage.getItem("authToken")) {
  //     const call = async () => {
  //       try {
  //         const res = await fetchData();
  //         if (res?.data?.status) {
  //           dispatch(
  //             setUserData({
  //               ...res?.data?.data,
  //               donations: res?.data?.donations,
  //             })
  //           );
  //         } else {
  //           localStorage.removeItem("authToken");
  //           window.location.reload();
  //         }
  //       } catch (error) {
  //         localStorage.removeItem("authToken");
  //         window.location.reload();
  //       }
  //     };
  //     call();
  //   }
  //   if (typeof window !== "undefined") {
  //     setToken(localStorage?.getItem("authToken"));
  //   }
  // }, []);
  // Fetch user profile on load if token exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchData().then((res) => {
        if (res?.data?.status) {
          dispatch(setUserData(res.data.data));
        } else {
          localStorage.removeItem("authToken");
        }
      });
    }
  }, []);
  // const handleLogout = async () => {
  //   try {
  //     await logout(token).unwrap();
  //     if (typeof window !== "undefined") {
  //       localStorage.removeItem("authToken");
  //     }
  //     setIsProfileDropdownOpen(false);
  //     setToken(null);
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  // Logout function
  const handleLogout = async () => {
    try {
      await logout(localStorage.getItem("authToken")).unwrap();
      localStorage.removeItem("authToken");
      dispatch(setUserData(null)); // clear user from Redux
      setIsProfileDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await axios.post(
  //       "https://devaseva.onrender.com/api/users/logout",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (typeof window !== "undefined") {
  //       localStorage?.removeItem("authToken");
  //       dispatch(setUserData());
  //     }
  //     setIsProfileDropdownOpen(false);
  //     setToken(null);
  //     window.location.href = "/";
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  const navigationLinks = [
    { name: "Explore Campaign", path: "/explore-campaign" },
    { name: "FAQ", path: "/faq" },
  ];
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="lg:w-[1190px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src="/giveaze2.png"
                  alt="Logo"
                  className="w-32 md:w-36 h-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-auto">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-[#545454] hover:text-[#7b7a7a] font-medium"
                >
                  {link.name}
                </a>
              ))}

              {/* Start Fundraiser Button */}
              {/* <button
                onClick={() => setIsFundraiserModalOpen(true)}
                className="border border-yellow-400 text-black px-4 py-[6px] rounded-full text-sm font-semibold transition duration-300 hover:bg-yellow-400 hover:text-black"
              >
                Start Fundraiser
              </button> */}
              {/* Start Fundraiser Button via Workflow */}
              <FundraiserWorkflow />

              {/* User Dropdown */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <HiUserCircle className="w-7 h-7 text-gray-700" />
                    <IoIosArrowDown className="w-4 h-4 text-gray-700" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 w-48 bg-white border rounded-md shadow-lg py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="w-4 h-4 mr-2" /> Account
                      </Link>
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You will be logged out.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, log me out",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }
                          });
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <HiOutlineLogout className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* If user not logged in */}
              {!user && (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-yellow-400 text-black px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-yellow-500"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-700 focus:outline-none"
              >
                <HiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-md py-4 px-4 flex flex-col space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-4">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/giveaze2.png" alt="Logo" className="w-28 h-auto" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/explore-campaign"
                  className="text-gray-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MdOutlineCampaign className="inline w-4 h-4 mr-2" />
                  Explore
                </Link>
                <Link
                  to="/faq"
                  className="text-gray-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <RiQuestionnaireLine className="inline w-4 h-4 mr-2" />
                  FAQ
                </Link>

                {!user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-yellow-400 text-black px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-yellow-500"
                    >
                      Login
                    </button>
                    {/* <button
                      onClick={() => {
                        setIsFundraiserModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="border border-yellow-400 text-black px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-yellow-400"
                    >
                      Start Fundraiser
                    </button> */}
                    <FundraiserWorkflow />
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="text-gray-700 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiUser className="inline w-4 h-4 mr-2" />
                      Account
                    </Link>
                    <button
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
                            setIsMobileMenuOpen(false);
                          }
                        });
                      }}
                      className="text-gray-700 font-medium flex items-center"
                    >
                      <HiOutlineLogout className="inline w-4 h-4 mr-2" />
                      Logout
                    </button>

                    {/* Start Fundraiser at the very end */}
                    {/* <button
                      onClick={() => {
                        setIsCampaignModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="border border-yellow-400 text-black px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-yellow-400 mt-2"
                    >
                      Start Fundraiser
                    </button> */}
                    <FundraiserWorkflow />
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      {/* <LoginModel
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOtpVerified={(user) => {
          dispatch(setUserData(user));
          setIsLoginModalOpen(false);
        }}
      /> */}
      <LoginModel
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOtpVerified={(user) => {
          dispatch(setUserData(user));
          setIsLoginModalOpen(false);
        }}
        fromFundraiser={false} // ✅ normal login flow
      />

      {/* Fundraiser Modal */}
      <FundraiserModal
        open={isFundraiserModalOpen}
        onClose={() => setIsFundraiserModalOpen(false)}
        onSuccess={(userData) => {
          setUser(userData); // Or dispatch Redux
          setIsCampaignModalOpen(true); // open campaign modal after login/register
        }}
      />
    </>
  );
};

export default PublicHeader;
//   return (
//     <>
//       <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
//         <div className="lg:w-[1190px] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               <Link to="/">
//                 <img
//                   src="/giveaze2.png"
//                   alt="Logo"
//                   className="w-32 md:w-36 h-auto"
//                 />
//               </Link>
//             </div>

//             {/* Desktop Navigation */}

//             {/* Action Buttons */}
//             <div className="flex items-center space-x-4">
//               {/* <button
//                 onClick={() => setIsCampaignModalOpen(true)}
//                 className="hidden sm:block bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-red-600 hover:to-yellow-600 transition duration-300"
//               >
//                 Start Campaign
//               </button> */}
//               <div className="hidden md:flex md:items-center md:space-x-6 mr-3">
//                 {navigationLinks.map((link) => (
//                   <a
//                     // key={link.name}
//                     href={link.path}
//                     className="text-[#545454] hover:text-[#7b7a7a] font-medium"
//                   >
//                     {link.name}
//                   </a>
//                 ))}
//               </div>
//               {user ? (
//                 <div
//                   className="relative  "
//                   onMouseLeave={() => {
//                     if (window.innerWidth >= 768)
//                       setIsProfileDropdownOpen(false);
//                   }}
//                   ref={dropdownRef}
//                 >
//                   {/* Start Fundraising Button */}
//                   {/* Start Fundraising Button (Desktop) */}
//                   <button
//                     onClick={() => setIsCampaignModalOpen(true)}
//                     className="hidden md:inline-block border border-[#ffdd04] text-black px-4 py-[6px] rounded-full text-sm font-semibold transition duration-300 hover:bg-[#ffdd04] hover:text-black"
//                   >
//                     Start Fundraising
//                   </button>
//                   <button
//                     onClick={toggleDropdown}
//                     className="flex items-center space-x-1 focus:outline-none"
//                   >
//                     <HiUserCircle className="w-6 h-6 text-gray-700" />
//                     <IoIosArrowDown className="w-4 h-4 text-gray-700" />
//                   </button>
//                   {isProfileDropdownOpen && (
//                     <div className="absolute right-0 w-48 bg-white border rounded-md shadow-lg py-2">
//                       <div className="md:hidden">
//                         <Link
//                           to="/explore-campaign"
//                           onClick={() => setIsProfileDropdownOpen(false)}
//                           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <MdOutlineCampaign className="w-4 h-4 mr-2" />
//                           Explore Campaign
//                         </Link>
//                         <Link
//                           to="/faq"
//                           onClick={() => setIsProfileDropdownOpen(false)}
//                           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           <RiQuestionnaireLine className="w-4 h-4 mr-2" />
//                           FAQ
//                         </Link>
//                         <hr className="my-1" />
//                       </div>
//                       <Link
//                         to="/profile"
//                         onClick={() => setIsProfileDropdownOpen(false)}
//                         className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
//                       >
//                         <FiUser className="w-4 h-4 mr-2" />
//                         Account
//                       </Link>
//                       <button
//                         onClick={() => {
//                           Swal.fire({
//                             title: "Are you sure?",
//                             text: "You will be logged out of your account.",
//                             icon: "warning",
//                             showCancelButton: true,
//                             confirmButtonColor: "#3085d6",
//                             cancelButtonColor: "#d33",
//                             confirmButtonText: "Yes, log me out",
//                           }).then((result) => {
//                             if (result.isConfirmed) {
//                               setIsProfileDropdownOpen(false);
//                               handleLogout();
//                             }
//                           });
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
//                       >
//                         <HiOutlineLogout className="w-4 h-4 mr-2" />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="hidden md:flex items-center space-x-3">
//                   {/* Start Fundraising (redirects to login if not logged in) */}
//                   <button
//                     onClick={() => {
//                       if (!user) {
//                         setIsLoginModalOpen(true);
//                       } else {
//                         setIsCampaignModalOpen(true);
//                       }
//                     }}
//                     className="border border-[#ffdd04] text-black px-4 py-[6px] rounded-full text-sm font-semibold transition duration-300 hover:bg-[#ffdd04] hover:text-black"
//                   >
//                     Start Fundraising
//                   </button>

//                   <button
//                     onClick={() => setIsLoginModalOpen(true)}
//                     className="bg-gradient-to-r  bg-[#ffdd04] text-black px-4 py-[5px] rounded-full text-sm font-semibold  transition duration-300"
//                   >
//                     Login
//                   </button>
//                 </div>
//               )}

//               {/* Mobile Menu Button */}
//               <div className="md:hidden">
//                 <button
//                   onClick={() => setIsMobileMenuOpen(true)}
//                   className="text-gray-700 focus:outline-none"
//                 >
//                   <HiMenu className="w-6 h-6 mt-1" />
//                 </button>
//               </div>
//               {/* </div> */}
//               {/* </div> */}
//               {/* </div> */}
//               {/* Mobile Drawer Menu */}
//               {isMobileMenuOpen && (
//                 <div className="fixed inset-0 z-40">
//                   {/* Overlay */}
//                   <div
//                     className="fixed inset-0 bg-black opacity-50"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   ></div>

//                   {/* Drawer */}
//                   <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-lg flex flex-col p-5 overflow-y-auto transition-transform duration-300">
//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-6">
//                       <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
//                         <img
//                           src="/giveaze2.png"
//                           alt="Logo"
//                           className="w-32 h-auto"
//                         />
//                       </Link>
//                       <button
//                         onClick={() => setIsMobileMenuOpen(false)}
//                         className="text-gray-700"
//                       >
//                         <HiX className="w-6 h-6" />
//                       </button>
//                     </div>

//                     {/* Links */}
//                     <nav className="flex flex-col space-y-4">
//                       {navigationLinks.map((link) => (
//                         <Link
//                           key={link.name}
//                           to={link.path}
//                           className="text-gray-700 text-lg font-medium hover:text-[#ffdd04]"
//                           onClick={() => setIsMobileMenuOpen(false)}
//                         >
//                           {link.name}
//                         </Link>
//                       ))}
//                     </nav>

//                     <div className="mt-6 flex flex-col space-y-3">
//                       {/* Start Fundraising */}
//                       <button
//                         onClick={() => {
//                           if (!user) {
//                             setIsLoginModalOpen(true);
//                           } else {
//                             setIsCampaignModalOpen(true);
//                           }
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="border border-[#ffdd04] text-black px-4 py-2 rounded-full text-base font-semibold hover:bg-[#ffdd04] hover:text-black transition duration-300"
//                       >
//                         Start Fundraising
//                       </button>

//                       {/* Login / Profile */}
//                       {!user ? (
//                         <button
//                           onClick={() => {
//                             setIsLoginModalOpen(true);
//                             setIsMobileMenuOpen(false);
//                           }}
//                           className="bg-[#ffdd04] text-black px-4 py-2 rounded-full text-base font-semibold hover:bg-yellow-400 transition duration-300"
//                         >
//                           Login
//                         </button>
//                       ) : (
//                         <>
//                           <Link
//                             to="/profile"
//                             className="flex items-center text-gray-700 hover:text-[#ffdd04] font-medium"
//                             onClick={() => setIsMobileMenuOpen(false)}
//                           >
//                             <FiUser className="w-5 h-5 mr-2" /> Profile
//                           </Link>
//                           <button
//                             onClick={() => {
//                               handleLogout();
//                               setIsMobileMenuOpen(false);
//                             }}
//                             className="flex items-center text-gray-700 hover:text-red-600 font-medium"
//                           >
//                             <HiOutlineLogout className="w-5 h-5 mr-2" /> Logout
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Mobile Menu */}
//               {/* {isMobileMenuOpen && (
//           <div className="fixed inset-0 z-40">
//             <div
//               className="fixed inset-0 bg-black opacity-50"
//               onClick={() => setIsMobileMenuOpen(false)}
//             ></div>
//             <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-md py-4 px-4 overflow-y-auto">
//               <div className="flex items-center justify-between mb-4">
//                 <Link to="/">
//                   <img src="/giveaze2.png" alt="Logo" className="w-32 h-auto" />
//                 </Link>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="text-gray-700 focus:outline-none"
//                 >
//                   <HiX className="w-6 h-6" />
//                 </button>
//               </div>
//               <nav className="flex flex-col space-y-4 ml-3">
//                 {navigationLinks.map((link) => (
//                   <Link
//                     key={link.name}
//                     to={link.path}
//                     className="text-gray-700 hover:text-blue-600 font-medium"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     {link.name}
//                   </Link>
//                 ))} */}
//               {/* <button
//                   onClick={() => {
//                     setIsCampaignModalOpen(true);
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="bg-gradient-to-r bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold  transition duration-300"
//                 >
//                    <a href="https://tally.so/r/w4Lgjb" target='_blank'>
//                   Start a Campaign
//                    </a>
//                 </button> */}
//               {/* {user?.mobile_number ? (
//                   <>
//                     <Link
//                       to="/profile"
//                       className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                     > */}
//               {/* <FiUser className="w-5 h-5 mr-2" /> */}
//               {/* Profile
//                     </Link>
//                     <button
//                       onClick={() => {
//                         handleLogout();
//                         setIsMobileMenuOpen(false);
//                       }}
//                       className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
//                     > */}
//               {/* <HiOutlineLogout className="w-5 h-5 mr-2" /> */}
//               {/* Logout
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setIsLoginModalOpen(true);
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="bg-gradient-to-r  to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-900 hover:to-yellow-600 transition duration-300"
//                   >
//                     Login
//                   </button>
//                 )}
//               {/* </nav> */}
//             </div>
//           </div>
//         </div>
//         {/* )} */}
//       </header>

//       {/* Modals */}
//       <LoginModel
//         open={isLoginModalOpen}
//         onClose={() => setIsLoginModalOpen(false)}
//         onOtpVerified={(user) => {
//           // Update header immediately

//           // Update Redux store
//           dispatch(setUserData(user));

//           // Close login modal
//           setIsLoginModalOpen(false);
//         }}
//       />

//       <FormModal
//         open={isCampaignModalOpen}
//         onClose={() => setIsCampaignModalOpen(false)}
//       />
//     </>
//   );
// };

// export default PublicHeader;
