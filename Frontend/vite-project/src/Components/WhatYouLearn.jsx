import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react"; // ✅ Icon
import meditationImg from "../assets/Images/meditation.jpeg"; // 🧘 Local Image
import yogaImg from "../assets/Images/Yoga.jpeg"; // 🧍 Local Image

const WhatYouLearn = () => {
  const topics = [
    "Understand why PCOS is common in Indian women and how to reverse it naturally.",
    "Decode what your symptoms are telling you about your body.",
    "Learn the hormonal imbalances at play—and how to normalize them.",
    "Discover the hidden side effects of hormonal pills.",
    "See the long-term risks if PCOS is left untreated—and how to avoid them.",
    "Unlock the role of gut health in hormone balance and how to heal it.",
    "Explore simple meditation and stress-reduction techniques.",
    "Master easy, powerful yoga routines tailored for PCOS.",
    "Follow my complete reversal plan laid out clearly and effectively."
  ];

  return (
    <section
      id="learn"
      className="bg-gradient-to-r from-[#663398] to-[#9c4dcc] text-white px-6 py-16"
    >
      {/* Heading */}
      <motion.h2
        className="text-4xl font-extrabold mb-4 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        What You’ll <span className="text-[#FFB7C5]">Learn</span> in This Session
      </motion.h2>

      {/* Topics List */}
      <motion.ul
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {topics.map((topic, index) => (
          <motion.li
            key={index}
            className="flex items-start gap-3 bg-white/10 p-4 rounded-xl shadow-lg hover:bg-white/20 transition"
            whileHover={{ scale: 1.03 }}
          >
            <CheckCircle className="text-[#FFB7C5] mt-1 w-6 h-6 flex-shrink-0" />
            <p className="leading-relaxed">{topic}</p>
          </motion.li>
        ))}
      </motion.ul>

      {/* 🔽 E-Book Line moved here */}
      <motion.p
        className="text-center text-lg md:text-xl font-semibold text-[#FFB7C5] mb-10 mt-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        📖 E - Book for all Webinar Attendees
      </motion.p>

      {/* Bonus Section with Images */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        {/* Meditation Bonus */}
        <div className="bg-white/20 rounded-xl p-6 flex flex-col items-center shadow-xl">
          <img
            src={meditationImg}
            alt="Meditation Guide"
            className="w-24 h-32 object-contain mb-4 shadow-md bg-white"
          />
          <p className="text-lg font-semibold text-center">
            🧘 Meditation & Stress-Free Living Guide –{" "}
            <span className="text-[#FFB7C5]">
              Daily techniques to calm your mind, lower cortisol, and balance hormones.
            </span>
          </p>
        </div>

        {/* Yoga Bonus */}
        <div className="bg-white/20 rounded-xl p-6 flex flex-col items-center shadow-xl">
          <img
            src={yogaImg}
            alt="Yoga for PCOS"
            className="w-24 h-32 object-cover mb-4 shadow-md"
          />
          <p className="text-lg font-semibold text-center">
            🧍 Yoga for PCOS Guide –{" "}
            <span className="text-[#FFB7C5]">
              Simple, effective yoga poses to improve ovulation and reduce PCOS symptoms.
            </span>
          </p>
        </div>
      </motion.div>

      {/* Clients Countries Highlight */}
      <motion.div
        className="mt-12 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-lg md:text-xl font-semibold">
          🌍 Trusted by women across{" "}
          <span className="text-[#FFB7C5]">
            Malaysia, Saudi Arabia, Dubai, Thailand, Hong Kong, and the USA
          </span>{" "}
          to naturally reverse PCOS and regain confidence.
        </p>
      </motion.div>
    </section>
  );
};

export default WhatYouLearn;
