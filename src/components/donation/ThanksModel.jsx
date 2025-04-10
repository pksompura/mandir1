import React from "react";
import { X } from "lucide-react";

const ThankYouModal = ({ donorName, amount, onClose }) => {
  const shareText = `Hey! ${donorName} just donated ₹${amount} to support a good cause via Giveaze Foundation. You can too! ❤️ Visit: https://giveaze.com`;

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    const url = `https://wa.me/?text=${encodedText}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
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
            src="https://i.imgur.com/PejYGLR.png"
            alt="Thank You"
            className="w-24"
          />
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-center text-green-700 mb-2">
          Hey {donorName}, you're awesome! 🎉
        </h2>
        <p className="text-center text-gray-700">
          Thank you for donating <strong>₹{amount}</strong> towards <br />
          <span className="font-semibold">
            Sponsor Education & Food of Children in India
          </span>
          .
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
