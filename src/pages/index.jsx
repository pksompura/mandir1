import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllCampaignQuery,
  useLazyGetCampaignQuery,
} from "../redux/services/campaignApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button, Tooltip } from "@mui/material";
import { CiHeart } from "react-icons/ci";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import ImpactKartComponent from "../components/ImpactKartComponent";
import FundraisingBanner from "../components/YourCampaign";
import FAQ from "../components/FAQAccordian";
import Testimonials from "../components/Testimonial";
import "swiper/css";
import "swiper/css/pagination";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { data } from "autoprefixer";
import { IMAGE_BASE_URL } from "../utils/imageUrl";

const HeroSlider = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const paginationRef = useRef(null);
  const { data: campaigns } = useGetAllCampaignQuery();

  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.classList.add("custom-swiper-pagination");
    }
  }, [paginationRef]);
  return (
    <section>
      <HeroSection />
      <div className="py-10 px-3 bg-center bg-cover mt-[0px]">
        <h1 className="text-3xl font-bold text-center">Featured Campaigns</h1>
        <p className="mx-auto my-1 text-center">
          Discover Causes that Need Your Immediate Attention
        </p>

        <div className="min-h-96 px-2 w-full md:w-[80%] mx-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={20} // ✅ default gap for all devices
            navigation={true}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24, // tablet gap
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 32, // medium gap
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20, // desktop gap
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop
            speed={1000}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full my-3"
          >
            {campaigns?.campaigns
              ? campaigns?.campaigns
                  ?.filter((data) => !data.hidden)
                  .map((data, i) => (
                    <SwiperSlide
                      // className="flex items-center w-full justify-center mb-6"
                      className="mb-6"
                      key={i}
                    >
                      <Link to={`/campaign/${data?._id}`}>
                        {/* <div className="bg-white rounded-lg cursor-pointer shadow-md overflow-hidden border-2 p-2 h-[470px] w-[330px] md:h-[480px] md:w-[350px] lg:h-[480px] lg:w-[350px] mx-auto flex flex-col"> */}
                        <div className="bg-white rounded-lg cursor-pointer shadow-md overflow-hidden border-2 p-2 h-[470px] md:h-[480px] flex flex-col w-full">
                          <div className="relative">
                            <img
                              src={
                                data?.main_picture?.startsWith("/images/")
                                  ? `${IMAGE_BASE_URL}${data.main_picture}`
                                  : data?.main_picture
                              }
                              alt={data?.campaign_title}
                              className="w-full h-48 object-cover rounded"
                            />
                            {data?.is_tax && (
                              <img
                                alt=""
                                src="/images/tax.png"
                                className="w-16 absolute right-1 top-1"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex gap-3">
                              {data?.is_validated ? (
                                <img
                                  src="/images/VALIDATED.png"
                                  alt=""
                                  className="w-16"
                                />
                              ) : (
                                // Empty content to keep the space even when is_tax is not found
                                <div className="bg-transparent w-5 h-5 flex items-center justify-center" />
                              )}
                            </div>
                            <h3 className="mt-1 text-[17px] font-bold h-[50px] leading-snug overflow-hidden line-clamp-2">
                              {data?.campaign_title}
                            </h3>

                            <div className="mt-4">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <h2 className="text-lg font-extrabold text-[#d8573e] animate-pulse">
                                    ₹
                                    {data?.raised_amount?.$numberDecimal || "0"}{" "}
                                  </h2>
                                  <h4 className="text-gray-600 text-sm">
                                    Raised
                                  </h4>
                                </div>
                                <span>
                                  {Math.round(
                                    (Math.round(
                                      data?.raised_amount?.$numberDecimal
                                    ) /
                                      Math.round(
                                        data?.target_amount?.$numberDecimal
                                      )) *
                                      100
                                  ) || 0}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                                {/* ₹ {data?.raised_amount?.$numberDecimal || "0"} */}

                                <div
                                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (Math.round(
                                        data?.raised_amount?.$numberDecimal
                                      ) /
                                        Math.round(
                                          data?.target_amount?.$numberDecimal
                                        )) *
                                        100 || 0
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-600 my-1">
                                <span>
                                  Goal ₹
                                  {data?.target_amount.$numberDecimal || "0"}
                                </span>
                                <span>
                                  {data?.successfulDonations || 0} Donors
                                </span>
                              </div>

                              <hr className="h-2 my-2" />
                              {data?.is_approved == true ? (
                                <Link to={`/campaign/${data?._id}`}>
                                  <button className="w-full flex gap-2 items-center justify-center bg-[#d6573d] text-white font-bold py-2 px-4 rounded-full">
                                    <div className="relative">
                                      Donate Now{" "}
                                      <span>
                                        <CiHeart className="animate-ping absolute -right-8 top-[5px]" />
                                      </span>
                                    </div>
                                  </button>
                                </Link>
                              ) : (
                                <Link to={`/campaign/${data?._id}`}>
                                  <button className="w-full flex gap-2 items-center justify-center bg-[#d6573d] text-white font-bold py-2 px-4 rounded-full">
                                    <div className="relative">
                                      View Updates
                                      <span>
                                        <CiHeart className="animate-ping absolute -right-8 top-[5px]" />
                                      </span>
                                    </div>
                                  </button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <SwiperSlide key={i + "skeleton"}>
                    <CampaignSkeleton />
                  </SwiperSlide>
                ))}

            <div ref={paginationRef} className="swiper-pagination"></div>
          </Swiper>
          <a href="/explore-campaign" id="faq">
            <button className="flex gap-2 items-center justify-center bg-[#d6573d] h-[30px]  text-white font-bold py-2 px-4 rounded ml-auto">
              View All <FaRegArrowAltCircleRight />{" "}
            </button>
          </a>
        </div>
      </div>

      {/* <FundraisingBanner /> */}

      {/* <div className="bg-gray-100">

      <div className="flex flex-col md:flex-row w-full md:w-[85%] mx-auto justify-between items-center px-6 py-12 0 md:px-20 md:py-16 my-8">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Contribute and Gain Tax Benefits</h2>
          <p className="text-lg mb-4">Every contribution at Donate for Health comes with tax advantages. Download your 80G Tax Certificate and save on your taxes.</p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img src="https://ketto-partner.gumlet.io/assets/images/save-jar.png?w=400&dpr=1.3" alt="Save Jar" className="w-64 md:w-80 object-cover" />
        </div>
      </div>
      </div> */}

      <HowItWorks />
      <ImpactKartComponent />
      <Testimonials />
      <div className="px-3 md:px-10 my-4 w-full md:w-[85%] mx-auto">
        <h2 className="text-2xl font-bold text-center">FAQs</h2>
        <p className="text-center">
          {/* Clear all your doubts here regarding how things work */}
        </p>
        <FAQ />
      </div>
    </section>
  );
};

export default HeroSlider;

const CampaignSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 p-2 animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded"></div>
      <div className="p-4">
        <div className="bg-gray-300 rounded-full h-4 w-1/3 mb-2"></div>
        <div className="bg-gray-300 rounded-full h-4 w-1/2 mb-2"></div>
        <div className="bg-gray-300 rounded-full h-4 w-2/3 mb-2"></div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="bg-gray-300 rounded-full h-4 w-1/3"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-gray-300 h-2.5 rounded-full w-1/2"></div>
          </div>
          <p className="text-sm text-gray-600 my-1 bg-gray-300 rounded-full h-4 w-1/4"></p>
          <hr className="h-2 my-2" />
          <div className="bg-gray-300 rounded-full h-10 w-full"></div>
        </div>
      </div>
    </div>
  );
};
