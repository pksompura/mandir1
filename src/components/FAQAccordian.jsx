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
        "Giveaze Foundation is India’s trusted online donation platform that helps verified NGOs, temples, charitable trusts, and social initiatives raise funds for genuine causes — including healthcare, education, food donation, animal welfare, women empowerment, and community development.",
    },
    {
      question: "How does my donation reach the campaign?",
      answer:
        "Your contribution is transferred directly to the verified campaign organizer’s bank account through our secure payment system. Giveaze Foundation ensures transparency and does not hold or delay your donations.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Absolutely. All transactions on Giveaze Foundation are processed through Razorpay, a PCI DSS–compliant and fully encrypted payment gateway. Your payment details remain 100% safe and confidential.",
    },
    {
      question: "What is the “Tip” option shown during checkout?",
      answer:
        "The tip is completely optional and helps Giveaze Foundation sustain its operations — including platform maintenance, secure payment handling, donor assistance, and campaign verification. Your entire donation still goes to the cause you support — the tip only helps maintain transparency and platform upkeep.",
    },
    {
      question: "Will I receive a receipt for my donation?",
      answer:
        "Yes. You’ll receive an instant payment receipt after donating. If the campaign organizer has 80G registration, you may also request an 80G tax exemption receipt directly from them.",
    },
    {
      question: "How do you verify the campaigns?",
      answer:
        "Every campaign listed on Giveaze Foundation goes through a strict verification process. We review trust registration, legal documents, and bank details to ensure only authentic and compliant organizations can raise funds.",
    },
    {
      question: "Can I donate to multiple causes?",
      answer:
        "Of course. You can contribute to as many causes as you wish — healthcare, education, food seva, animal care, temple development, or humanitarian aid. Every contribution helps make a difference.",
    },
    {
      question: "Will I receive updates about my donation?",
      answer:
        "Yes. You’ll receive updates, photos, and progress reports shared by the organization or trust you supported. This ensures you stay connected with the impact of your generosity.",
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-[#fffaf7] py-10 px-4 md:px-12">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#d6573d]">
          Quick FAQ for Donors
        </h2>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          For Devotees and Supporters of Giveaze Foundation
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto space-y-3" // reduced space
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
    </section>
  );
};

export default FAQ;
