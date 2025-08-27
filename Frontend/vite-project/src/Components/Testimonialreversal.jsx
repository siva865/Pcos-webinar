import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AdminContext } from "./Admin";

const Testimonialreversal = () => {
  const { isAdmin } = useContext(AdminContext);

  const [testimonials, setTestimonials] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", city: "", text: "" });

  // Fetch testimonials from backend
  useEffect(() => {
    fetch("https://pcos-webinar.onrender.com/api/testimonials")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data);
          setExpanded(new Array(data.length).fill(false));
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const toggleExpand = (index) => {
    setExpanded(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Add or Update Testimonial
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${newTestimonial.name}, ${newTestimonial.city}`;
    const newEntry = { name: fullName, review: newTestimonial.text };

    if (editIndex !== null) {
      // Edit mode
      const editingTestimonial = testimonials[editIndex];
      try {
        const res = await fetch(`https://pcos-webinar.onrender.com/api/testimonials/${editingTestimonial._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });
        const updatedTestimonial = await res.json();
        setTestimonials(prev => {
          const updated = [...prev];
          updated[editIndex] = updatedTestimonial;
          return updated;
        });
      } catch (err) {
        console.error("Error updating testimonial:", err);
      }
    } else {
      // Add mode
      try {
        const res = await fetch("https://pcos-webinar.onrender.com/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });
        const savedTestimonial = await res.json();
        setTestimonials(prev => [...prev, savedTestimonial]);
        setExpanded(prev => [...prev, false]);
      } catch (err) {
        console.error("Error saving testimonial:", err);
      }
    }

    setNewTestimonial({ name: "", city: "", text: "" });
    setShowForm(false);
    setEditIndex(null);
  };

  // Delete testimonial
  const handleDelete = async (id) => {
    try {
      await fetch(`https://pcos-webinar.onrender.com/api/testimonials/${id}`, { method: "DELETE" });
      setTestimonials(prev => prev.filter(t => t._id !== id));
      setExpanded(prev => prev.slice(0, prev.length - 1)); // maintain array size
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  // Edit fill
  const handleEdit = (index) => {
    const [name, city = ""] = testimonials[index].name.split(", ");
    setNewTestimonial({ name, city, text: testimonials[index].review });
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-r from-[#FFB7C5] to-[#FFB7C5]/20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#663398] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          PCOS Reversal Success Stories
        </motion.h2>

        <p className="text-center text-[#663398] mb-12">
          Real results from women who followed our PCOS reversal program
        </p>

        {isAdmin && (
          <div className="text-center mb-8">
            <button
              onClick={() => { setShowForm(!showForm); setEditIndex(null); }}
              className="bg-[#663398] text-white px-4 py-2 rounded-lg shadow hover:bg-[#53287a] transition"
            >
              {showForm ? "Close Form" : "Add Testimonial"}
            </button>
          </div>
        )}

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mb-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              required
              className="w-full border rounded p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Enter your city"
              value={newTestimonial.city}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, city: e.target.value })}
              required
              className="w-full border rounded p-2 mb-3"
            />
            <textarea
              placeholder="Enter your testimonial"
              value={newTestimonial.text}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
              required
              className="w-full border rounded p-2 mb-3"
            />
            <button
              type="submit"
              className="bg-[#FFB7C5] text-[#663398] px-4 py-2 rounded-lg shadow hover:bg-pink-300 transition"
            >
              {editIndex !== null ? "Update" : "Submit"}
            </button>
          </form>
        )}

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 py-4"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                className={`flex-shrink-0 bg-white rounded-xl shadow-md p-4 transition-all duration-300 ${
                  expanded[index] ? "w-80" : "w-60"
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-bold text-[#663398] text-center mb-3">{testimonial.name}</h3>

                <p
                  className={`text-gray-700 text-sm italic text-justify transition-all duration-300 ${
                    expanded[index] ? "" : "line-clamp-3"
                  }`}
                >
                  "{testimonial.review}"
                </p>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => toggleExpand(index)}
                    className="text-xs text-[#663398] font-semibold hover:underline"
                  >
                    {expanded[index] ? "Show Less" : "More"}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <span className="inline-block px-3 py-1 bg-[#FFB7C5] text-[#663398] rounded-full text-xs font-semibold">
                    PCOS Reversal
                  </span>
                </div>

                {isAdmin && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 justify-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-[#663398] hover:text-[#FFB7C5] text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="text-red-600 hover:text-red-800 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonialreversal;
