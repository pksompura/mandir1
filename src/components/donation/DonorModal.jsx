import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

const DonorModal = ({
  isModalOpen,
  setIsModalOpen,
  activeTab,
  setActiveTab,
  topDonations,
  allDonations,
}) => {
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

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      closable={false}
      centered
      maskClosable={true}
      destroyOnClose
      className="custom-donor-modal"
      width="100%" // Full width control
      style={{ maxWidth: "600px", margin: "0 auto" }} // Limit modal size on large screens
    >
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✖
            </button>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-4 mb-4 justify-center">
              <button
                className={`px-4 py-2 rounded-full transition font-semibold text-sm sm:text-base ${
                  activeTab === "top"
                    ? "bg-[#545454] text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
                onClick={() => setActiveTab("top")}
              >
                Top Donations
              </button>
              <button
                className={`px-4 py-2 rounded-full transition font-semibold text-sm sm:text-base ${
                  activeTab === "all"
                    ? "bg-[#545454] text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Donations
              </button>
            </div>

            {/* Donation List */}
            <ul className="space-y-3 max-h-64 overflow-y-auto px-1 sm:px-2">
              {displayedDonations.map((donation) => (
                <motion.li
                  key={donation.id}
                  className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-md shadow-sm border"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-gray-300 text-white w-10 h-10 flex justify-center items-center rounded-full shadow-md overflow-hidden">
                    {donation.avatar ? (
                      <img
                        src={donation.avatar}
                        className="w-full h-full object-cover"
                        alt="avatar"
                      />
                    ) : (
                      <CiUser className="text-gray-600 w-6 h-6" />
                    )}
                  </div>
                  <div className="text-sm sm:text-base">
                    <span className="font-semibold">{donation.name}</span>{" "}
                    <span className="text-gray-700">- ₹{donation.amount}</span>
                    <p className="text-xs text-gray-500">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* View More */}
            {visibleDonations < totalDonations && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleViewMore}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-medium text-sm sm:text-base"
                >
                  View More
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default DonorModal;
