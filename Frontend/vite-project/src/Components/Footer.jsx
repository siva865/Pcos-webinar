import React from "react";
import { FaWhatsapp, FaPhone, FaInstagram, FaGoogle } from "react-icons/fa";

const Footer = () => {
  const whatsappNumber = "9342602293"; 
  const whatsappMessage = "Hi mam, I’m interested in the PCOS Webinar. Please share details.";
  const phoneNumber = "+91 7904625269";
  const instagramHandle = "@pcos.dietician_ayisafarhan";
  const googleLink = "https://share.google/tdhiMKxs1nH1kCTzN";

  return (
    <footer className="bg-[#FFB7C5] text-[#663398] py-8 flex flex-col md:flex-row justify-center items-center gap-10">
      {/* WhatsApp */}
      <div className="flex flex-col items-center">
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
          target="_blank" 
          rel="noreferrer"
        >
          <FaWhatsapp size={28} />
        </a>
        <p className="mt-2 text-sm">{whatsappNumber}</p>
      </div>

      {/* Phone */}
      <div className="flex flex-col items-center">
        <a href={`tel:${phoneNumber}`}>
          <FaPhone size={28} />
        </a>
        <p className="mt-2 text-sm">{phoneNumber}</p>
      </div>

      {/* Instagram */}
      <div className="flex flex-col items-center">
        <a 
          href="https://www.instagram.com/pcos.dietician_ayisafarhan" 
          target="_blank" 
          rel="noreferrer"
        >
          <FaInstagram size={28} />
        </a>
        <p className="mt-2 text-sm">{instagramHandle}</p>
      </div>

      {/* Google link */}
      <div className="flex flex-col items-center">
        <a 
          href={googleLink} 
          target="_blank" 
          rel="noreferrer"
        >
          <FaGoogle size={28} />
        </a>
        <p className="mt-2 text-sm">Google Link</p>
      </div>
    </footer>
  );
};

export default Footer;
