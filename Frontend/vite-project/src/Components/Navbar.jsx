import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import Logo from "../assets/Images/Logo.jpeg";

const Navbar = ({ onAdminLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "E-Books", href: "#e-books" },
    { label: "Fertility Stories", href: "#fertility stories" },
    { label: "Contact", href: "#contact" },
  ];

  // Persist login status using localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://pcos-webinar.onrender.com/api/admin/login", {
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
      className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left - Logo */}
      <div className="flex items-center">
        <motion.img src={Logo} className="h-12 w-auto object-contain" />
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-gray-700 hover:text-[#663398] transition"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop Login/Logout */}
      <div className="hidden md:flex items-center space-x-4">
        {!isLoggedIn ? (
          <button
            onClick={() => setShowLoginBox(true)}
            className="bg-[#FFB7C5] px-4 py-2 rounded-lg text-[#663398] font-medium"
          >
            Admin Login
          </button>
        ) : (
          <button
            className="bg-[#663398] text-white px-4 py-2 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-white shadow-md md:hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <ul className="flex flex-col gap-4 p-4">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block text-gray-700 hover:text-[#663398] transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setShowLoginBox(true);
                    setMobileOpen(false);
                  }}
                  className="bg-[#FFB7C5] px-4 py-2 rounded-lg text-[#663398] font-medium"
                >
                  Admin Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="bg-[#663398] text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

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
