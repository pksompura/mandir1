// import React from "react";
// import {
//   FaHandHoldingHeart,
//   FaShoppingCart,
//   FaCheckSquare,
//   FaGift,
// } from "react-icons/fa";

// const HowItWorks = () => {
//   const steps = [
//     {
//       icon: <FaHandHoldingHeart className="text-[#f7d046]" size={50} />,
//       heading: "Choose a Cause",
//       subHeading: "Explore the campaigns and choose a cause to support.",
//     },
//     {
//       icon: <FaShoppingCart className="text-[#f7d046]" size={50} />,
//       heading: "Enter Donation Amount",
//       subHeading: "Choose the donation amount you wish to contribute.",
//     },
//     {
//       icon: <FaCheckSquare className="text-[#f7d046]" size={50} />,
//       heading: "Finalize Your Donation",
//       subHeading: "Proceed to checkout and pay for your contribution.",
//     },
//     {
//       icon: <FaGift className="text-[#f7d046]" size={50} />,
//       heading: "Donations Delivered",
//       subHeading: "Get Updates as your Donations Reach Those in Need.",
//     },
//   ];

//   return (
//     <div className=" w-full md:w-[82%] my-4 mx-auto px-4">
//       <h1 className="text-xl font-bold text-black">How you can support ?</h1>
//       <div className="grid gid-cols-1 md:grid-cols-4  gap-6 pt-2">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center p-4 bg-[#faf8f0] rounded-lg  border-2"
//           >
//             <div className="mb-4 w-fit mr-auto">{step.icon}</div>
//             <div className="font-semibold text-lg text-left w-full">
//               {step.heading}
//             </div>
//             <div className="text-gray-600 text-left mt-2">
//               {step.subHeading}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HowItWorks;
import React from "react";
import {
  FaHandsHelping,
  FaRupeeSign,
  FaRegCheckCircle,
  FaEye,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaHandsHelping className="text-[#f7d046]" size={44} />,
      heading: "Choose a Cause",
      subHeading:
        "Browse through heartfelt campaigns and pick the cause that connects with your soul — temple restoration, goshalas, education, or food seva.",
    },
    {
      icon: <FaRupeeSign className="text-[#f7d046]" size={44} />,
      heading: "Enter Your Donation Amount",
      subHeading:
        "Decide the amount you wish to contribute — every rupee counts towards preserving Dharma.",
    },
    {
      icon: <FaRegCheckCircle className="text-[#f7d046]" size={44} />,
      heading: "Complete Your Contribution",
      subHeading:
        "Proceed to checkout and make your donation securely through our trusted payment gateway.",
    },
    {
      icon: <FaEye className="text-[#f7d046]" size={44} />,
      heading: "Track the Donation",
      subHeading:
        "Receive updates and see how your donation is uplifting sacred causes and communities in need.",
    },
  ];

  return (
    <section className="w-full bg-[#fffaf7] py-10 px-5">
      <div className="w-full md:w-[82%] mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#d6573d] mb-8">
          🌼 How You Can Support
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center md:items-start text-center md:text-left p-6 bg-[#faf8f0] rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="mb-3">{step.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {step.heading}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {step.subHeading}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
