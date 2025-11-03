// import React from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import { FaChevronDown } from "react-icons/fa";
// import { styled } from "@mui/system";

// const Root = styled("div")({
//   width: "100%",
// });

// // const CustomAccordion = styled(Accordion)({
// //   backgroundColor: 'green', // light red color
// //   margin: '8px 0',
// //   borderRadius:"10px",
// //   color:'black'
// // });

// const Summary = styled(AccordionSummary)({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
// });

// const Icon = styled(FaChevronDown)({
//   color: "black", // dark color for the icon
// });

// const Question = styled(Typography)({
//   fontWeight: "bold",
//   color: "black",
// });

// const FAQ = () => {
//   const faqData = [
//     {
//       question: "What is the mission of Giveaze Foundation?",
//       answer:
//         "Our mission is to preserve India's sacred heritage by renovating, restoring, and maintaining India's temples.",
//     },
//     {
//       question: "How do you ensure transparency in the use of donations?",
//       answer:
//         "We ensure transparency by providing detailed reports on the utilization of donations, which are audited by independent third-party auditors.",
//     },
//     {
//       question: "How do you select the temples for renovation and restoration?",
//       answer:
//         "We select temples based on their historical significance, cultural importance, and current state of disrepair.",
//     },
//     {
//       question: "Can I specify which temple I want my donation to go towards?",
//       answer:
//         "Yes, you can donate by selecting the specific campaign which temple you want your donation to go towards.",
//     },
//     {
//       question: "How can I get involved with the initiative?",
//       answer:
//         "You can get involved by donating, volunteering, or spreading the word about our initiative. Please email us at info@giveaze.com for more information.",
//     },
//     {
//       question: "Who manages the day-to-day operations of the initiative?",
//       answer:
//         "Our team of experienced professionals manages the day-to-day operations of the initiative.",
//     },
//     {
//       question:
//         "How can I track the progress of the temple renovation and restoration projects?",
//       answer:
//         "We will provide regular updates on the progress of the projects through our website, social media, and email newsletters.",
//     },
//   ];

//   return (
//     <Root>
//       {faqData.map((faq, index) => (
//         <Accordion key={index}>
//           <Summary
//             expandIcon={<Icon />}
//             aria-controls={`panel${index}-content`}
//             id={`panel${index}-header`}
//           >
//             <Question>{faq.question}</Question>
//           </Summary>
//           <AccordionDetails>
//             <Typography>{faq.answer}</Typography>
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </Root>
//   );
// };

// export default FAQ;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is Giveaze Foundation?",
      answer:
        "Giveaze Foundation (giveaze.com) is India’s trusted online platform that helps verified temples, goshalas, pathshalas, and charitable trusts raise support for their causes — including temple renovation, cow care, food donation, and dharmic education.",
    },
    {
      question: "How does my donation reach the campaign?",
      answer:
        "Your donation goes directly to the verified campaigner’s (temple or trust) bank account through our secure payment gateway. Giveaze Foundation does not hold or delay your contribution.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes. All donations made through Giveaze Foundation are processed using Razorpay, a trusted and fully encrypted payment gateway. Your personal and financial details are completely safe and confidential.",
    },
    {
      question: "What is the “Tip” shown during checkout?",
      answer:
        "The Tip is optional. It helps Giveaze Foundation maintain its technology platform, ensure payment security, verify campaigns, and offer donor support. Your entire donation still goes to your chosen cause — the tip supports our transparency and upkeep.",
    },
    {
      question: "Will I receive a receipt for my donation?",
      answer:
        "Yes. You will receive a payment receipt immediately after donating. If the temple or trust is registered under 80G, you can also request an 80G donation receipt for tax exemption directly from them.",
    },
    {
      question: "How do you verify campaigns?",
      answer:
        "Every campaign is verified by the Giveaze Foundation team before going live. We check trust registration, ownership documents, bank details, and cause authenticity to ensure genuine campaigns.",
    },
    {
      question: "Can I donate to more than one campaign?",
      answer:
        "Of course! You can contribute to as many causes as you wish — temple renovation, anna dhanam, goshalas, dharmic education, or welfare projects. Every act of giving matters.",
    },
    {
      question: "Will I get updates after donating?",
      answer:
        "Yes. You’ll receive updates, photos, or progress posts whenever shared by the temple or trust, helping you stay connected with your impact.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-[#fffaf7] py-10 px-4 md:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#d6573d]">
          Quick FAQ for Donors
        </h2>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          (For Devotees and Supporters)
        </p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto space-y-3"
      >
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            variants={item}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center px-5 py-4 text-left"
            >
              <span className="font-semibold text-gray-800 text-base md:text-lg">
                {faq.question}
              </span>
              <FaChevronDown
                className={`text-[#d6573d] transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`px-5 pb-4 text-gray-600 text-sm md:text-base transition-all duration-300 ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {faq.answer}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mt-8"
      >
        <p className="italic text-gray-700 font-medium text-base md:text-lg">
          “Every act of giving strengthens Sanatana Dharma and brings hope to
          those who need it most.”
        </p>
        {/* <a
          href="https://giveaze.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-[#d6573d] font-semibold hover:underline"
        >
          Visit giveaze.com →
        </a> */}
      </motion.div>
    </section>
  );
};

export default FAQ;
