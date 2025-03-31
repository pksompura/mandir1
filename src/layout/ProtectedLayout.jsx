import { Col, Layout, Row, theme } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

// import { AuthContext } from "../providers/AuthProvider";
// import { assets } from "../../assets";

const { Header, Content, Sider } = Layout;

const ProtectedLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <>
      <PublicHeader />
      <Outlet />
      <section
        className=" pt-2  border-t w-full bg-[#faf8f0]"
        //  style={{backgroundImage:"url(/images/back12.png)"}}
      >
        <div className="  w-full mx-auto lg:container px-4 sm:mt- sm:px-6 lg:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 pb-3 border-b-2 border-gray-200">
            <div className="flex flex-col gap-8 xl:gap-4 w-full lg:max-w-full mx-auto">
              <div className="flex flex-col gap-2 md:mt-4">
                <h2 className="font-manrope font-bold text-4xl leading-snug text-black max-[470px]:text-center">
                  <Link to={"/"}>
                    <img
                      src="/giveaze2.png"
                      alt="logo"
                      className="w-36 mx-auto md:mx-0"
                    />
                  </Link>
                </h2>
                <p className="text-base ml-2 font-normal text-black max-[470px]:text-center">
                  Protecting Tradition, Empowering Devotion.
                </p>
                <div className="flex space-x-4 text-[#545454] md:justify-start justify-center md:ml-3 mt-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-[#d6573d]"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-[#d6573d]"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-[#d6573d]"
                  >
                    <FaYoutube size={20} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-[#d6573d]"
                  >
                    <FaX size={20} />
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full lg:max-w-full mx-auto flex flex-col mb-2 min-[470px]:flex-row justify-between gap-4 -mt-10 md:mt-4 sm:gap-20 md:gap-10 xl:gap-24">
              <div className="">
                <h6 className="text-lg font-bold text-[#d8573e] mb-3 max-[470px]:text-center">
                  Quick Links{" "}
                </h6>
                <ul className="flex flex-col max-[470px]:items-center max-[470px]:justify-center gap-3">
                  <li>
                    <a
                      href="/about-us"
                      className="text-base font-normal max-lg:text-center text-black blackspace-nowrap transition-all duration-300 hover:text-yellow-800 focus-within:outline-0 focus-within:text-yellow-800"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy-policy"
                      className="text-base font-normal max-lg:text-center text-black blackspace-nowrap transition-all duration-300 hover:text-yellow-800 focus-within:outline-0 focus-within:text-yellow-800"
                    >
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-base font-normal max-lg:text-center text-black blackspace-nowrap transition-all duration-300 hover:text-yellow-800 focus-within:outline-0 focus-within:text-yellow-800"
                    >
                      Terms of Use
                    </a>
                  </li>
                </ul>
              </div>
              <div className="">
                <h6 className="text-lg font-bold text-[#d8573e] mb-3 max-[470px]:text-center">
                  Contact Us
                </h6>
                <ul className="flex flex-col max-[470px]:items-center max-[470px]:justify-center gap-3">
                  <li>
                    <a
                      href="tel:+917676931982"
                      onClick={(e) => {
                        if (window.innerWidth > 1024) {
                          e.preventDefault(); // Prevents execution on large screens
                        }
                      }}
                      className="text-base font-normal max-lg:text-center text-black whitespace-nowrap transition-all duration-300 hover:text-yellow-800 focus-within:outline-0 focus-within:text-yellow-800"
                    >
                      +91 7676931982
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@giveaze.com"
                      onClick={(e) => {
                        if (window.innerWidth > 1024) {
                          e.preventDefault(); // Prevents execution on large screens
                        }
                      }}
                      className="text-base font-normal max-lg:text-center text-black whitespace-nowrap transition-all duration-300 hover:text-yellow-800 focus-within:outline-0 focus-within:text-yellow-800"
                    >
                      info@giveaze.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:;"
                      className="text-center md:text-left font-normal text-black blackspace-nowrap transition-all duration-300 hover:text-yellow-800 focus-within:outline-0 focus-within:text-yellow-800"
                    >
                      <p>
                        MPC1705, Parkwest, Hosakere Road
                        <br /> Binnypet, Bangalore - 560023
                      </p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-5 py-4">
            <p className=" text-sm text-center font-bold">
              © <a href="https://giveaze.com">Giveaze Foundation</a>{" "}
              {new Date().getFullYear()}, All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
export default ProtectedLayout;
