import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminContext } from "./Admin";

const Hero = () => {
  const { isAdmin } = useContext(AdminContext);

  const [webinar, setWebinar] = useState({
    date: "",
    dayTime: "",
    language: "",
    price: "99",
  });

  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showAdminBox, setShowAdminBox] = useState(false);
  const [status, setStatus] = useState("");

  const [newDate, setNewDate] = useState("");
  const [newDayTime, setNewDayTime] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newPrice, setNewPrice] = useState("99");

  // ✅ Load webinar details
  useEffect(() => {
    axios
      .get("https://pcos-webinar.onrender.com/api/webinars")
      .then((res) => {
        if (res.data && res.data.webinar) {
          setWebinar({
            date: res.data.webinar.date || "",
            dayTime: res.data.webinar.dayTime || "",
            language: res.data.webinar.language || "",
            price: String(res.data.webinar.price || "99"),
          });
        }
      })
      .catch(() => console.log("Failed to fetch webinar details"));
  }, []);

  const handleBooking = () => {
    const paymentLink = "https://rzp.io/rzp/EAP6tcY";
    window.open(paymentLink, "_blank");
    setTimeout(() => setShowWhatsApp(true), 5000);
  };

  const handleUpdateWebinar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://pcos-webinar.onrender.com/api/webinars", {
        date: newDate,
        dayTime: newDayTime,
        language: newLanguage,
        price: Number(newPrice),
      });
      if (res.data.success) {
        setWebinar({
          date: res.data.webinar.date,
          dayTime: res.data.webinar.dayTime,
          language: res.data.webinar.language,
          price: String(res.data.webinar.price),
        });
        setStatus("✅ Webinar updated successfully!");
      } else {
        setStatus("❌ Failed to update webinar");
      }
    } catch {
      setStatus("❌ Server error");
    }
  };

  return (
    <section id="#" className="bg-[#FFB7C5] text-[#663398] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center w-full max-w-lg"
      >
        <motion.h2 className="text-base sm:text-lg md:text-2xl mb-6 leading-relaxed">
          From Irregular Periods to Pregnancy — The Permanent Solution for PCOS & Infertility (No Supplements or Medicine)
        </motion.h2>

        <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug">
          Ayisafarhan’s Step-by-Step Plan to Reverse PCOS and Get Pregnant Naturally
        </motion.h1>

        {/* ✅ Date, Day + Time, Language */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <p>
            <span className="font-bold">Date:</span>{" "}
            {webinar.date ? new Date(webinar.date).toLocaleDateString() : "TBA"}
          </p>
          <p>
            <span className="font-bold">Day & Time:</span>{" "}
            {webinar.dayTime || "TBA"}
          </p>
          <p>
            <span className="font-bold">Language:</span>{" "}
            {webinar.language || "TBA"}
          </p>
          <p className="text-red-600 font-semibold mt-2">
            *Limited seats available*
          </p>
        </div>

        {/* Book Now */}
        <motion.button
          className="bg-[#663398] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4b2671] transition text-base"
          onClick={handleBooking}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Book Now ₹{webinar.price && !isNaN(webinar.price) ? webinar.price : 99} Only
        </motion.button>

        {/* WhatsApp modal */}
        {showWhatsApp && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
              <h3 className="text-xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h3>
              <p className="mb-4">Click below to join our WhatsApp group 👇</p>
              <a
                href="https://chat.whatsapp.com/JKHjnZYLKT76mMwUoY0UT6?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition inline-block"
              >
                👉 Join WhatsApp Group
              </a>
            </div>
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-8">
            {!showAdminBox ? (
              <button
                onClick={() => setShowAdminBox(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                ⚙️ Edit Webinar
              </button>
            ) : (
              <div className="bg-white shadow-md p-6 rounded-lg max-w-md mx-auto relative">
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAdminBox(false)}
                >
                  ✕
                </button>
                <h3 className="text-lg font-bold mb-4">Update Webinar Details</h3>
                <form onSubmit={handleUpdateWebinar} className="flex flex-col gap-4">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Day & Time (ex: Tuesday, 4 PM IST)"
                    value={newDayTime}
                    onChange={(e) => setNewDayTime(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Language"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price in ₹"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value || "99")}
                    className="border px-4 py-2 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Webinar
                  </button>
                </form>
                {status && <p className="mt-2 text-sm">{status}</p>}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;
