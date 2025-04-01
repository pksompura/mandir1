import React, { useState, useEffect, useRef } from "react";
import { CiUser } from "react-icons/ci";

const DonorModal = ({
  isModalOpen,
  setIsModalOpen,
  activeTab,
  setActiveTab,
  topDonations,
  allDonations,
}) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const initialVisible = 5;
  const [visibleDonations, setVisibleDonations] = useState(initialVisible);

  useEffect(() => {
    setVisibleDonations(initialVisible);
  }, [activeTab]);

  const displayedDonations =
    activeTab === "top"
      ? topDonations.slice(0, visibleDonations)
      : allDonations.slice(0, visibleDonations);

  const totalDonations =
    activeTab === "top" ? topDonations.length : allDonations.length;

  const handleViewMore = () => {
    setVisibleDonations((prev) => prev + 5);
  };
  return isModalOpen ? (
    <div className="absolute top-1 right-40 left-30 flex items-center justify-start bg-gray-800 bg-opacity-50 z-50 w-full h-full">
      {/* Modal Box */}
      <div
        ref={modalRef}
        className="w-full sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] bg-white p-6 rounded-lg border border-gray-200 shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>

        <div className="w-full">
          {/* Tab Buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "top" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("top")}
            >
              Top Donations
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Donations
            </button>
          </div>

          {/* Donation List */}
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {displayedDonations.map((donation) => (
              <li
                key={donation.id}
                className="p-2 border-b flex items-center space-x-3"
              >
                <div className="bg-gray-300 text-white w-10 h-10 flex justify-center items-center rounded-full shadow-md overflow-hidden">
                  {donation.avatar ? (
                    <img
                      src={donation.avatar}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <CiUser className="text-gray-600 w-6 h-6" />
                  )}
                </div>

                <div>
                  <span className="font-bold">{donation.name}</span> - ₹
                  {donation.amount}
                  <p className="text-xs text-gray-500">
                    {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* View More Button */}
          {visibleDonations < totalDonations && (
            <button
              onClick={handleViewMore}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md mt-4 hover:bg-gray-300 transition"
            >
              View More
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default DonorModal;
