import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "../assets/Images/Logo.jpeg";

const Navbar = ({ onAdminLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // Persist login status using localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      if (res.status === 200 && data.success) {
        setIsLoggedIn(true);
        setShowLoginBox(false);
        localStorage.setItem("token", data.token); // save JWT token
        if (onAdminLogin) onAdminLogin(true);
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Check console for details.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials({ username: "", password: "" });
    localStorage.removeItem("token");
    if (onAdminLogin) onAdminLogin(false);
  };

  return (
    <motion.nav
      className="bg-white shadow-md px-6 py-3 flex items-center justify-between relative"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left - Logo */}
      <div className="flex items-center">
        <motion.img src={Logo} className="h-12 w-auto object-contain" />
      </div>

      {/* Right - Menu / Login / Logout */}
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <motion.div
            className="w-10 h-10 rounded-full bg-[#FFB7C5] flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLoginBox(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#663398]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </motion.div>
        ) : (
          <button
            className="bg-[#663398] text-white px-4 py-2 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLoginBox && !isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLoginBox(false)}
          ></div>

          {/* Box */}
          <div className="relative bg-white p-5 sm:p-6 rounded-lg shadow-lg w-72 sm:w-80 z-50">
            {/* Close X Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setShowLoginBox(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#663398]">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                className="border p-2 rounded"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className="bg-[#663398] text-white py-2 rounded"
              >
                Login
              </button>
              <button
                type="button"
                className="text-red-500 mt-1"
                onClick={() => setShowLoginBox(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
