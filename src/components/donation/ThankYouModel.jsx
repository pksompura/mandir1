import React from "react";
import { X } from "lucide-react";

const ThankYouModal = ({ donorName, amount, onClose, campaign_title }) => {
  const shareText = `Hey! ${donorName} just donated ₹${amount} to support a good cause via Giveaze Foundation. You can too! ❤️ Visit: https://giveaze.com`;

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    const url = `https://wa.me/?text=${encodedText}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl md:p-6 p-2 w-[90%] max-w-md shadow-xl relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="flex justify-center mb-4">
          <img
            src="/giveaze2.png"
            alt="Thank You"
            className="w-24 max-h-24 object-contain" // Adjust image size
          />
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-center text-green-700 mb-2">
          Hey {donorName}, you're awesome! 🎉
        </h2>
        <p className="text-center text-gray-700">
          <br />
          Thank you for donating <strong>₹{amount}</strong> towards <br />
          <br />
          <span className="font-semibold">{campaign_title}</span>.
        </p>

        <p className="text-center text-sm mt-4 text-gray-500">
          Your kind act brings us closer to our mission. Share and inspire more
          hearts! 💚
        </p>

        {/* WhatsApp Share */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleWhatsAppShare}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-full flex items-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-5 h-5"
            />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
