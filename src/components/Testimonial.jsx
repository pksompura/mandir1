// import React from 'react';

// const testimonials = [
//   {
//     name: "Shri Mehandipur Balaji Temple Trust",
//     designation: "Bangalore",
//     feedback:
//       "Our temple’s restoration was not just a physical transformation but a spiritual revival. The temple had lost its vibrancy, but with Giveaze’s intervention, it has been given new life and ensured that both the spiritual and practical needs of the temple were met.",
//     image: "/1.jpeg", // Replace with actual image path
//   },
//   {
//     name: "Shri Shyam Baba Temple Trust",
//     designation: "Pune",
//     feedback:
//       "The restoration of our temple was not just about repairing walls; it was about reviving a place of spiritual connection for thousands. Giveaze made this possible with their dedication and transparency.",
//     image: "/2.jpeg", // Replace with actual image path
//   },
//   {
//     name: "Shri Karni Mata Mandir Trust",
//     designation: "Udaipur",
//     feedback:
//       "From improving infrastructure to ensuring regular maintenance, Giveaze has helped us sustain the temple for future generations. Their support has been invaluable in keeping our traditions alive.",
//     image: "/3.jpeg", // Replace with actual image path
//   },
// ];

// const Testimonials = () => {
//   return (
//     <section className="bg-gray-100 py-5 px-3">
//       <div className="xl:w-[1200px] mx-auto text-center">
//         <h2 className="text-3xl font-bold mb-2">What Fundraisers Say</h2>
//         {/* <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p> */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {testimonials.map((testimonial, index) => (
//             <div key={index} className="bg-white p-6 rounded-lg shadow-lg col-span">
//               <div className="mb-2">
//                 <img
//                   src={testimonial.image}
//                   alt={testimonial.name}
//                   className="w-16 h-16 mx-auto rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-semibold">{testimonial.name}</h3>
//               <p className="text-gray-500 mb-4">{testimonial.designation}</p>
//               <p className="text-gray-700 text-sm">{testimonial.feedback}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;
import React from "react";

const testimonials = [
  {
    name: "Pradeep C.",
    designation: "Donor (Bengaluru)",
    feedback:
      "🌸 “A Divine Way to Give Back” — I always wanted to support temple renovations but didn’t know how to reach genuine causes. Mysticpace Platform made it simple and transparent — I could see exactly where my donation went. It feels wonderful to be part of preserving our heritage.",
  },
  {
    name: "Sri Hinglaj Mataji Temple Trust",
    designation: "Chennai",
    feedback:
      "🕉️ “Our Temple Found Hope Through Mysticpace” — As a small temple trust, we struggled to raise funds for urgent restoration. Through Mysticpace, we connected with hundreds of donors across India. Their transparent process and timely fund transfers helped us complete the renovation within months.",
  },
  {
    name: "Gokul Goshala",
    designation: "Rajasthan",
    feedback:
      "🐄 “Supporting Gowshalas Has Never Been Easier” — Mysticpace helped us raise funds for our goshala’s feeding and medical care. Donors could track updates, and the support we received was heartwarming. A platform truly dedicated to seva and dharma.",
  },
  {
    name: "Rahul Mehta",
    designation: "Donor (Mumbai)",
    feedback:
      "📿 “A Platform You Can Trust” — What I appreciate most is the authenticity. Every campaign is verified, and funds are transferred directly to the temple or NGO’s account. Mysticpace is doing noble work by bringing transparency to religious and charitable giving.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-b from-[#fffaf7] to-[#fefefe] py-16 px-5">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#d6573d] mb-3">
          🌼 Testimonials
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-12 max-w-2xl mx-auto">
          Hear from donors and temple trusts who’ve experienced the power of
          giving through Mysticpace.
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between text-left"
            >
              <p className="text-gray-700 text-sm md:text-base leading-relaxed italic mb-5">
                {t.feedback}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                  {t.name}
                </h3>
                <p className="text-gray-500 text-sm">{t.designation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quote
        <div className="mt-12 text-gray-700 text-base md:text-lg italic font-medium">
          “Every act of giving strengthens Sanatana Dharma and brings hope to
          those who need it most.”
        </div> */}
      </div>
    </section>
  );
};

export default Testimonials;
