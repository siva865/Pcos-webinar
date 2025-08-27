import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import WhatYouLearn from "./Components/WhatYouLearn";
import Testimonialreversal from "./Components/Testimonialreversal";
import Footer from "./Components/Footer";
import TestimonialsPregnancy from "./Components/TestimonialPregnanacy";
import { AdminProvider } from "./Components/Admin";  



function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AdminProvider>
      <Navbar onAdminLogin={setIsAdmin} />
      <Hero />
      <About />
      <WhatYouLearn />
      <Testimonialreversal />
      <TestimonialsPregnancy />
      <Footer />
    </AdminProvider>
  );
}

export default App;
