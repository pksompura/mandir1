// import { IoClose } from "react-icons/io5";
// import Modal from "@mui/material/Modal";
// import { Player } from "@lottiefiles/react-lottie-player";

// export default function DonationConfirmModal({
//   open,
//   handleClose,
//   handleProceed,
// }) {

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="donation-confirm-modal"
//       className="flex justify-center sm:items-center items-end"
//     >
//       <div className="relative w-full sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[300px] bg-white rounded-lg">
//         {/* Close Button */}
//         <div className="w-full flex justify-end">
//           <button
//             onClick={handleClose}
//             className="text-gray-600 hover:text-red-500 transition duration-200"
//           >
//             <IoClose className="text-2xl" />
//           </button>
//         </div>

//         {/* GIF Image (top center) */}
//         {/* <div className="flex justify-center mb-4">
//           <img
//             src="/images/Donaciones.gif"
//             alt="Donation Illustration"
//             className="h-28 w-28 object-contain"
//           />
//         </div> */}
//         <div className="flex justify-center mb-4">
//           <Player
//             autoplay
//             loop
//             src="/images/Donaciones.json"
//             style={{ height: "240px", width: "240px" }}
//           />
//         </div>

//         {/* Content */}
//         <div className="flex flex-col items-center text-center px-4">
//           <h3 className="text-xl font-semibold mb-2 text-gray-800">
//             Your kindness can light up lives ✨
//           </h3>
//           <p className="text-sm text-gray-700 mb-6">
//             At <span className="font-bold">Mysticpace Platform</span>, every
//             contribution helps us bring hope, education, and support to those in
//             need. Even if today is not the right time, your future donation can
//             still create a powerful change. 💖
//           </p>

//           {/* Action Buttons */}
//           <div className="flex gap-4 mt-2">
//             <button
//               onClick={handleProceed}
//               className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-lg shadow-md transition"
//             >
//               ✅ Yes, I will do
//             </button>
//             <button
//               onClick={handleClose}
//               className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg shadow-md transition"
//             >
//               🙏 Sorry, not today
//             </button>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// }
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "@mui/material/Modal";
import { Player } from "@lottiefiles/react-lottie-player";

export default function DonationConfirmModal({
  open,
  handleClose,
  handleProceed,
}) {
  // ✅ Prevent background scroll on mobile and desktop
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY;
    } else {
      const scrollY = document.body.dataset.scrollY || "0";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY) * -1);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="donation-confirm-modal"
      disableScrollLock={false} // ✅ Keep MUI's default scroll lock
      className="flex justify-center sm:items-center items-end"
    >
      <div className="relative w-full sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px] p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[300px] bg-white rounded-lg">
        {/* Close Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-red-500 transition duration-200"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Animation */}
        <div className="flex justify-center mb-4">
          <Player
            autoplay
            loop
            src="/images/Donaciones.json"
            style={{ height: "240px", width: "240px" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center px-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Your kindness can light up lives ✨
          </h3>
          <p className="text-sm text-gray-700 mb-6">
            At <span className="font-bold">Mysticpace Platform</span>, every
            contribution helps us bring hope, education, and support to those in
            need. Even if today is not the right time, your future donation can
            still create a powerful change. 💖
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleProceed}
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-lg shadow-md transition"
            >
              ✅ Yes, I will do
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg shadow-md transition"
            >
              🙏 Sorry, not today
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
