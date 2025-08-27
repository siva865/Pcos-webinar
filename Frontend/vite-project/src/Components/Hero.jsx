import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminContext } from "./Admin";

const Hero = () => {
  const { isAdmin } = useContext(AdminContext);
  const [webinarDate, setWebinarDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [newDate, setNewDate] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAdminBox, setShowAdminBox] = useState(false);
  const [price, setPrice] = useState("99"); // default 99
  const [showWhatsApp, setShowWhatsApp] = useState(false); // ✅ new state

  // Load webinar details
  useEffect(() => {
    axios
      .get("https://pcos-webinar.onrender.com/api/webinars")
      .then((res) => {
        if (res.data) {
          if (res.data.webinarDate) setWebinarDate(new Date(res.data.webinarDate));
          if (res.data.price !== undefined && res.data.price !== null) setPrice(String(res.data.price));
        }
      })
      .catch(() => console.log("Failed to fetch webinar details"));
  }, []);

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!webinarDate) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      const now = new Date().getTime();
      const distance = webinarDate - now;
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
  }, [webinarDate]);

  // Booking form submit
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1️⃣ Save booking first
      const res = await axios.post("https://pcos-webinar.onrender.com/api/bookings", formData);
      console.log("Booking response:", res.data);
      const bookingId = res.data.booking._id;

      // 2️⃣ Update payment status in MongoDB (as you asked)
      await axios.put(`https://pcos-webinar.onrender.com/api/bookings/${bookingId}/pay`);

      // 3️⃣ Open your Razorpay Payment Link in a new tab
      const paymentLink =
        "https://razorpay.me/@ayisafarhan?amount=KxK8ikz%2BGFZ8lMDydVeeuA%3D%3D";
      window.open(paymentLink, "_blank");

      // 4️⃣ Show WhatsApp link after 5 sec
      setTimeout(() => {
        setShowWhatsApp(true);
      }, 5000);
    } catch (err) {
      console.error(err);
      alert("Error processing booking/payment!");
    } finally {
      setLoading(false);
    }
  };

  // Admin update webinar
  const handleUpdateDate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://pcos-webinar.onrender.com/api/webinars", {
        webinarDate: newDate,
        price: Number(price),
      });
      if (res.data.success) {
        setWebinarDate(new Date(res.data.webinar.webinarDate));
        setPrice(String(res.data.webinar.price));
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
        <motion.h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-snug">
          Tired of Hormonal Pills?
        </motion.h1>
        <motion.h2 className="text-base sm:text-lg md:text-2xl mb-6 leading-relaxed">
          From Irregular Periods to Pregnancy — The Permanent Solution for PCOS & Infertility (No Supplements or Medicine)
        </motion.h2>

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
          onClick={() => setShowForm(true)}
        >
          Book Now ₹{price && !isNaN(price) ? price : 99} Only
        </motion.button>
        <p className="mt-2 text-xs sm:text-sm">🎁 Free Bonus for All Attendees</p>

        {/* Booking Form */}
        {showForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-bold mb-4">Complete Your Booking</h3>
              <form onSubmit={handleBooking} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#663398] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4b2671] transition w-full"
                >
                  {loading ? "Processing..." : `Submit & Pay ₹${price && !isNaN(price) ? price : 99}`}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ✅ WhatsApp link modal */}
        {showWhatsApp && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
              <h3 className="text-xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h3>
              <p className="mb-4">Click below to join our WhatsApp group 👇</p>
              <a
                href="  https://chat.whatsapp.com/JKHjnZYLKT76mMwUoY0UT6?mode=ac_t"
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
                <form onSubmit={handleUpdateDate} className="flex flex-col gap-4">
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Webinar Price in ₹"
                    value={price}
                    onChange={(e) => setPrice(e.target.value || "99")}
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
