import React from "react";
import { motion } from "framer-motion";
import ayishafarhanImage from "../assets/Images/ayisafarhanImage.jpeg"; // Trainer photo

const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col md:flex-row items-center justify-between px-6 py-16 bg-gradient-to-r from-pink-100 via-pink-50 to-purple-100 text-[#663398]"
    >
      {/* Text Section */}
      <motion.div
        className="md:w-1/2 mb-8 md:mb-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Highlighted Name */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Hi, I’m{" "}
          <motion.span
            className="relative text-[#FF4B91] font-extrabold"
            animate={{ opacity: [1, 0.4, 1] }} // Blink effect
            transition={{ duration: 1, repeat: Infinity }}
          >
            Ayisafarhan
            {/* Moving underline */}
            <motion.span
              className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#FF4B91] rounded-full"
              animate={{ x: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.span>
        </h2>

        {/* Description */}
        <p className="mb-4 leading-relaxed text-base md:text-lg">
          I’m a <span className="font-bold text-[#4b2671]">Gold Medalist</span> and{" "}
          <span className="font-bold text-[#4b2671]">University Topper</span> with over{" "}
          <span className="font-bold text-[#FF4B91]">5 years of experience</span> as a PCOS and fertility dietitian.
          I specialize in <span className="italic">Tamil-based diet plans</span> that are practical, affordable, and effective.
        </p>

        <p className="leading-relaxed text-base md:text-lg">
          I help women regain their periods naturally, improve fertility, and achieve healthy weight loss without crash diets or harmful shortcuts.
          Having faced PCOS and infertility myself, I conceived naturally in just 3 months without medical interventions.
        </p>

        {/* Stats Section */}
        <motion.div
          className="flex flex-wrap gap-6 mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="bg-white shadow-lg rounded-xl p-4 text-center w-36 sm:w-40 hover:scale-105 transition">
            <p className="text-2xl md:text-3xl font-extrabold text-[#FF4B91]">5+</p>
            <p className="text-sm font-semibold">Years Experience</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-4 text-center w-36 sm:w-40 hover:scale-105 transition">
            <p className="text-2xl md:text-3xl font-extrabold text-[#663398]">1000+</p>
            <p className="text-sm font-semibold">Clients Globally</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="md:w-1/2 flex justify-center"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={ayishafarhanImage}
          alt="Ayisafarhan"
          className="rounded-full w-48 h-48 sm:w-64 sm:h-64 object-cover border-8 border-[#FFB7C5] shadow-xl"
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </section>
  );
};

export default About;
