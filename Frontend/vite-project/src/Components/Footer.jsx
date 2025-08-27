import React from "react";
import { FaWhatsapp, FaPhone, FaInstagram, FaGoogle } from "react-icons/fa";

const Footer = () => {
  const whatsappNumber = "9342602293"; 
  const whatsappMessage = "Hi mam, I’m interested in the PCOS Webinar. Please share details.";

  return (
    <footer className="bg-[#FFB7C5] text-[#663398] py-6 flex justify-center gap-6">
      {/* WhatsApp */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
        target="_blank" 
        rel="noreferrer"
      >
        <FaWhatsapp size={28} />
      </a>

      {/* Phone */}
      <a href="tel:+917904625269">
        <FaPhone size={28} />
      </a>

      {/* Instagram */}
      <a 
        href="https://www.instagram.com/pcos.dietician_ayisafarhan?igsh=anQ0b3I4ajhjcnU4" 
        target="_blank" 
        rel="noreferrer"
      >
        <FaInstagram size={28} />
      </a>

      {/* Google link */}
      <a 
        href="https://share.google/tdhiMKxs1nH1kCTzN" 
        target="_blank" 
        rel="noreferrer"
      >
        <FaGoogle size={28} />
      </a>
    </footer>
  );
};

export default Footer;
