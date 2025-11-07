import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is Mysticpace Platform?",
      answer:
        "www.mysticpace.com is India’s trusted platform that helps verified temples, goshalas, pathshalas, and charitable trusts raise support for their causes — including temple renovation, cow care, food donation, and education.",
    },
    {
      question: "How does my donation reach the campaign?",
      answer:
        "Your donation is transferred directly to the verified campaigner’s (temple or trust) bank account through our secure payment gateway. Mysticpace Platform does not hold or delay your contribution.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes. All payments on Mysticpace Platform are processed through Razorpay, a trusted and fully encrypted payment gateway. Your details remain 100% safe and confidential.",
    },
    {
      question: "What is the “Tip” I see during checkout?",
      answer:
        "The Tip is completely optional. It helps Mysticpace Platform cover operational costs like technology upkeep, payment security, verification of campaigns, and donor support. Your entire donation still goes to the cause you choose — the tip only supports the platform’s maintenance and transparency.",
    },
    {
      question: "Will I receive a receipt for my donation?",
      answer:
        "Yes. You will receive a payment receipt immediately after donating. If the campaigner (temple or trust) has 80G registration, you can also request an 80G donation receipt from them for tax exemption.",
    },
    {
      question: "How do I know if a campaign is genuine?",
      answer:
        "Before going live, every campaign is verified by the Mysticpace Platform team. We check trust registration, documents, and bank details to ensure complete authenticity and compliance.",
    },
    {
      question: "Can I support more than one cause?",
      answer:
        "Absolutely! You can contribute to as many causes as you wish — temple renovation, food seva, education, animal welfare, or dharmic projects. Every contribution makes a difference.",
    },
    {
      question: "Can I stay updated after donating?",
      answer:
        "Yes. You’ll receive campaign updates, photos, or progress posts whenever shared by the temple or trust. This helps you stay connected with the impact of your donation.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-[#fffaf7] py-10 px-4 md:px-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center mb-6"
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
        className="w-full flex flex-col items-center space-y-3"
      >
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          const contentId = `faq-content-${index}`;
          return (
            <motion.div
              key={index}
              variants={item}
              className="w-full md:w-[90%] lg:w-[85%] bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
              >
                <span className="font-semibold text-gray-800 text-base md:text-lg">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-[#d6573d] transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id={contentId}
                role="region"
                aria-labelledby={`faq-heading-${index}`}
                className={`px-5 pb-4 text-gray-600 text-sm md:text-base transition-all duration-300 ${
                  isOpen
                    ? "max-h-96 opacity-100 overflow-visible"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mt-8"
      >
        <p className="italic text-gray-700 font-medium text-base md:text-lg">
          “Every act of giving strengthens Sanatana Dharma and brings hope to
          those who need it most.”
        </p>
      </motion.div>
    </section>
  );
};

export default FAQ;
