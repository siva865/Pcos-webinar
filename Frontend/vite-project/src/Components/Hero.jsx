import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminContext } from "./Admin";

const Hero = () => {
  const { isAdmin } = useContext(AdminContext);

  // Webinar details from database
  const [webinar, setWebinar] = useState({
    date: "", // ISO string
    day: "",
    time: "",
    language: "",
    price: "99",
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showAdminBox, setShowAdminBox] = useState(false);
  const [status, setStatus] = useState("");

  // New fields for admin update
  const [newDate, setNewDate] = useState("");
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newPrice, setNewPrice] = useState("99");

  // Load webinar details from backend
  useEffect(() => {
    axios
      .get("https://pcos-webinar.onrender.com/api/webinars")
      .then((res) => {
        if (res.data && res.data.webinar) {
          setWebinar({
            date: res.data.webinar.date || "",
            day: res.data.webinar.day || "",
            time: res.data.webinar.time || "",
            language: res.data.webinar.language || "",
            price: String(res.data.webinar.price || "99"),
          });
        }
      })
      .catch(() => console.log("Failed to fetch webinar details"));
  }, []);

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!webinar.date) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      const webinarDateTime = new Date(`${webinar.date}T${webinar.time}`).getTime();
      const now = new Date().getTime();
      const distance = webinarDateTime - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [webinar.date, webinar.time]);

  // Handle Razorpay booking
  const handleBooking = () => {
    const paymentLink = "   https://rzp.io/rzp/EAP6tcY";
    window.open(paymentLink, "_blank");

    // Show WhatsApp link after 5 sec
    setTimeout(() => setShowWhatsApp(true), 5000);
  };

  // Admin update webinar
  const handleUpdateWebinar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://pcos-webinar.onrender.com/api/webinars", {
        date: newDate,
        day: newDay,
        time: newTime,
        language: newLanguage,
        price: Number(newPrice),
      });
      if (res.data.success) {
        setWebinar({
          date: res.data.webinar.date,
          day: res.data.webinar.day,
          time: res.data.webinar.time,
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
    <section className="bg-[#FFB7C5] text-[#663398] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center w-full max-w-lg"
      >
        {/* Headline */}
        
       
        <motion.h2 className="text-base sm:text-lg md:text-2xl mb-6 leading-relaxed">
          From Irregular Periods to Pregnancy — The Permanent Solution for PCOS & Infertility (No Supplements or Medicine)
        </motion.h2>

 {/* Subheading */}
        <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug">
          Ayisafarhan’s Step-by-Step Plan to Reverse PCOS and Get Pregnant Naturally
        </motion.h1>

        {/* Date, Day, Time, Language */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <p><span className="font-bold">Date:</span> {webinar.date ? new Date(webinar.date).toLocaleDateString() : "TBA"}</p>
          <p><span className="font-bold">Day:</span> {webinar.day || "TBA"}</p>
          <p><span className="font-bold">Time:</span> {webinar.time || "TBA"}</p>
          <p><span className="font-bold">Language:</span> {webinar.language || "TBA"}</p>
          <p className="text-red-600 font-semibold mt-2">*Limited seats available*</p>
        </div>

        {/* Countdown */}
        <motion.div className="flex justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
          {Object.entries(timeLeft).map(([key, value]) => (
            <div key={key} className="bg-white shadow-md rounded-lg p-2 sm:p-3 w-14 sm:w-16">
              <p className="text-lg sm:text-2xl font-bold">{value}</p>
              <p className="text-[10px] sm:text-xs uppercase">{key}</p>
            </div>
          ))}
        </motion.div>

        {/* Book Now */}
        <motion.button
          className="bg-[#663398] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#4b2671] transition text-sm sm:text-base"
          onClick={handleBooking}
        >
          Book Now ₹{webinar.price && !isNaN(webinar.price) ? webinar.price : 99} Only
        </motion.button>
        <p className="mt-2 text-xs sm:text-sm">🎁 Free Bonus for All Attendees</p>

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
                    placeholder="Day"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
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
